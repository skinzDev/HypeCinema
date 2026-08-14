package com.bioskop.hypecinema.dto;

import com.bioskop.hypecinema.model.Booking;
import com.bioskop.hypecinema.model.BookingStatus;
import com.bioskop.hypecinema.model.BookingSeat;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class BookingResponseDTO {

    private Long id;
    private String bookingReference;
    private String username;
    private String movieTitle;
    private String posterUrl;
    private String hallName;
    private LocalDateTime startTime;
    private Double totalPrice;
    private BookingStatus status;
    private Integer pointsEarned;
    private Integer pointsRedeemed;
    private Double discountAmount;
    private List<SeatRequestDTO> seats;
    private LocalDateTime createdAt;

    public BookingResponseDTO() {
    }

    public BookingResponseDTO(Booking booking) {
        this.id = booking.getId();
        this.bookingReference = booking.getBookingReference();
        this.username = booking.getUser().getUsername();
        if (booking.getScreening() != null) {
            if (booking.getScreening().getMovie() != null) {
                this.movieTitle = booking.getScreening().getMovie().getTitle();
                this.posterUrl = booking.getScreening().getMovie().getPosterUrl();
            }
            if (booking.getScreening().getHall() != null) {
                this.hallName = booking.getScreening().getHall().getName();
            }
            this.startTime = booking.getScreening().getStartTime();
        }
        this.totalPrice = booking.getTotalPrice();
        this.status = booking.getStatus();
        this.pointsEarned = booking.getPointsEarned();
        this.pointsRedeemed = booking.getPointsRedeemed();
        this.discountAmount = booking.getDiscountAmount();
        if (booking.getSeats() != null) {
            this.seats = booking.getSeats().stream()
                    .map(seat -> new SeatRequestDTO(seat.getRowNum(), seat.getSeatNum()))
                    .collect(Collectors.toList());
        }
        this.createdAt = booking.getCreatedAt();
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBookingReference() {
        return bookingReference;
    }

    public void setBookingReference(String bookingReference) {
        this.bookingReference = bookingReference;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getMovieTitle() {
        return movieTitle;
    }

    public void setMovieTitle(String movieTitle) {
        this.movieTitle = movieTitle;
    }

    public String getPosterUrl() {
        return posterUrl;
    }

    public void setPosterUrl(String posterUrl) {
        this.posterUrl = posterUrl;
    }

    public String getHallName() {
        return hallName;
    }

    public void setHallName(String hallName) {
        this.hallName = hallName;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public Double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }

    public Integer getPointsEarned() {
        return pointsEarned;
    }

    public void setPointsEarned(Integer pointsEarned) {
        this.pointsEarned = pointsEarned;
    }

    public Integer getPointsRedeemed() {
        return pointsRedeemed;
    }

    public void setPointsRedeemed(Integer pointsRedeemed) {
        this.pointsRedeemed = pointsRedeemed;
    }

    public Double getDiscountAmount() {
        return discountAmount;
    }

    public void setDiscountAmount(Double discountAmount) {
        this.discountAmount = discountAmount;
    }

    public List<SeatRequestDTO> getSeats() {
        return seats;
    }

    public void setSeats(List<SeatRequestDTO> seats) {
        this.seats = seats;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
