package com.bioskop.hypecinema.service.impl;

import com.bioskop.hypecinema.dto.BookingRequestDTO;
import com.bioskop.hypecinema.dto.BookingResponseDTO;
import com.bioskop.hypecinema.dto.SeatRequestDTO;
import com.bioskop.hypecinema.model.*;
import com.bioskop.hypecinema.repository.*;
import com.bioskop.hypecinema.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final BookingSeatRepository bookingSeatRepository;
    private final UserRepository userRepository;
    private final ScreeningRepository screeningRepository;

    @Autowired
    public BookingServiceImpl(BookingRepository bookingRepository,
                               BookingSeatRepository bookingSeatRepository,
                               UserRepository userRepository,
                               ScreeningRepository screeningRepository) {
        this.bookingRepository = bookingRepository;
        this.bookingSeatRepository = bookingSeatRepository;
        this.userRepository = userRepository;
        this.screeningRepository = screeningRepository;
    }

    @Override
    @Transactional
    public BookingResponseDTO createBooking(String username, BookingRequestDTO request) {
        User user = userRepository.findByUsername(username)
                .or(() -> userRepository.findByEmail(username))
                .orElseThrow(() -> new RuntimeException("Korisnik nije pronađen: " + username));

        Screening screening = screeningRepository.findById(request.getScreeningId())
                .orElseThrow(() -> new RuntimeException("Projekcija nije pronađena sa ID-em: " + request.getScreeningId()));

        List<BookingSeat> occupiedSeats = bookingSeatRepository.findOccupiedSeatsForScreening(screening.getId());
        for (SeatRequestDTO requestedSeat : request.getSeats()) {
            boolean isOccupied = occupiedSeats.stream()
                    .anyMatch(s -> s.getRowNum().equals(requestedSeat.getRowNum()) && s.getSeatNum().equals(requestedSeat.getSeatNum()));
            if (isOccupied) {
                throw new RuntimeException("Sedište (Red " + requestedSeat.getRowNum() + ", Mesto " + requestedSeat.getSeatNum() + ") je već zauzeto za ovu projekciju!");
            }
        }

        double basePrice = request.getSeats().size() * screening.getTicketPrice();

        int pointsToRedeem = 0;
        double discountAmount = 0.0;
        if (request.getPointsToRedeem() != null && request.getPointsToRedeem() > 0) {
            int availablePoints = user.getLoyaltyPoints();
            pointsToRedeem = Math.min(request.getPointsToRedeem(), availablePoints);
            discountAmount = Math.min(pointsToRedeem, basePrice);
            pointsToRedeem = (int) discountAmount; // 1 point = 1 RSD discount
            user.deductPoints(pointsToRedeem);
        }

        double finalPrice = basePrice - discountAmount;

        // Earn points: 10 points per 100 RSD spent
        int pointsEarned = (int) Math.floor((finalPrice / 100.0) * 10);

        // Apply Tier bonus
        if (user.getLoyaltyTier() == LoyaltyTier.SILVER) {
            pointsEarned = (int) Math.round(pointsEarned * 1.05); // +5% bonus
        } else if (user.getLoyaltyTier() == LoyaltyTier.GOLD) {
            pointsEarned = (int) Math.round(pointsEarned * 1.10); // +10% bonus
        }

        user.addPoints(pointsEarned);
        userRepository.save(user);

        String bookingReference = "HC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Booking booking = new Booking(
                bookingReference,
                user,
                screening,
                finalPrice,
                BookingStatus.CONFIRMED,
                pointsEarned,
                pointsToRedeem,
                discountAmount
        );

        for (SeatRequestDTO sDto : request.getSeats()) {
            BookingSeat seat = new BookingSeat(sDto.getRowNum(), sDto.getSeatNum());
            booking.addSeat(seat);
        }

        Booking savedBooking = bookingRepository.save(booking);
        return new BookingResponseDTO(savedBooking);
    }

    @Override
    public List<BookingResponseDTO> getUserBookings(String username) {
        User user = userRepository.findByUsername(username)
                .or(() -> userRepository.findByEmail(username))
                .orElseThrow(() -> new RuntimeException("Korisnik nije pronađen: " + username));

        return bookingRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(BookingResponseDTO::new)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookingResponseDTO> getAllBookings() {
        return bookingRepository.findAll()
                .stream()
                .map(BookingResponseDTO::new)
                .collect(Collectors.toList());
    }

    @Override
    public BookingResponseDTO getBookingByRef(String bookingReference) {
        Booking booking = bookingRepository.findByBookingReference(bookingReference)
                .orElseThrow(() -> new RuntimeException("Rezervacija nije pronađena sa referencom: " + bookingReference));
        return new BookingResponseDTO(booking);
    }

    @Override
    public List<SeatRequestDTO> getOccupiedSeats(Long screeningId) {
        return bookingSeatRepository.findOccupiedSeatsForScreening(screeningId)
                .stream()
                .map(seat -> new SeatRequestDTO(seat.getRowNum(), seat.getSeatNum()))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public BookingResponseDTO cancelBooking(String username, Long bookingId) {
        User user = userRepository.findByUsername(username)
                .or(() -> userRepository.findByEmail(username))
                .orElseThrow(() -> new RuntimeException("Korisnik nije pronađen: " + username));

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Rezervacija nije pronađena sa ID-em: " + bookingId));

        if (!booking.getUser().getId().equals(user.getId()) && !user.getRole().name().equals("ROLE_ADMIN")) {
            throw new RuntimeException("Nemate prava za otkazivanje ove rezervacije!");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new RuntimeException("Ova rezervacija je već otkazana!");
        }

        booking.setStatus(BookingStatus.CANCELLED);

        // Refund redeemed points to user
        if (booking.getPointsRedeemed() != null && booking.getPointsRedeemed() > 0) {
            user.setLoyaltyPoints(user.getLoyaltyPoints() + booking.getPointsRedeemed());
        }

        // Deduct earned points
        if (booking.getPointsEarned() != null && booking.getPointsEarned() > 0) {
            user.deductPoints(booking.getPointsEarned());
        }

        userRepository.save(user);
        Booking updatedBooking = bookingRepository.save(booking);

        return new BookingResponseDTO(updatedBooking);
    }
}
