package com.distribuidora.model.dto;

import com.distribuidora.model.enums.TipoMovimiento;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MovimientoStockDTO {
    private Long id;
    private Long productoId;
    private String productoNombre;
    private TipoMovimiento tipo;
    private Integer cantidad;
    private String motivo;
    private LocalDateTime fechaHora;
}
