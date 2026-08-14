package com.bioskop.hypecinema.service;

import com.bioskop.hypecinema.model.CinemaHall;

import java.util.List;

public interface CinemaHallService {
    List<CinemaHall> getAllHalls();
    CinemaHall getHallById(Long id);
    CinemaHall createHall(CinemaHall hall);
    void deleteHall(Long id);
}
