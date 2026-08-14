package com.bioskop.hypecinema.controller;

import com.bioskop.hypecinema.dto.BookingRequestDTO;
import com.bioskop.hypecinema.dto.BookingResponseDTO;
import com.bioskop.hypecinema.dto.SeatRequestDTO;
import com.bioskop.hypecinema.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*", maxAge = 3600)
public class BookingController {

    private final BookingService bookingService;

    @Autowired
    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BookingResponseDTO> createBooking(@Valid @RequestBody BookingRequestDTO request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        BookingResponseDTO response = bookingService.createBooking(username, request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/my-bookings")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<BookingResponseDTO>> getMyBookings() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        return ResponseEntity.ok(bookingService.getUserBookings(username));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BookingResponseDTO>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @GetMapping("/reference/{ref}")
    public ResponseEntity<BookingResponseDTO> getBookingByReference(@PathVariable String ref) {
        return ResponseEntity.ok(bookingService.getBookingByRef(ref));
    }

    @GetMapping("/occupied-seats/{screeningId}")
    public ResponseEntity<List<SeatRequestDTO>> getOccupiedSeats(@PathVariable Long screeningId) {
        return ResponseEntity.ok(bookingService.getOccupiedSeats(screeningId));
    }

    @PutMapping("/{id}/cancel")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BookingResponseDTO> cancelBooking(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        BookingResponseDTO cancelled = bookingService.cancelBooking(username, id);
        return ResponseEntity.ok(cancelled);
    }
}
