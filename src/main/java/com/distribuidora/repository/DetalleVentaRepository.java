package com.distribuidora.repository;

import com.distribuidora.model.dto.ProductoTopDTO;
import com.distribuidora.model.entity.DetalleVenta;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DetalleVentaRepository extends JpaRepository<DetalleVenta, Long> {

    @Query("SELECT new com.distribuidora.model.dto.ProductoTopDTO(p.id, p.nombre, SUM(dv.cantidad)) " +
           "FROM DetalleVenta dv JOIN dv.producto p " +
           "GROUP BY p.id, p.nombre " +
           "ORDER BY SUM(dv.cantidad) DESC")
    List<ProductoTopDTO> findTopProductosVendidos(org.springframework.data.domain.Pageable pageable);

    default List<ProductoTopDTO> findTop3ProductosVendidos() {
        return findTopProductosVendidos(PageRequest.of(0, 3));
    }
}
