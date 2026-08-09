package com.bioskop.hypecinema.repository;

import com.bioskop.hypecinema.model.Movie;
import com.bioskop.hypecinema.model.MovieStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {

    List<Movie> findByStatus(MovieStatus status);

    List<Movie> findByGenreIgnoreCase(String genre);

    List<Movie> findByTitleContainingIgnoreCase(String title);

    List<Movie> findByStatusOrderByRatingDesc(MovieStatus status);
}
