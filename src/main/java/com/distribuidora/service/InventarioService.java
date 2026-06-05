package com.distribuidora.service;

import com.distribuidora.exception.BusinessException;
import com.distribuidora.exception.InsufficientStockException;
import com.distribuidora.model.dto.AjusteStockDTO;
import com.distribuidora.model.dto.MovimientoStockDTO;
import com.distribuidora.model.entity.MovimientoStock;
import com.distribuidora.model.entity.Producto;
import com.distribuidora.model.enums.TipoMovimiento;
import com.distribuidora.repository.MovimientoStockRepository;
import com.distribuidora.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InventarioService {

    private final MovimientoStockRepository movimientoStockRepository;
    private final ProductoRepository productoRepository;

    @Transactional
    public MovimientoStockDTO registrarAjusteManual(AjusteStockDTO ajusteDTO) {
        Producto producto = productoRepository.findById(ajusteDTO.getProductoId())
                .orElseThrow(() -> new BusinessException("Producto no encontrado"));

        if (ajusteDTO.getTipo() == TipoMovimiento.EGRESO && producto.getStockActual() < ajusteDTO.getCantidad()) {
            throw new InsufficientStockException("Stock insuficiente para el producto: " + producto.getNombre());
        }

        if (ajusteDTO.getTipo() == TipoMovimiento.INGRESO || ajusteDTO.getTipo() == TipoMovimiento.AJUSTE) {
            producto.setStockActual(producto.getStockActual() + ajusteDTO.getCantidad());
        } else if (ajusteDTO.getTipo() == TipoMovimiento.EGRESO) {
            producto.setStockActual(producto.getStockActual() - ajusteDTO.getCantidad());
        }

        productoRepository.save(producto);

        MovimientoStock movimiento = MovimientoStock.builder()
                .producto(producto)
                .tipo(ajusteDTO.getTipo())
                .cantidad(ajusteDTO.getCantidad())
                .motivo(ajusteDTO.getMotivo())
                .fechaHora(LocalDateTime.now())
                .build();

        return mapToDTO(movimientoStockRepository.save(movimiento));
    }

    @Transactional(readOnly = true)
    public List<MovimientoStockDTO> obtenerHistorialMovimientos() {
        return movimientoStockRepository.findAll(Sort.by(Sort.Direction.DESC, "fechaHora")).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private MovimientoStockDTO mapToDTO(MovimientoStock movimiento) {
        return MovimientoStockDTO.builder()
                .id(movimiento.getId())
                .productoId(movimiento.getProducto().getId())
                .productoNombre(movimiento.getProducto().getNombre())
                .tipo(movimiento.getTipo())
                .cantidad(movimiento.getCantidad())
                .motivo(movimiento.getMotivo())
                .fechaHora(movimiento.getFechaHora())
                .build();
    }
}
