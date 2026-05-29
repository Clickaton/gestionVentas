package com.distribuidora.model.entity;

import com.distribuidora.model.enums.EstadoCaja;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "cajas_diarias")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CajaDiaria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private LocalDate fecha;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal saldoInicial;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal ingresosVentas;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal saldoFinal;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoCaja estado;
}
