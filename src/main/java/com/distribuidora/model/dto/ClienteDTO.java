package com.distribuidora.model.dto;

import com.distribuidora.model.enums.TipoCliente;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClienteDTO {

    private Long id;

    @NotBlank(message = "El nombre del cliente no puede estar vacío")
    private String nombre;

    @NotNull(message = "El tipo de cliente no puede ser nulo")
    private TipoCliente tipo;

    private String telefono;
}
