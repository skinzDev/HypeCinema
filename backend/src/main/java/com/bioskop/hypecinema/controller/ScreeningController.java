package com.bioskop.hypecinema.controller;

import com.bioskop.hypecinema.dto.ScreeningRequestDTO;
import com.bioskop.hypecinema.model.Screening;
import com.bioskop.hypecinema.service.ScreeningService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/screenings")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ScreeningController {

    private final ScreeningService screeningService;

    @Autowired
    public ScreeningController(ScreeningService screeningService) {
        this.screeningService = screeningService;
    }

    @GetMapping
    public ResponseEntity<List<Screening>> getAllScreenings() {
        return ResponseEntity.ok(screeningService.getAllScreenings());
    }

    @GetMapping("/movie/{movieId}")
    public ResponseEntity<List<Screening>> getScreeningsByMovie(@PathVariable Long movieId) {
        return ResponseEntity.ok(screeningService.getScreeningsByMovie(movieId));
    }

    @GetMapping("/range")
    public ResponseEntity<List<Screening>> getScreeningsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return ResponseEntity.ok(screeningService.getScreeningsByDateRange(start, end));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Screening> getScreeningById(@PathVariable Long id) {
        return ResponseEntity.ok(screeningService.getScreeningById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Screening> createScreening(@Valid @RequestBody ScreeningRequestDTO request) {
        Screening createdScreening = screeningService.createScreening(request);
        return new ResponseEntity<>(createdScreening, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteScreening(@PathVariable Long id) {
        screeningService.deleteScreening(id);
        return ResponseEntity.ok("Projekcija uspešno obrisana.");
    }
}
