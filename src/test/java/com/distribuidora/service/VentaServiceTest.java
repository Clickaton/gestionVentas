package com.distribuidora.service;

import com.distribuidora.exception.InsufficientStockException;
import com.distribuidora.model.dto.DetalleVentaDTO;
import com.distribuidora.model.dto.VentaRequestDTO;
import com.distribuidora.model.dto.VentaResponseDTO;
import com.distribuidora.model.entity.CajaDiaria;
import com.distribuidora.model.entity.Producto;
import com.distribuidora.model.entity.Venta;
import com.distribuidora.model.enums.EstadoCaja;
import com.distribuidora.model.enums.TipoCliente;
import com.distribuidora.repository.CajaDiariaRepository;
import com.distribuidora.repository.ProductoRepository;
import com.distribuidora.repository.VentaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VentaServiceTest {

    @Mock
    private VentaRepository ventaRepository;

    @Mock
    private ProductoRepository productoRepository;

    @Mock
    private CajaDiariaRepository cajaDiariaRepository;

    @InjectMocks
    private VentaService ventaService;

    private CajaDiaria cajaAbierta;

    @BeforeEach
    void setUp() {
        cajaAbierta = CajaDiaria.builder()
                .estado(EstadoCaja.ABIERTA)
                .ingresosVentas(BigDecimal.ZERO)
                .saldoInicial(new BigDecimal("100.00"))
                .saldoFinal(new BigDecimal("100.00"))
                .build();
    }

    @Test
    void registrarVenta_Exitosa_DescuentaStock() {
        VentaRequestDTO request = VentaRequestDTO.builder()
                .tipoCliente(TipoCliente.MINORISTA)
                .detalles(List.of(
                        DetalleVentaDTO.builder().productoId(1L).cantidad(2).build()
                ))
                .build();

        Producto producto = Producto.builder()
                .id(1L)
                .nombre("Leña 10kg")
                .precioMinorista(new BigDecimal("500.00"))
                .stockActual(10)
                .activo(true)
                .build();

        when(cajaDiariaRepository.findByFecha(any(LocalDate.class))).thenReturn(Optional.of(cajaAbierta));
        when(productoRepository.findById(1L)).thenReturn(Optional.of(producto));
        when(ventaRepository.save(any(Venta.class))).thenAnswer(i -> i.getArguments()[0]);

        VentaResponseDTO venta = ventaService.registrarVenta(request);

        assertNotNull(venta);
        assertEquals(new BigDecimal("1000.00"), venta.getTotal());
        assertEquals(8, producto.getStockActual());
        assertEquals(new BigDecimal("1000.00"), cajaAbierta.getIngresosVentas());

        verify(productoRepository, times(1)).save(producto);
        verify(cajaDiariaRepository, times(1)).save(cajaAbierta);
        verify(ventaRepository, times(1)).save(any(Venta.class));
    }

    @Test
    void registrarVenta_CantidadMayorAlStock_LanzaExcepcion() {
        VentaRequestDTO request = VentaRequestDTO.builder()
                .tipoCliente(TipoCliente.MINORISTA)
                .detalles(List.of(
                        DetalleVentaDTO.builder().productoId(1L).cantidad(15).build()
                ))
                .build();

        Producto producto = Producto.builder()
                .id(1L)
                .nombre("Carbón 3kg")
                .stockActual(10)
                .activo(true)
                .build();

        when(cajaDiariaRepository.findByFecha(any(LocalDate.class))).thenReturn(Optional.of(cajaAbierta));
        when(productoRepository.findById(1L)).thenReturn(Optional.of(producto));

        InsufficientStockException exception = assertThrows(InsufficientStockException.class, () ->
                ventaService.registrarVenta(request)
        );

        assertTrue(exception.getMessage().contains("Stock insuficiente"));
        verify(productoRepository, never()).save(any(Producto.class));
        verify(ventaRepository, never()).save(any(Venta.class));
    }
}
