package com.bioskop.hypecinema.repository;

import com.bioskop.hypecinema.model.BookingSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingSeatRepository extends JpaRepository<BookingSeat, Long> {

    /** Pronađi sva zauzeta sedišta za datu projekciju */
    List<BookingSeat> findByScreeningId(Long screeningId);

    /** Proveri da li je specifično sedište zauzeto za datu projekciju */
    boolean existsByScreeningIdAndRowNumAndSeatNum(Long screeningId, Integer rowNum, Integer seatNum);
}
