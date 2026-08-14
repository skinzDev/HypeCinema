package com.bioskop.hypecinema.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class BookingRequestDTO {

    @NotNull
    private Long screeningId;

    @NotEmpty
    private List<SeatRequestDTO> seats;

    private Integer pointsToRedeem = 0;

    public BookingRequestDTO() {
    }

    public BookingRequestDTO(Long screeningId, List<SeatRequestDTO> seats, Integer pointsToRedeem) {
        this.screeningId = screeningId;
        this.seats = seats;
        this.pointsToRedeem = pointsToRedeem;
    }

    public Long getScreeningId() {
        return screeningId;
    }

    public void setScreeningId(Long screeningId) {
        this.screeningId = screeningId;
    }

    public List<SeatRequestDTO> getSeats() {
        return seats;
    }

    public void setSeats(List<SeatRequestDTO> seats) {
        this.seats = seats;
    }

    public Integer getPointsToRedeem() {
        return pointsToRedeem;
    }

    public void setPointsToRedeem(Integer pointsToRedeem) {
        this.pointsToRedeem = pointsToRedeem;
    }
}
