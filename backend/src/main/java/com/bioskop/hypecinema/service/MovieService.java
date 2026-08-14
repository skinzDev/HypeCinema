package com.bioskop.hypecinema.service;

import com.bioskop.hypecinema.model.Movie;
import com.bioskop.hypecinema.model.MovieStatus;

import java.util.List;

public interface MovieService {
    List<Movie> getAllMovies();
    List<Movie> getMoviesByStatus(MovieStatus status);
    Movie getMovieById(Long id);
    Movie createMovie(Movie movie);
    Movie updateMovie(Long id, Movie movieDetails);
    void deleteMovie(Long id);
}
