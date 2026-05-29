package com.distribuidora.service;

import com.distribuidora.exception.BusinessException;
import com.distribuidora.model.dto.ActualizacionPrecioMasivaDTO;
import com.distribuidora.model.dto.ProductoDTO;
import com.distribuidora.model.entity.Producto;
import com.distribuidora.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductoService {

    private final ProductoRepository productoRepository;

    @Transactional(readOnly = true)
    public List<ProductoDTO> findAll() {
        return productoRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProductoDTO findById(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Producto no encontrado con id: " + id));
        return mapToDTO(producto);
    }

    @Transactional
    public ProductoDTO create(ProductoDTO dto) {
        if (productoRepository.existsByCodigo(dto.getCodigo())) {
            throw new BusinessException("Ya existe un producto con el código: " + dto.getCodigo());
        }
        Producto producto = mapToEntity(dto);
        producto = productoRepository.save(producto);
        return mapToDTO(producto);
    }

    @Transactional
    public ProductoDTO update(Long id, ProductoDTO dto) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Producto no encontrado con id: " + id));

        if (!producto.getCodigo().equals(dto.getCodigo()) && productoRepository.existsByCodigo(dto.getCodigo())) {
             throw new BusinessException("Ya existe un producto con el código: " + dto.getCodigo());
        }

        producto.setCodigo(dto.getCodigo());
        producto.setNombre(dto.getNombre());
        producto.setDescripcion(dto.getDescripcion());
        producto.setPrecioMinorista(dto.getPrecioMinorista());
        producto.setPrecioMayorista(dto.getPrecioMayorista());
        producto.setStockActual(dto.getStockActual());
        producto.setActivo(dto.getActivo());

        producto = productoRepository.save(producto);
        return mapToDTO(producto);
    }

    @Transactional
    public void delete(Long id) {
        if (!productoRepository.existsById(id)) {
            throw new BusinessException("Producto no encontrado con id: " + id);
        }
        productoRepository.deleteById(id);
    }

    @Transactional
    public void actualizarPreciosMasivamente(ActualizacionPrecioMasivaDTO dto) {
        if (dto.getPorcentaje().compareTo(BigDecimal.ZERO) < 0) {
            throw new BusinessException("El porcentaje de actualización no puede ser negativo");
        }

        List<Producto> productos = productoRepository.findAllById(dto.getProductoIds());
        if (productos.isEmpty()) {
            throw new BusinessException("No se encontraron productos para actualizar");
        }

        BigDecimal factor = BigDecimal.ONE.add(dto.getPorcentaje().divide(new BigDecimal("100"), 4, RoundingMode.HALF_UP));

        for (Producto producto : productos) {
            if (dto.getActualizarMinorista()) {
                producto.setPrecioMinorista(producto.getPrecioMinorista().multiply(factor).setScale(2, RoundingMode.HALF_UP));
            }
            if (dto.getActualizarMayorista()) {
                producto.setPrecioMayorista(producto.getPrecioMayorista().multiply(factor).setScale(2, RoundingMode.HALF_UP));
            }
        }
        productoRepository.saveAll(productos);
    }

    private ProductoDTO mapToDTO(Producto producto) {
        return ProductoDTO.builder()
                .id(producto.getId())
                .codigo(producto.getCodigo())
                .nombre(producto.getNombre())
                .descripcion(producto.getDescripcion())
                .precioMinorista(producto.getPrecioMinorista())
                .precioMayorista(producto.getPrecioMayorista())
                .stockActual(producto.getStockActual())
                .activo(producto.getActivo())
                .build();
    }

    private Producto mapToEntity(ProductoDTO dto) {
        return Producto.builder()
                .codigo(dto.getCodigo())
                .nombre(dto.getNombre())
                .descripcion(dto.getDescripcion())
                .precioMinorista(dto.getPrecioMinorista())
                .precioMayorista(dto.getPrecioMayorista())
                .stockActual(dto.getStockActual())
                .activo(dto.getActivo())
                .build();
    }
}
