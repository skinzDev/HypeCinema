package com.bioskop.hypecinema.controller;

import com.bioskop.hypecinema.model.CinemaHall;
import com.bioskop.hypecinema.service.CinemaHallService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/halls")
@CrossOrigin(origins = "*", maxAge = 3600)
public class CinemaHallController {

    private final CinemaHallService cinemaHallService;

    @Autowired
    public CinemaHallController(CinemaHallService cinemaHallService) {
        this.cinemaHallService = cinemaHallService;
    }

    @GetMapping
    public ResponseEntity<List<CinemaHall>> getAllHalls() {
        return ResponseEntity.ok(cinemaHallService.getAllHalls());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CinemaHall> getHallById(@PathVariable Long id) {
        return ResponseEntity.ok(cinemaHallService.getHallById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CinemaHall> createHall(@Valid @RequestBody CinemaHall hall) {
        CinemaHall createdHall = cinemaHallService.createHall(hall);
        return new ResponseEntity<>(createdHall, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteHall(@PathVariable Long id) {
        cinemaHallService.deleteHall(id);
        return ResponseEntity.ok("Bioskopska sala uspešno obrisana.");
    }
}
