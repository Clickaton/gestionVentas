package com.distribuidora.service;

import com.distribuidora.exception.BusinessException;
import com.distribuidora.model.dto.ClienteDTO;
import com.distribuidora.model.entity.Cliente;
import com.distribuidora.repository.ClienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClienteService {

    private final ClienteRepository clienteRepository;

    @Transactional(readOnly = true)
    public List<ClienteDTO> findAll() {
        return clienteRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ClienteDTO create(ClienteDTO dto) {
        Cliente cliente = Cliente.builder()
                .nombre(dto.getNombre())
                .tipo(dto.getTipo())
                .telefono(dto.getTelefono())
                .build();

        cliente = clienteRepository.save(cliente);
        return mapToDTO(cliente);
    }

    @Transactional
    public void delete(Long id) {
        if (!clienteRepository.existsById(id)) {
            throw new BusinessException("Cliente no encontrado con id: " + id);
        }
        clienteRepository.deleteById(id);
    }

    private ClienteDTO mapToDTO(Cliente cliente) {
        return ClienteDTO.builder()
                .id(cliente.getId())
                .nombre(cliente.getNombre())
                .tipo(cliente.getTipo())
                .telefono(cliente.getTelefono())
                .build();
    }
}