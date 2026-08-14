package com.bioskop.hypecinema.repository;

import com.bioskop.hypecinema.model.Booking;
import com.bioskop.hypecinema.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Booking> findByScreeningId(Long screeningId);
    Optional<Booking> findByBookingReference(String bookingReference);
    List<Booking> findByScreeningIdAndStatus(Long screeningId, BookingStatus status);
}
