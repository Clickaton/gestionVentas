package com.distribuidora.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductoTopDTO {
    private Long id;
    private String nombre;
    private Long cantidadVendida;
}
