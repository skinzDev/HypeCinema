package com.bioskop.hypecinema.repository;

import com.bioskop.hypecinema.model.CinemaHall;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CinemaHallRepository extends JpaRepository<CinemaHall, Long> {

    Optional<CinemaHall> findByName(String name);
}
