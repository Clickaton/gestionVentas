package com.distribuidora.controller;

import com.distribuidora.model.dto.AjusteStockDTO;
import com.distribuidora.model.dto.MovimientoStockDTO;
import com.distribuidora.service.InventarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/inventario")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class InventarioController {

    private final InventarioService inventarioService;

    @GetMapping("/movimientos")
    public ResponseEntity<List<MovimientoStockDTO>> obtenerHistorialMovimientos() {
        return ResponseEntity.ok(inventarioService.obtenerHistorialMovimientos());
    }

    @PostMapping("/ajuste")
    public ResponseEntity<MovimientoStockDTO> registrarAjuste(@Valid @RequestBody AjusteStockDTO ajusteDTO) {
        return new ResponseEntity<>(inventarioService.registrarAjusteManual(ajusteDTO), HttpStatus.CREATED);
    }
}
