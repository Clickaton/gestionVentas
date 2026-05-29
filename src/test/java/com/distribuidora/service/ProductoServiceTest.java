package com.distribuidora.service;

import com.distribuidora.exception.BusinessException;
import com.distribuidora.model.dto.ActualizacionPrecioMasivaDTO;
import com.distribuidora.model.entity.Producto;
import com.distribuidora.repository.ProductoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductoServiceTest {

    @Mock
    private ProductoRepository productoRepository;

    @InjectMocks
    private ProductoService productoService;

    @Test
    void actualizarPreciosMasivamente_PorcentajeNegativo_LanzaExcepcion() {
        ActualizacionPrecioMasivaDTO dto = ActualizacionPrecioMasivaDTO.builder()
                .productoIds(List.of(1L))
                .porcentaje(new BigDecimal("-10.0"))
                .actualizarMinorista(true)
                .actualizarMayorista(true)
                .build();

        BusinessException exception = assertThrows(BusinessException.class, () ->
                productoService.actualizarPreciosMasivamente(dto)
        );

        assertEquals("El porcentaje de actualización no puede ser negativo", exception.getMessage());
        verify(productoRepository, never()).saveAll(anyList());
    }

    @Test
    void actualizarPreciosMasivamente_ActualizacionExitosa() {
        ActualizacionPrecioMasivaDTO dto = ActualizacionPrecioMasivaDTO.builder()
                .productoIds(List.of(1L))
                .porcentaje(new BigDecimal("10.0"))
                .actualizarMinorista(true)
                .actualizarMayorista(false)
                .build();

        Producto producto = Producto.builder()
                .id(1L)
                .precioMinorista(new BigDecimal("100.00"))
                .precioMayorista(new BigDecimal("80.00"))
                .build();

        when(productoRepository.findAllById(dto.getProductoIds())).thenReturn(List.of(producto));

        productoService.actualizarPreciosMasivamente(dto);

        // 100 * 1.10 = 110.00
        assertEquals(new BigDecimal("110.00"), producto.getPrecioMinorista());
        assertEquals(new BigDecimal("80.00"), producto.getPrecioMayorista()); // No cambió
        verify(productoRepository, times(1)).saveAll(anyList());
    }
}
