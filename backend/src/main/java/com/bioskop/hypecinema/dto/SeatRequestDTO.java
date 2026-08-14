package com.bioskop.hypecinema.dto;

import jakarta.validation.constraints.NotNull;

public class SeatRequestDTO {

    @NotNull
    private Integer rowNum;

    @NotNull
    private Integer seatNum;

    public SeatRequestDTO() {
    }

    public SeatRequestDTO(Integer rowNum, Integer seatNum) {
        this.rowNum = rowNum;
        this.seatNum = seatNum;
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
