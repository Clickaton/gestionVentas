package com.distribuidora.controller;

import com.distribuidora.model.dto.CajaDiariaDTO;
import com.distribuidora.model.dto.GastoDTO;
import com.distribuidora.service.CajaDiariaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/v1/caja")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class CajaDiariaController {

    private final CajaDiariaService cajaDiariaService;

    @PostMapping("/abrir")
    public ResponseEntity<CajaDiariaDTO> abrirCaja(@RequestParam(required = false, defaultValue = "0.0") BigDecimal saldoInicial) {
        return new ResponseEntity<>(cajaDiariaService.abrirCaja(saldoInicial), HttpStatus.CREATED);
    }

    @PostMapping("/cerrar")
    public ResponseEntity<CajaDiariaDTO> cerrarCaja() {
        return ResponseEntity.ok(cajaDiariaService.cerrarCaja());
    }

    @GetMapping
    public ResponseEntity<CajaDiariaDTO> obtenerBalanceDelDia() {
        return ResponseEntity.ok(cajaDiariaService.obtenerBalanceDelDia());
    }

    @PostMapping("/gastos")
    public ResponseEntity<CajaDiariaDTO> registrarGasto(@Valid @RequestBody GastoDTO gastoDTO) {
        return new ResponseEntity<>(cajaDiariaService.registrarGasto(gastoDTO), HttpStatus.CREATED);
    }
}
