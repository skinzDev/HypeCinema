package com.bioskop.hypecinema.service.impl;

import com.bioskop.hypecinema.dto.ScreeningRequestDTO;
import com.bioskop.hypecinema.model.Booking;
import com.bioskop.hypecinema.model.CinemaHall;
import com.bioskop.hypecinema.model.Movie;
import com.bioskop.hypecinema.model.Screening;
import com.bioskop.hypecinema.repository.BookingRepository;
import com.bioskop.hypecinema.repository.CinemaHallRepository;
import com.bioskop.hypecinema.repository.MovieRepository;
import com.bioskop.hypecinema.repository.ScreeningRepository;
import com.bioskop.hypecinema.service.ScreeningService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ScreeningServiceImpl implements ScreeningService {

    private final ScreeningRepository screeningRepository;
    private final MovieRepository movieRepository;
    private final CinemaHallRepository cinemaHallRepository;
    private final BookingRepository bookingRepository;

    @Autowired
    public ScreeningServiceImpl(ScreeningRepository screeningRepository,
                                MovieRepository movieRepository,
                                CinemaHallRepository cinemaHallRepository,
                                BookingRepository bookingRepository) {
        this.screeningRepository = screeningRepository;
        this.movieRepository = movieRepository;
        this.cinemaHallRepository = cinemaHallRepository;
        this.bookingRepository = bookingRepository;
    }

    @Override
    public List<Screening> getAllScreenings() {
        return screeningRepository.findAll();
    }

    @Override
    public List<Screening> getScreeningsByMovie(Long movieId) {
        return screeningRepository.findByMovieId(movieId);
    }

    @Override
    public List<Screening> getScreeningsByDateRange(LocalDateTime start, LocalDateTime end) {
        return screeningRepository.findByStartTimeBetween(start, end);
    }

    @Override
    public Screening getScreeningById(Long id) {
        return screeningRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Projekcija nije pronađena sa ID-em: " + id));
    }

    @Override
    public Screening createScreening(ScreeningRequestDTO request) {
        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new RuntimeException("Film nije pronađen sa ID-em: " + request.getMovieId()));

        CinemaHall hall = cinemaHallRepository.findById(request.getHallId())
                .orElseThrow(() -> new RuntimeException("Sala nije pronađena sa ID-em: " + request.getHallId()));

        Screening screening = new Screening(movie, hall, request.getStartTime(), request.getTicketPrice(), request.getCinemaId());
        return screeningRepository.save(screening);
    }

    @Override
    @Transactional
    public void deleteScreening(Long id) {
        Screening screening = getScreeningById(id);
        List<Booking> bookings = bookingRepository.findByScreeningId(id);
        if (!bookings.isEmpty()) {
            bookingRepository.deleteAll(bookings);
        }
        screeningRepository.delete(screening);
    }
}
