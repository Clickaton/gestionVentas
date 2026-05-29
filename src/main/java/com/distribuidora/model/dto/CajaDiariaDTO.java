package com.distribuidora.model.dto;

import com.distribuidora.model.enums.EstadoCaja;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CajaDiariaDTO {
    private Long id;
    private LocalDate fecha;
    private BigDecimal saldoInicial;
    private BigDecimal ingresosVentas;
    private BigDecimal saldoFinal;
    private EstadoCaja estado;
}
