package com.bioskop.hypecinema.repository;

import com.bioskop.hypecinema.model.BookingSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingSeatRepository extends JpaRepository<BookingSeat, Long> {
    
    @Query("SELECT bs FROM BookingSeat bs WHERE bs.booking.screening.id = :screeningId AND bs.booking.status = 'CONFIRMED'")
    List<BookingSeat> findOccupiedSeatsForScreening(@Param("screeningId") Long screeningId);
}
