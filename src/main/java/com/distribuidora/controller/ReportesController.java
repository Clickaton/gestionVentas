package com.distribuidora.controller;

import com.distribuidora.model.dto.ProductoTopDTO;
import com.distribuidora.model.dto.VentasDiaDTO;
import com.distribuidora.service.ReporteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reportes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class ReportesController {

    private final ReporteService reporteService;

    @GetMapping("/ventas-semana")
    public ResponseEntity<List<VentasDiaDTO>> obtenerVentasSemana() {
        return ResponseEntity.ok(reporteService.obtenerVentasUltimos7Dias());
    }

    @GetMapping("/top-productos")
    public ResponseEntity<List<ProductoTopDTO>> obtenerTopProductos() {
        return ResponseEntity.ok(reporteService.obtenerTop3Productos());
    }
}
