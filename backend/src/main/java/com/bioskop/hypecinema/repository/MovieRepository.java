package com.bioskop.hypecinema.repository;

import com.bioskop.hypecinema.model.Movie;
import com.bioskop.hypecinema.model.MovieStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {
    Optional<Movie> findByTitle(String title);
    List<Movie> findByStatus(MovieStatus status);
    List<Movie> findByGenreContainingIgnoreCase(String genre);
}
