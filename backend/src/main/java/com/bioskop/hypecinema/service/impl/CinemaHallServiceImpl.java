package com.bioskop.hypecinema.service.impl;

import com.bioskop.hypecinema.model.CinemaHall;
import com.bioskop.hypecinema.repository.CinemaHallRepository;
import com.bioskop.hypecinema.service.CinemaHallService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CinemaHallServiceImpl implements CinemaHallService {

    private final CinemaHallRepository cinemaHallRepository;

    @Autowired
    public CinemaHallServiceImpl(CinemaHallRepository cinemaHallRepository) {
        this.cinemaHallRepository = cinemaHallRepository;
    }

    @Override
    public List<CinemaHall> getAllHalls() {
        return cinemaHallRepository.findAll();
    }

    @Override
    public CinemaHall getHallById(Long id) {
        return cinemaHallRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bioskopska sala nije pronađena sa ID-em: " + id));
    }

    @Override
    public CinemaHall createHall(CinemaHall hall) {
        return cinemaHallRepository.save(hall);
    }

    @Override
    public void deleteHall(Long id) {
        CinemaHall hall = getHallById(id);
        cinemaHallRepository.delete(hall);
    }
}
