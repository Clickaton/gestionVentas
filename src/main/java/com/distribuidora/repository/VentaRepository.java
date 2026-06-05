package com.distribuidora.repository;

import com.distribuidora.model.entity.Venta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface VentaRepository extends JpaRepository<Venta, Long> {
    List<Venta> findByFechaHoraBetween(LocalDateTime start, LocalDateTime end);

    @Query("SELECT SUM(v.total) FROM Venta v WHERE v.fechaHora >= :start AND v.fechaHora <= :end")
    BigDecimal sumTotalVentasBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}
