package com.bioskop.hypecinema.repository;

import com.bioskop.hypecinema.model.Screening;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ScreeningRepository extends JpaRepository<Screening, Long> {
    List<Screening> findByMovieId(Long movieId);
    List<Screening> findByHallId(Long hallId);
    List<Screening> findByStartTimeBetween(LocalDateTime start, LocalDateTime end);
    List<Screening> findByMovieIdAndStartTimeBetween(Long movieId, LocalDateTime start, LocalDateTime end);
}
