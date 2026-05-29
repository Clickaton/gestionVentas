package com.distribuidora.service;

import com.distribuidora.exception.BusinessException;
import com.distribuidora.exception.InsufficientStockException;
import com.distribuidora.model.dto.DetalleVentaDTO;
import com.distribuidora.model.dto.DetalleVentaResponseDTO;
import com.distribuidora.model.dto.VentaRequestDTO;
import com.distribuidora.model.dto.VentaResponseDTO;
import com.distribuidora.model.entity.CajaDiaria;
import com.distribuidora.model.entity.DetalleVenta;
import com.distribuidora.model.entity.Producto;
import com.distribuidora.model.entity.Venta;
import com.distribuidora.model.enums.EstadoCaja;
import com.distribuidora.model.enums.TipoCliente;
import com.distribuidora.repository.CajaDiariaRepository;
import com.distribuidora.repository.ProductoRepository;
import com.distribuidora.repository.VentaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VentaService {

    private final VentaRepository ventaRepository;
    private final ProductoRepository productoRepository;
    private final CajaDiariaRepository cajaDiariaRepository;

    @Transactional(isolation = Isolation.READ_COMMITTED)
    public VentaResponseDTO registrarVenta(VentaRequestDTO requestDTO) {

        CajaDiaria caja = cajaDiariaRepository.findByFecha(LocalDate.now())
                .orElseThrow(() -> new BusinessException("No hay una caja abierta para el día de hoy"));

        if (caja.getEstado() == EstadoCaja.CERRADA) {
            throw new BusinessException("La caja de hoy ya se encuentra cerrada");
        }

        Venta venta = Venta.builder()
                .fechaHora(LocalDateTime.now())
                .tipoCliente(requestDTO.getTipoCliente())
                .total(BigDecimal.ZERO)
                .build();

        BigDecimal totalVenta = BigDecimal.ZERO;

        for (DetalleVentaDTO detalleDTO : requestDTO.getDetalles()) {
            Producto producto = productoRepository.findById(detalleDTO.getProductoId())
                    .orElseThrow(() -> new BusinessException("Producto no encontrado con id: " + detalleDTO.getProductoId()));

            if (!producto.getActivo()) {
                throw new BusinessException("El producto " + producto.getNombre() + " no está activo");
            }

            if (producto.getStockActual() < detalleDTO.getCantidad()) {
                throw new InsufficientStockException("Stock insuficiente para el producto: " + producto.getNombre()
                        + ". Stock actual: " + producto.getStockActual());
            }

            // Descontar stock
            producto.setStockActual(producto.getStockActual() - detalleDTO.getCantidad());
            productoRepository.save(producto);

            // Calcular precio según tipo de cliente
            BigDecimal precioUnitario = requestDTO.getTipoCliente() == TipoCliente.MAYORISTA
                    ? producto.getPrecioMayorista() : producto.getPrecioMinorista();

            BigDecimal subtotal = precioUnitario.multiply(new BigDecimal(detalleDTO.getCantidad()));
            totalVenta = totalVenta.add(subtotal);

            DetalleVenta detalleVenta = DetalleVenta.builder()
                    .producto(producto)
                    .cantidad(detalleDTO.getCantidad())
                    .precioUnitario(precioUnitario)
                    .subtotal(subtotal)
                    .build();

            venta.addDetalle(detalleVenta);
        }

        venta.setTotal(totalVenta);

        // Actualizar caja
        caja.setIngresosVentas(caja.getIngresosVentas().add(totalVenta));
        caja.setSaldoFinal(caja.getSaldoInicial().add(caja.getIngresosVentas()));
        cajaDiariaRepository.save(caja);

        return mapToDTO(ventaRepository.save(venta));
    }

    @Transactional(readOnly = true)
    public List<VentaResponseDTO> obtenerHistorial(LocalDateTime start, LocalDateTime end) {
        List<Venta> ventas;
        if (start == null || end == null) {
            ventas = ventaRepository.findAll();
        } else {
            ventas = ventaRepository.findByFechaHoraBetween(start, end);
        }
        return ventas.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    private VentaResponseDTO mapToDTO(Venta venta) {
        return VentaResponseDTO.builder()
                .id(venta.getId())
                .fechaHora(venta.getFechaHora())
                .tipoCliente(venta.getTipoCliente())
                .total(venta.getTotal())
                .detalles(venta.getDetalles().stream().map(d -> DetalleVentaResponseDTO.builder()
                        .id(d.getId())
                        .productoId(d.getProducto().getId())
                        .productoNombre(d.getProducto().getNombre())
                        .cantidad(d.getCantidad())
                        .precioUnitario(d.getPrecioUnitario())
                        .subtotal(d.getSubtotal())
                        .build()).collect(Collectors.toList()))
                .build();
    }
}
