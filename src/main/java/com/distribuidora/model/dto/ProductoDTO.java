package com.distribuidora.model.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductoDTO {

    private Long id;

    @NotBlank(message = "El código no puede estar vacío")
    private String codigo;

    @NotBlank(message = "El nombre no puede estar vacío")
    private String nombre;

    private String descripcion;

    @NotNull(message = "El precio minorista no puede ser nulo")
    @DecimalMin(value = "0.0", inclusive = false, message = "El precio minorista debe ser mayor a 0")
    private BigDecimal precioMinorista;

    @NotNull(message = "El precio mayorista no puede ser nulo")
    @DecimalMin(value = "0.0", inclusive = false, message = "El precio mayorista debe ser mayor a 0")
    private BigDecimal precioMayorista;

    @NotNull(message = "El stock no puede ser nulo")
    @Min(value = 0, message = "El stock no puede ser negativo")
    private Integer stockActual;

    @NotNull(message = "El estado activo no puede ser nulo")
    private Boolean activo;
}
