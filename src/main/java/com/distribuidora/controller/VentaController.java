package com.distribuidora.controller;

import com.distribuidora.model.dto.VentaRequestDTO;
import com.distribuidora.model.dto.VentaResponseDTO;
import com.distribuidora.service.VentaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/ventas")
@RequiredArgsConstructor
public class VentaController {

    private final VentaService ventaService;

    @PostMapping
    public ResponseEntity<VentaResponseDTO> registrarVenta(@Valid @RequestBody VentaRequestDTO requestDTO) {
        return new ResponseEntity<>(ventaService.registrarVenta(requestDTO), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<VentaResponseDTO>> obtenerHistorial(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return ResponseEntity.ok(ventaService.obtenerHistorial(start, end));
    }
}
