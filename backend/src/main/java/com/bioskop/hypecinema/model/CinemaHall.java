package com.bioskop.hypecinema.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * Entitet bioskopske sale.
 * Definiše kapacitet sale (broj redova i sedišta po redu).
 */
@Entity
@Table(name = "cinema_halls")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CinemaHall {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String name;

    /** Ukupan broj sedišta u sali */
    @Column(nullable = false)
    private Integer totalSeats;

    /** Broj redova u sali */
    @Column(nullable = false)
    private Integer rowsCount;

    /** Broj sedišta po redu */
    @Column(nullable = false)
    private Integer seatsPerRow;

    @OneToMany(mappedBy = "hall", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Screening> screenings = new ArrayList<>();
}
