package com.distribuidora.repository;

import com.distribuidora.model.entity.CajaDiaria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface CajaDiariaRepository extends JpaRepository<CajaDiaria, Long> {
    Optional<CajaDiaria> findByFecha(LocalDate fecha);
}
