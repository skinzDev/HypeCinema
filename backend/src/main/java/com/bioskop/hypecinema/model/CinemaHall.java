package com.bioskop.hypecinema.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "cinema_halls")
public class CinemaHall {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, unique = true)
    private String name;

    @NotNull
    @Column(name = "total_seats", nullable = false)
    private Integer totalSeats;

    @NotNull
    @Column(name = "rows_count", nullable = false)
    private Integer rowsCount;

    @NotNull
    @Column(name = "seats_per_row", nullable = false)
    private Integer seatsPerRow;

    public CinemaHall() {
    }

    public CinemaHall(String name, Integer totalSeats, Integer rowsCount, Integer seatsPerRow) {
        this.name = name;
        this.totalSeats = totalSeats;
        this.rowsCount = rowsCount;
        this.seatsPerRow = seatsPerRow;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getTotalSeats() {
        return totalSeats;
    }

    public void setTotalSeats(Integer totalSeats) {
        this.totalSeats = totalSeats;
    }

    public Integer getRowsCount() {
        return rowsCount;
    }

    public void setRowsCount(Integer rowsCount) {
        this.rowsCount = rowsCount;
    }

    public Integer getSeatsPerRow() {
        return seatsPerRow;
    }

    public void setSeatsPerRow(Integer seatsPerRow) {
        this.seatsPerRow = seatsPerRow;
    }
}
