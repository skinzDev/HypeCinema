package com.bioskop.hypecinema.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "booking_reference", nullable = false, unique = true, length = 30)
    private String bookingReference;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "screening_id", nullable = false)
    private Screening screening;

    @NotNull
    @Column(name = "total_price", nullable = false)
    private Double totalPrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private BookingStatus status = BookingStatus.CONFIRMED;

    @Column(name = "points_earned")
    private Integer pointsEarned = 0;

    @Column(name = "points_redeemed")
    private Integer pointsRedeemed = 0;

    @Column(name = "discount_amount")
    private Double discountAmount = 0.0;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<BookingSeat> seats = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Booking() {
    }

    public Booking(String bookingReference, User user, Screening screening, Double totalPrice, BookingStatus status, Integer pointsEarned, Integer pointsRedeemed, Double discountAmount) {
        this.bookingReference = bookingReference;
        this.user = user;
        this.screening = screening;
        this.totalPrice = totalPrice;
        this.status = status != null ? status : BookingStatus.CONFIRMED;
        this.pointsEarned = pointsEarned != null ? pointsEarned : 0;
        this.pointsRedeemed = pointsRedeemed != null ? pointsRedeemed : 0;
        this.discountAmount = discountAmount != null ? discountAmount : 0.0;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public void addSeat(BookingSeat seat) {
        seats.add(seat);
        seat.setBooking(this);
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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Screening getScreening() {
        return screening;
    }

    public void setScreening(Screening screening) {
        this.screening = screening;
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

    public List<BookingSeat> getSeats() {
        return seats;
    }

    public void setSeats(List<BookingSeat> seats) {
        this.seats = seats;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
