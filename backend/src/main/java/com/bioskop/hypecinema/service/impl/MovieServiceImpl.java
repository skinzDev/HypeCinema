package com.bioskop.hypecinema.service.impl;

import com.bioskop.hypecinema.model.Booking;
import com.bioskop.hypecinema.model.Movie;
import com.bioskop.hypecinema.model.MovieStatus;
import com.bioskop.hypecinema.model.Screening;
import com.bioskop.hypecinema.repository.BookingRepository;
import com.bioskop.hypecinema.repository.MovieRepository;
import com.bioskop.hypecinema.repository.ScreeningRepository;
import com.bioskop.hypecinema.service.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MovieServiceImpl implements MovieService {

    private final MovieRepository movieRepository;
    private final ScreeningRepository screeningRepository;
    private final BookingRepository bookingRepository;

    @Autowired
    public MovieServiceImpl(MovieRepository movieRepository,
                            ScreeningRepository screeningRepository,
                            BookingRepository bookingRepository) {
        this.movieRepository = movieRepository;
        this.screeningRepository = screeningRepository;
        this.bookingRepository = bookingRepository;
    }

    @Override
    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    @Override
    public List<Movie> getMoviesByStatus(MovieStatus status) {
        return movieRepository.findByStatus(status);
    }

    @Override
    public Movie getMovieById(Long id) {
        return movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Film nije pronađen sa ID-em: " + id));
    }

    @Override
    public Movie createMovie(Movie movie) {
        return movieRepository.save(movie);
    }

    @Override
    public Movie updateMovie(Long id, Movie movieDetails) {
        Movie movie = getMovieById(id);
        movie.setTitle(movieDetails.getTitle());
        movie.setDescription(movieDetails.getDescription());
        movie.setGenre(movieDetails.getGenre());
        movie.setDurationMinutes(movieDetails.getDurationMinutes());
        movie.setRating(movieDetails.getRating());
        movie.setPosterUrl(movieDetails.getPosterUrl());
        movie.setDirector(movieDetails.getDirector());
        movie.setActors(movieDetails.getActors());
        movie.setReleaseDate(movieDetails.getReleaseDate());
        if (movieDetails.getStatus() != null) {
            movie.setStatus(movieDetails.getStatus());
        }
        return movieRepository.save(movie);
    }

    @Override
    @Transactional
    public void deleteMovie(Long id) {
        Movie movie = getMovieById(id);
        List<Screening> screenings = screeningRepository.findByMovieId(id);
        for (Screening screening : screenings) {
            List<Booking> bookings = bookingRepository.findByScreeningId(screening.getId());
            if (!bookings.isEmpty()) {
                bookingRepository.deleteAll(bookings);
            }
        }
        if (!screenings.isEmpty()) {
            screeningRepository.deleteAll(screenings);
        }
        movieRepository.delete(movie);
    }
}
