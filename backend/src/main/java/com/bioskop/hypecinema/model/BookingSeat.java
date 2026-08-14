package com.bioskop.hypecinema.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "booking_seats")
public class BookingSeat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    @JsonIgnore
    private Booking booking;

    @NotNull
    @Column(name = "row_num", nullable = false)
    private Integer rowNum;

    @NotNull
    @Column(name = "seat_num", nullable = false)
    private Integer seatNum;

    public BookingSeat() {
    }

    public BookingSeat(Integer rowNum, Integer seatNum) {
        this.rowNum = rowNum;
        this.seatNum = seatNum;
    }

    public BookingSeat(Booking booking, Integer rowNum, Integer seatNum) {
        this.booking = booking;
        this.rowNum = rowNum;
        this.seatNum = seatNum;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Booking getBooking() {
        return booking;
    }

    public void setBooking(Booking booking) {
        this.booking = booking;
    }

    public Integer getRowNum() {
        return rowNum;
    }

    public void setRowNum(Integer rowNum) {
        this.rowNum = rowNum;
    }

    public Integer getSeatNum() {
        return seatNum;
    }

    public void setSeatNum(Integer seatNum) {
        this.seatNum = seatNum;
    }
}
