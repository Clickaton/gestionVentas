package com.distribuidora.model.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActualizacionPrecioMasivaDTO {

    @NotEmpty(message = "Debe proporcionar al menos un ID de producto")
    private List<Long> productoIds;

    @NotNull(message = "El porcentaje es obligatorio")
    @DecimalMin(value = "0.0", message = "El porcentaje no puede ser negativo")
    private BigDecimal porcentaje;

    @NotNull(message = "Debe especificar si actualiza precio minorista")
    private Boolean actualizarMinorista;

    @NotNull(message = "Debe especificar si actualiza precio mayorista")
    private Boolean actualizarMayorista;
}
