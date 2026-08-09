package com.bioskop.hypecinema.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Entitet filma u bioskopu.
 * Sadrži sve informacije o filmu: naslov, opis, žanr, trajanje, poster, ocena, status.
 */
@Entity
@Table(name = "movies")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 50)
    private String genre;

    @Column(nullable = false)
    private Integer durationMinutes;

    /** URL ili putanja do poster slike filma */
    @Column(length = 500)
    private String posterUrl;

    /** Prosečna ocena filma (1.0 - 10.0) */
    @Column
    private Double rating;

    /** Ime režisera */
    @Column(length = 100)
    private String director;

    /** Datum premijere */
    @Column
    private LocalDate releaseDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private MovieStatus status = MovieStatus.NOW_SHOWING;

    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Screening> screenings = new ArrayList<>();
}
