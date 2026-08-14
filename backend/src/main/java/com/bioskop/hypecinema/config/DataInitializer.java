package com.bioskop.hypecinema.config;

import com.bioskop.hypecinema.model.*;
import com.bioskop.hypecinema.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final MovieRepository movieRepository;
    private final CinemaHallRepository cinemaHallRepository;
    private final ScreeningRepository screeningRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public DataInitializer(UserRepository userRepository,
                           MovieRepository movieRepository,
                           CinemaHallRepository cinemaHallRepository,
                           ScreeningRepository screeningRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.movieRepository = movieRepository;
        this.cinemaHallRepository = cinemaHallRepository;
        this.screeningRepository = screeningRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // 1. Seed Users
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

        // 2. Seed Cinema Halls
        CinemaHall hall1 = cinemaHallRepository.findByName("Sala 1 - IMAX")
                .orElseGet(() -> cinemaHallRepository.save(new CinemaHall("Sala 1 - IMAX", 192, 12, 16)));
        CinemaHall hall2 = cinemaHallRepository.findByName("Sala 2 - Standard")
                .orElseGet(() -> cinemaHallRepository.save(new CinemaHall("Sala 2 - Standard", 120, 10, 12)));
        CinemaHall hall3 = cinemaHallRepository.findByName("Sala 3 - VIP")
                .orElseGet(() -> cinemaHallRepository.save(new CinemaHall("Sala 3 - VIP", 48, 6, 8)));

        // 3. Seed All Movies matching Frontend catalog
        if (movieRepository.count() < 8) {
            List<Movie> moviesToSave = new ArrayList<>();

            if (movieRepository.findByTitle("Spider-Man: Brand New Day").isEmpty()) {
                moviesToSave.add(new Movie(
                        "Spider-Man: Brand New Day",
                        "Peter Parker se suočava sa novom pretnjom koja preti da uništi sve što poznaje. U ovom nastavku kultnog serijala, Spider-Man mora da pronađe snagu u sebi kada se suoči sa neprijateljem koji poznaje svaku njegovu slabost.",
                        "Akcija",
                        148,
                        8.7,
                        "https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=600&q=80",
                        "Jon Watts",
                        "Tom Holland, Zendaya, Jake Gyllenhaal, Marisa Tomei",
                        LocalDate.of(2026, 7, 31),
                        MovieStatus.NOW_SHOWING
                ));
            }

            if (movieRepository.findByTitle("Dune: Part Three").isEmpty()) {
                moviesToSave.add(new Movie(
                        "Dune: Part Three",
                        "Epska završnica sage o Paulu Atrejdesu i borbi za kontrolu nad Arakisom. Denis Villeneuve donosi veličanstveni zaključak trilogije sa vizuelno zapanjujućim sekvencama.",
                        "Sci-Fi",
                        165,
                        9.1,
                        "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80",
                        "Denis Villeneuve",
                        "Timothée Chalamet, Zendaya, Florence Pugh, Austin Butler",
                        LocalDate.of(2026, 8, 15),
                        MovieStatus.NOW_SHOWING
                ));
            }

            if (movieRepository.findByTitle("The Batman: Part II").isEmpty()) {
                moviesToSave.add(new Movie(
                        "The Batman: Part II",
                        "Vitez Tame se vraća da se suoči sa novom misterijom u Gotamu. Brusa Vejna progoni serija misterioznih zločina koji ga vode dublje u mračno podzemlje grada.",
                        "Triler",
                        155,
                        8.4,
                        "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
                        "Matt Reeves",
                        "Robert Pattinson, Zoë Kravitz, Colin Farrell, Jeffrey Wright",
                        LocalDate.of(2026, 9, 20),
                        MovieStatus.COMING_SOON
                ));
            }

            if (movieRepository.findByTitle("Oppenheimer").isEmpty()) {
                moviesToSave.add(new Movie(
                        "Oppenheimer",
                        "Priča o čoveku koji je promenio tok istorije kreiranjem atomske bombe. Christopher Nolan prikazuje unutrašnju borbu J. Robert Oppenheimer-a dok predvodi Manhattan projekat.",
                        "Drama",
                        180,
                        8.9,
                        "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=600&q=80",
                        "Christopher Nolan",
                        "Cillian Murphy, Emily Blunt, Robert Downey Jr., Matt Damon",
                        LocalDate.of(2023, 7, 21),
                        MovieStatus.NOW_SHOWING
                ));
            }

            if (movieRepository.findByTitle("Deadpool & Wolverine").isEmpty()) {
                moviesToSave.add(new Movie(
                        "Deadpool & Wolverine",
                        "Najneozbiljniji timski film Marvel univerzuma. Deadpool i Wolverine udružuju snage u ludom, akcijom nabijenom, i urnebesno smešnom filmu koji ruši sve granice.",
                        "Komedija",
                        128,
                        8.2,
                        "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80",
                        "Shawn Levy",
                        "Ryan Reynolds, Hugh Jackman, Emma Corrin, Morena Baccarin",
                        LocalDate.of(2024, 7, 26),
                        MovieStatus.NOW_SHOWING
                ));
            }

            if (movieRepository.findByTitle("Inside Out 3").isEmpty()) {
                moviesToSave.add(new Movie(
                        "Inside Out 3",
                        "Nova avantura emocija u umu tinejdžerke Rajli. Pixar nastavlja svoju omiljenu franšizu sa novim emocijama i izazovima dok Rajli ulazi u period odrastanja.",
                        "Animacija",
                        100,
                        8.5,
                        "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80",
                        "Kelsey Mann",
                        "Amy Poehler, Maya Hawke, Ayo Edebiri, Lewis Black",
                        LocalDate.of(2026, 6, 14),
                        MovieStatus.NOW_SHOWING
                ));
            }

            if (movieRepository.findByTitle("Gladiator III").isEmpty()) {
                moviesToSave.add(new Movie(
                        "Gladiator III",
                        "Nastavak epske priče iz arene drevnog Rima. Ridley Scott se vraća sa trećim poglavljem koje istražuje nove generacije gladijatora i političke intrige.",
                        "Akcija",
                        150,
                        7.9,
                        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
                        "Ridley Scott",
                        "Paul Mescal, Pedro Pascal, Denzel Washington, Connie Nielsen",
                        LocalDate.of(2026, 11, 22),
                        MovieStatus.COMING_SOON
                ));
            }

            if (movieRepository.findByTitle("Interstellar 2").isEmpty()) {
                moviesToSave.add(new Movie(
                        "Interstellar 2",
                        "Novo putovanje kroz prostor i vreme u potrazi za čovečanstvom. Christopher Nolan se vraća sa nastavkom svog kultnog naučno-fantastičnog remek dela.",
                        "Sci-Fi",
                        170,
                        9.3,
                        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
                        "Christopher Nolan",
                        "Matthew McConaughey, Anne Hathaway, Jessica Chastain, Timothée Chalamet",
                        LocalDate.of(2026, 12, 20),
                        MovieStatus.COMING_SOON
                ));
            }

            movieRepository.saveAll(moviesToSave);
            System.out.println(">>> Svi filmovi uspešno sinhronizovani i sačuvani u H2 bazu.");
        }

        // 4. Seed Screenings matching Frontend dates & halls
        if (screeningRepository.count() < 10) {
            LocalDateTime baseTime = LocalDateTime.now().withMinute(0).withSecond(0).withNano(0);
            List<Movie> allMovies = movieRepository.findAll();

            for (Movie movie : allMovies) {
                if (movie.getStatus() == MovieStatus.NOW_SHOWING) {
                    // Check if screenings for this movie already exist
                    if (screeningRepository.findByMovieId(movie.getId()).isEmpty()) {
                        screeningRepository.save(new Screening(movie, hall1, baseTime.plusHours(2), 900.0));
                        screeningRepository.save(new Screening(movie, hall2, baseTime.plusHours(5), 700.0));
                        screeningRepository.save(new Screening(movie, hall3, baseTime.plusHours(8), 1200.0));
                        screeningRepository.save(new Screening(movie, hall1, baseTime.plusDays(1).plusHours(4), 900.0));
                        screeningRepository.save(new Screening(movie, hall2, baseTime.plusDays(1).plusHours(7), 700.0));
                    }
                }
            }
            System.out.println(">>> Projekcije uspešno sinhronizovane sa salama i filmovima.");
        }
    }
}
