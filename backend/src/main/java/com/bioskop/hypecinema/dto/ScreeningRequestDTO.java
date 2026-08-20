package com.bioskop.hypecinema.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class ScreeningRequestDTO {

    @NotNull
    private Long movieId;

    @NotNull
    private Long hallId;

    @NotNull
    private LocalDateTime startTime;

    @NotNull
    private Double ticketPrice;

    private String cinemaId;

    public ScreeningRequestDTO() {
    }

    public ScreeningRequestDTO(Long movieId, Long hallId, LocalDateTime startTime, Double ticketPrice) {
        this(movieId, hallId, startTime, ticketPrice, "BEOGRAD");
    }

    public ScreeningRequestDTO(Long movieId, Long hallId, LocalDateTime startTime, Double ticketPrice, String cinemaId) {
        this.movieId = movieId;
        this.hallId = hallId;
        this.startTime = startTime;
        this.ticketPrice = ticketPrice;
        this.cinemaId = cinemaId;
    }

    public Long getMovieId() {
        return movieId;
    }

    public void setMovieId(Long movieId) {
        this.movieId = movieId;
    }

    public Long getHallId() {
        return hallId;
    }

    public void setHallId(Long hallId) {
        this.hallId = hallId;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public Double getTicketPrice() {
        return ticketPrice;
    }

    public void setTicketPrice(Double ticketPrice) {
        this.ticketPrice = ticketPrice;
    }

    public String getCinemaId() {
        return cinemaId;
    }

    public void setCinemaId(String cinemaId) {
        this.cinemaId = cinemaId;
    }
}
