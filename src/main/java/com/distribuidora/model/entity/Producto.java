package com.distribuidora.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "productos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String codigo;

    @Column(nullable = false)
    private String nombre;

    private String descripcion;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precioMinorista;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precioMayorista;

    @Column(nullable = false)
    private Integer stockActual;

    @Column(nullable = false)
    private Boolean activo;

    @Version
    private Long version;
}
