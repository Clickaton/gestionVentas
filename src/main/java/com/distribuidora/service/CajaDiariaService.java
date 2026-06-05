package com.distribuidora.service;

import com.distribuidora.exception.BusinessException;
import com.distribuidora.model.dto.CajaDiariaDTO;
import com.distribuidora.model.dto.GastoDTO;
import com.distribuidora.model.entity.CajaDiaria;
import com.distribuidora.model.entity.Gasto;
import com.distribuidora.model.enums.EstadoCaja;
import com.distribuidora.repository.CajaDiariaRepository;
import com.distribuidora.repository.GastoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class CajaDiariaService {

    private final CajaDiariaRepository cajaDiariaRepository;
    private final GastoRepository gastoRepository;

    @Transactional
    public CajaDiariaDTO abrirCaja(BigDecimal saldoInicial) {
        LocalDate hoy = LocalDate.now();
        if (cajaDiariaRepository.findByFecha(hoy).isPresent()) {
            throw new BusinessException("Ya existe una caja para el día de hoy");
        }

        CajaDiaria caja = CajaDiaria.builder()
                .fecha(hoy)
                .saldoInicial(saldoInicial != null ? saldoInicial : BigDecimal.ZERO)
                .ingresosVentas(BigDecimal.ZERO)
                .gastos(BigDecimal.ZERO)
                .saldoFinal(saldoInicial != null ? saldoInicial : BigDecimal.ZERO)
                .estado(EstadoCaja.ABIERTA)
                .build();

        caja = cajaDiariaRepository.save(caja);
        return mapToDTO(caja);
    }

    @Transactional
    public CajaDiariaDTO cerrarCaja() {
        CajaDiaria caja = cajaDiariaRepository.findByFecha(LocalDate.now())
                .orElseThrow(() -> new BusinessException("No hay una caja abierta para el día de hoy"));

        if (caja.getEstado() == EstadoCaja.CERRADA) {
            throw new BusinessException("La caja ya se encuentra cerrada");
        }

        caja.setEstado(EstadoCaja.CERRADA);
        caja = cajaDiariaRepository.save(caja);
        return mapToDTO(caja);
    }

    @Transactional(readOnly = true)
    public CajaDiariaDTO obtenerBalanceDelDia() {
        CajaDiaria caja = cajaDiariaRepository.findByFecha(LocalDate.now())
                .orElseThrow(() -> new BusinessException("No hay una caja para el día de hoy"));
        return mapToDTO(caja);
    }

    @Transactional
    public CajaDiariaDTO registrarGasto(GastoDTO dto) {
        CajaDiaria caja = cajaDiariaRepository.findByFecha(LocalDate.now())
                .orElseThrow(() -> new BusinessException("No hay una caja abierta para el día de hoy"));

        if (caja.getEstado() == EstadoCaja.CERRADA) {
            throw new BusinessException("La caja de hoy ya se encuentra cerrada");
        }

        if (caja.getSaldoFinal().compareTo(dto.getMonto()) < 0) {
            throw new BusinessException("No hay saldo suficiente en la caja para registrar este gasto");
        }

        Gasto gasto = Gasto.builder()
                .concepto(dto.getConcepto())
                .monto(dto.getMonto())
                .fechaHora(LocalDateTime.now())
                .cajaDiaria(caja)
                .build();

        gastoRepository.save(gasto);

        caja.setGastos(caja.getGastos().add(dto.getMonto()));
        caja.setSaldoFinal(caja.getSaldoInicial().add(caja.getIngresosVentas()).subtract(caja.getGastos()));
        return mapToDTO(cajaDiariaRepository.save(caja));
    }

    private CajaDiariaDTO mapToDTO(CajaDiaria caja) {
        return CajaDiariaDTO.builder()
                .id(caja.getId())
                .fecha(caja.getFecha())
                .saldoInicial(caja.getSaldoInicial())
                .ingresosVentas(caja.getIngresosVentas())
                .gastos(caja.getGastos())
                .saldoFinal(caja.getSaldoFinal())
                .estado(caja.getEstado())
                .build();
    }
}
