package com.bioskop.hypecinema.config;

import com.bioskop.hypecinema.model.*;
import com.bioskop.hypecinema.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Inicijalno punjenje baze podataka test podacima.
 * Kreira admin korisnika, filmove, sale i projekcije.
 */
@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(
            UserRepository userRepo,
            MovieRepository movieRepo,
            CinemaHallRepository hallRepo,
            ScreeningRepository screeningRepo
    ) {
        return args -> {
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

            // ── Korisnici ──
            if (userRepo.count() == 0) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setEmail("admin@hypecinema.rs");
                admin.setPassword(encoder.encode("admin123"));
                admin.setFirstName("Admin");
                admin.setLastName("HypeCinema");
                admin.setRole(Role.ROLE_ADMIN);
                admin.setLoyaltyPoints(500);
                admin.setTier("GOLD");
                userRepo.save(admin);

                User user = new User();
                user.setUsername("korisnik");
                user.setEmail("korisnik@test.rs");
                user.setPassword(encoder.encode("korisnik123"));
                user.setFirstName("Marko");
                user.setLastName("Petrović");
                user.setRole(Role.ROLE_USER);
                user.setLoyaltyPoints(120);
                user.setTier("SILVER");
                userRepo.save(user);

                System.out.println("✓ Kreirani korisnici (admin / korisnik)");
            }

            // ── Filmovi ──
            if (movieRepo.count() == 0) {
                movieRepo.save(createMovie("Spider-Man: Brand New Day", "Peter Parker se suočava sa novom pretnjom koja preti da uništi sve što poznaje.", "Akcija", 148, 8.7, "Jon Watts", LocalDate.of(2026, 7, 31), MovieStatus.NOW_SHOWING));
                movieRepo.save(createMovie("Dune: Part Three", "Epska završnica sage o Paulu Atrejdesu i borbi za kontrolu nad Arakisom.", "Sci-Fi", 165, 9.1, "Denis Villeneuve", LocalDate.of(2026, 8, 15), MovieStatus.NOW_SHOWING));
                movieRepo.save(createMovie("The Batman: Part II", "Vitez Tame se vraća da se suoči sa novom misterijom u Gotamu.", "Triler", 155, 8.4, "Matt Reeves", LocalDate.of(2026, 9, 20), MovieStatus.COMING_SOON));
                movieRepo.save(createMovie("Oppenheimer", "Priča o čoveku koji je promenio tok istorije kreiranjem atomske bombe.", "Drama", 180, 8.9, "Christopher Nolan", LocalDate.of(2023, 7, 21), MovieStatus.NOW_SHOWING));
                movieRepo.save(createMovie("Deadpool & Wolverine", "Najneozbiljniji timski film Marvel univerzuma.", "Komedija", 128, 8.2, "Shawn Levy", LocalDate.of(2024, 7, 26), MovieStatus.NOW_SHOWING));
                movieRepo.save(createMovie("Inside Out 3", "Nova avantura emocija u umu tinejdžerke Rajli.", "Animacija", 100, 8.5, "Kelsey Mann", LocalDate.of(2026, 6, 14), MovieStatus.NOW_SHOWING));
                movieRepo.save(createMovie("Gladiator III", "Nastavak epske priče iz arene drevnog Rima.", "Akcija", 150, 7.9, "Ridley Scott", LocalDate.of(2026, 11, 22), MovieStatus.COMING_SOON));
                movieRepo.save(createMovie("Interstellar 2", "Novo putovanje kroz prostor i vreme u potrazi za čovečanstvom.", "Sci-Fi", 170, 9.3, "Christopher Nolan", LocalDate.of(2026, 12, 20), MovieStatus.COMING_SOON));

                System.out.println("✓ Kreirano 8 filmova");
            }

            // ── Sale ──
            if (hallRepo.count() == 0) {
                CinemaHall hall1 = new CinemaHall();
                hall1.setName("Sala 1 - IMAX");
                hall1.setRowsCount(10);
                hall1.setSeatsPerRow(15);
                hall1.setTotalSeats(150);
                hallRepo.save(hall1);

                CinemaHall hall2 = new CinemaHall();
                hall2.setName("Sala 2 - Standard");
                hall2.setRowsCount(8);
                hall2.setSeatsPerRow(12);
                hall2.setTotalSeats(96);
                hallRepo.save(hall2);

                CinemaHall hall3 = new CinemaHall();
                hall3.setName("Sala 3 - VIP");
                hall3.setRowsCount(5);
                hall3.setSeatsPerRow(8);
                hall3.setTotalSeats(40);
                hallRepo.save(hall3);

                System.out.println("✓ Kreirane 3 sale (IMAX, Standard, VIP)");

                // ── Projekcije (za narednih 7 dana) ──
                LocalDateTime now = LocalDateTime.now();
                var movies = movieRepo.findByStatus(MovieStatus.NOW_SHOWING);
                var halls = hallRepo.findAll();

                for (int day = 0; day < 7; day++) {
                    for (int i = 0; i < movies.size() && i < halls.size(); i++) {
                        Screening s1 = new Screening();
                        s1.setMovie(movies.get(i % movies.size()));
                        s1.setHall(halls.get(i % halls.size()));
                        s1.setStartTime(now.plusDays(day).withHour(14 + (i * 3)).withMinute(0).withSecond(0));
                        s1.setTicketPrice(new BigDecimal(i == 2 ? "1200.00" : i == 0 ? "900.00" : "700.00"));
                        screeningRepo.save(s1);
                    }
                }
                System.out.println("✓ Kreirane projekcije za narednih 7 dana");
            }
        };
    }

    private Movie createMovie(String title, String desc, String genre, int duration,
                               double rating, String director, LocalDate release, MovieStatus status) {
        Movie m = new Movie();
        m.setTitle(title);
        m.setDescription(desc);
        m.setGenre(genre);
        m.setDurationMinutes(duration);
        m.setRating(rating);
        m.setDirector(director);
        m.setReleaseDate(release);
        m.setStatus(status);
        m.setPosterUrl("/posters/" + title.toLowerCase().replaceAll("[^a-z0-9]", "") + ".jpg");
        return m;
    }
}
