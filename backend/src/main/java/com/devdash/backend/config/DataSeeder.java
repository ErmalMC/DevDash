package com.devdash.backend.config;

import com.devdash.backend.entity.*;
import com.devdash.backend.repository.RepairRequestRepository;
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
    private final RepairRequestRepository repairRequestRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        seedUsers();
        seedRepairRequests();
    }

    private void seedUsers() {
        log.info("========================================");
        log.info("SEEDING USERS");
        log.info("========================================");

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

        // Create additional CITIZEN users for repair requests
        createCitizenIfNotExists("john@example.com", "John Doe", "+38970111111");
        createCitizenIfNotExists("jane@example.com", "Jane Smith", "+38970222222");
        createCitizenIfNotExists("bob@example.com", "Bob Johnson", "+38970333333");
        createCitizenIfNotExists("alice@example.com", "Alice Williams", "+38970444444");
    }

    private void createCitizenIfNotExists(String email, String fullName, String phone) {
        if (userRepository.findByEmail(email).isEmpty()) {
            User citizen = User.builder()
                    .email(email)
                    .passwordHash(passwordEncoder.encode("password123"))
                    .fullName(fullName)
                    .phoneNumber(phone)
                    .role(UserRole.CITIZEN)
                    .isVerified(true)
                    .createdAt(LocalDateTime.now())
                    .build();

            userRepository.save(citizen);
            log.info("✅ Created CITIZEN user: {} / password123", email);
        }
    }

    private void seedRepairRequests() {
        // Check if repair requests already exist
        if (repairRequestRepository.count() > 0) {
            log.info("Repair requests already exist. Skipping seeding.");
            return;
        }

        log.info("========================================");
        log.info("SEEDING REPAIR REQUESTS");
        log.info("========================================");

        // Get citizen users to create requests
        User john = userRepository.findByEmail("john@example.com")
                .orElseThrow(() -> new RuntimeException("John user not found"));
        User jane = userRepository.findByEmail("jane@example.com")
                .orElseThrow(() -> new RuntimeException("Jane user not found"));
        User bob = userRepository.findByEmail("bob@example.com")
                .orElseThrow(() -> new RuntimeException("Bob user not found"));
        User alice = userRepository.findByEmail("alice@example.com")
                .orElseThrow(() -> new RuntimeException("Alice user not found"));

        // Create PLUMBER repair requests
        createRepairRequest(
                john,
                SkillCategory.PLUMBER,
                "Kitchen faucet is leaking constantly. Water is dripping from the base and needs immediate repair. The leak is getting worse and causing water damage.",
                Urgency.HIGH,
                "Ul. Makedonija 23, Skopje",
                41.9973, 21.4280
        );

        createRepairRequest(
                bob,
                SkillCategory.PLUMBER,
                "Bathroom sink drain is completely clogged. Water not draining at all. Need urgent plumbing help. Tried drain cleaner but didn't work.",
                Urgency.HIGH,
                "Ul. 11 Oktomvri 67, Skopje",
                41.9922, 21.4254
        );

        createRepairRequest(
                alice,
                SkillCategory.PLUMBER,
                "Toilet keeps running after flushing. Water bill is getting high. Need plumber to fix the flush mechanism.",
                Urgency.MEDIUM,
                "Ul. Dame Gruev 12, Skopje",
                41.9981, 21.4254
        );

        // Create ELECTRICIAN repair requests
        createRepairRequest(
                jane,
                SkillCategory.ELECTRICIAN,
                "Bedroom electrical outlet stopped working. Might be a circuit breaker issue. Need electrician to diagnose and fix the problem.",
                Urgency.HIGH,
                "Bul. Krste Misirkov 45, Skopje",
                42.0042, 21.4361
        );

        createRepairRequest(
                john,
                SkillCategory.ELECTRICIAN,
                "Ceiling light keeps flickering in the bedroom. Might be loose wiring or bad connection. Getting concerned about electrical safety.",
                Urgency.MEDIUM,
                "Ul. Makedonija 23, Skopje",
                41.9973, 21.4280
        );

        createRepairRequest(
                bob,
                SkillCategory.ELECTRICIAN,
                "Power keeps tripping in the living room. Circuit breaker trips every few hours. Need electrician to check the wiring.",
                Urgency.HIGH,
                "Ul. 11 Oktomvri 67, Skopje",
                41.9922, 21.4254
        );

        // Create AC repair requests
        createRepairRequest(
                jane,
                SkillCategory.AC,
                "Air conditioning unit is running but not cooling properly. Room temperature stays high despite AC being on full blast for hours.",
                Urgency.HIGH,
                "Bul. Krste Misirkov 45, Skopje",
                42.0042, 21.4361
        );

        createRepairRequest(
                alice,
                SkillCategory.AC,
                "AC making strange noises when running. Sounds like grinding or rattling. Still cooling but concerned about damage.",
                Urgency.MEDIUM,
                "Ul. Dame Gruev 12, Skopje",
                41.9981, 21.4254
        );

        createRepairRequest(
                john,
                SkillCategory.AC,
                "AC not turning on at all. Remote works but unit doesn't respond. Check power supply and internal components.",
                Urgency.LOW,
                "Ul. Makedonija 23, Skopje",
                41.9973, 21.4280
        );

        // Create APPLIANCE repair requests
        createRepairRequest(
                alice,
                SkillCategory.APPLIANCE,
                "Washing machine won't start. Display shows error code E3. Might need motor or control board repair. Machine is only 2 years old.",
                Urgency.MEDIUM,
                "Ul. Dame Gruev 12, Skopje",
                41.9981, 21.4254
        );

        createRepairRequest(
                bob,
                SkillCategory.APPLIANCE,
                "Refrigerator not cooling properly. Food is spoiling. Freezer section still works but fridge compartment is warm.",
                Urgency.HIGH,
                "Ul. 11 Oktomvri 67, Skopje",
                41.9922, 21.4254
        );

        createRepairRequest(
                jane,
                SkillCategory.APPLIANCE,
                "Dishwasher not draining water. Water pools at the bottom after cycle. Dishes come out wet. Need repair urgently.",
                Urgency.MEDIUM,
                "Bul. Krste Misirkov 45, Skopje",
                42.0042, 21.4361
        );

        createRepairRequest(
                john,
                SkillCategory.APPLIANCE,
                "Microwave turntable not spinning. Also making strange buzzing sound. Still heats but unevenly.",
                Urgency.LOW,
                "Ul. Makedonija 23, Skopje",
                41.9973, 21.4280
        );

        long totalRequests = repairRequestRepository.count();
        log.info("========================================");
        log.info("✅ Seeded {} repair requests", totalRequests);
        log.info("========================================");
    }

    private void createRepairRequest(
            User citizen,
            SkillCategory category,
            String description,
            Urgency urgency,
            String address,
            double latitude,
            double longitude
    ) {
        RepairRequest request = RepairRequest.builder()
                .citizen(citizen)
                .category(category)
                .description(description)
                .urgency(urgency)
                .status(RequestStatus.OPEN)
                .address(address)
                .latitude(latitude)
                .longitude(longitude)
                .createdAt(LocalDateTime.now())
                .build();

        repairRequestRepository.save(request);
        log.info("  → Created: {} - {} ({})", category, description.substring(0, Math.min(50, description.length())), urgency);
    }
}