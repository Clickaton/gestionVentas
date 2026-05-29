package com.distribuidora.model.dto;

import com.distribuidora.model.enums.TipoCliente;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VentaResponseDTO {
    private Long id;
    private LocalDateTime fechaHora;
    private TipoCliente tipoCliente;
    private BigDecimal total;
    private List<DetalleVentaResponseDTO> detalles;
}
