package com.distribuidora.config;

import com.distribuidora.model.enums.Rol;
import com.distribuidora.model.entity.Usuario;
import com.distribuidora.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (usuarioRepository.count() == 0) {
            Usuario admin = Usuario.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .rol(Rol.ADMIN)
                    .build();

            Usuario operador = Usuario.builder()
                    .username("operador")
                    .password(passwordEncoder.encode("operador123"))
                    .rol(Rol.OPERADOR)
                    .build();

            usuarioRepository.save(admin);
            usuarioRepository.save(operador);
            System.out.println("Usuarios de prueba creados: admin/admin123 (ADMIN), operador/operador123 (OPERADOR)");
        }
    }
}
