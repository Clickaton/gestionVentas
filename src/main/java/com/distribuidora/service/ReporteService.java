package com.distribuidora.service;

import com.distribuidora.model.dto.ProductoTopDTO;
import com.distribuidora.model.dto.VentasDiaDTO;
import com.distribuidora.repository.VentaRepository;
import com.distribuidora.repository.DetalleVentaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReporteService {

    private final VentaRepository ventaRepository;
    private final DetalleVentaRepository detalleVentaRepository;

    @Transactional(readOnly = true)
    public List<VentasDiaDTO> obtenerVentasUltimos7Dias() {
        List<VentasDiaDTO> reporte = new ArrayList<>();
        LocalDate hoy = LocalDate.now();

        for (int i = 6; i >= 0; i--) {
            LocalDate fecha = hoy.minusDays(i);
            LocalDateTime inicioDia = fecha.atStartOfDay();
            LocalDateTime finDia = fecha.atTime(LocalTime.MAX);

            BigDecimal totalDelDia = ventaRepository.sumTotalVentasBetween(inicioDia, finDia);
            if (totalDelDia == null) {
                totalDelDia = BigDecimal.ZERO;
            }

            reporte.add(VentasDiaDTO.builder()
                    .fecha(fecha)
                    .total(totalDelDia)
                    .build());
        }

        return reporte;
    }

    @Transactional(readOnly = true)
    public List<ProductoTopDTO> obtenerTop3Productos() {
        return detalleVentaRepository.findTop3ProductosVendidos();
    }
}
