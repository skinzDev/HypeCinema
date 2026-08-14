package com.bioskop.hypecinema.config;

import com.bioskop.hypecinema.model.LoyaltyTier;
import com.bioskop.hypecinema.model.Role;
import com.bioskop.hypecinema.model.User;
import com.bioskop.hypecinema.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User(
                    "admin",
                    "admin@hypecinema.com",
                    passwordEncoder.encode("admin123"),
                    "HypeCinema Admin",
                    "+381641112233",
                    Role.ROLE_ADMIN
            );
            admin.setLifetimePoints(1850);
            admin.setLoyaltyPoints(1850);
            admin.setLoyaltyTier(LoyaltyTier.GOLD);
            userRepository.save(admin);
            System.out.println(">>> Demo Admin nalog uspešno kreiran: admin / admin123");
        }

        if (!userRepository.existsByUsername("john_doe")) {
            User user = new User(
                    "john_doe",
                    "john@example.com",
                    passwordEncoder.encode("user123"),
                    "John Doe",
                    "+381639998877",
                    Role.ROLE_USER
            );
            user.setLifetimePoints(650);
            user.setLoyaltyPoints(650);
            user.setLoyaltyTier(LoyaltyTier.SILVER);
            userRepository.save(user);
            System.out.println(">>> Demo User nalog uspešno kreiran: john_doe / user123");
        }
    }
}
