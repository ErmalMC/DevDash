package com.devdash.backend.config;

import com.devdash.backend.entity.User;
import com.devdash.backend.entity.UserRole;
import com.devdash.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        seedUsers();
    }

    private void seedUsers() {
        // Create WORKER user
        if (userRepository.findByEmail("worker@test.com").isEmpty()) {
            User worker = User.builder()
                    .email("worker@test.com")
                    .passwordHash(passwordEncoder.encode("password123"))
                    .fullName("John Worker")
                    .phoneNumber("+38970123456")
                    .role(UserRole.WORKER)
                    .isVerified(true)
                    .createdAt(LocalDateTime.now())
                    .build();

            userRepository.save(worker);
            log.info("✅ Created WORKER user: worker@test.com / password123");
        }

        // Create CITIZEN user
        if (userRepository.findByEmail("citizen@test.com").isEmpty()) {
            User citizen = User.builder()
                    .email("citizen@test.com")
                    .passwordHash(passwordEncoder.encode("password123"))
                    .fullName("Jane Citizen")
                    .phoneNumber("+38970123457")
                    .role(UserRole.CITIZEN)
                    .isVerified(true)
                    .createdAt(LocalDateTime.now())
                    .build();

            userRepository.save(citizen);
            log.info("✅ Created CITIZEN user: citizen@test.com / password123");
        }

        // Create ADMIN user
        if (userRepository.findByEmail("admin@test.com").isEmpty()) {
            User admin = User.builder()
                    .email("admin@test.com")
                    .passwordHash(passwordEncoder.encode("admin123"))
                    .fullName("Admin User")
                    .phoneNumber("+38970123458")
                    .role(UserRole.ADMIN)
                    .isVerified(true)
                    .createdAt(LocalDateTime.now())
                    .build();

            userRepository.save(admin);
            log.info("✅ Created ADMIN user: admin@test.com / admin123");
        }
    }
}