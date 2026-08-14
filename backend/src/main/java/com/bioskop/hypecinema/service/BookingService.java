package com.bioskop.hypecinema.service;

import com.bioskop.hypecinema.dto.BookingRequestDTO;
import com.bioskop.hypecinema.dto.BookingResponseDTO;
import com.bioskop.hypecinema.dto.SeatRequestDTO;

import java.util.List;

public interface BookingService {
    BookingResponseDTO createBooking(String username, BookingRequestDTO request);
    List<BookingResponseDTO> getUserBookings(String username);
    List<BookingResponseDTO> getAllBookings();
    BookingResponseDTO getBookingByRef(String bookingReference);
    List<SeatRequestDTO> getOccupiedSeats(Long screeningId);
    BookingResponseDTO cancelBooking(String username, Long bookingId);
}
