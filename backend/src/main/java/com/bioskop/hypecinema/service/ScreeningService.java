package com.bioskop.hypecinema.service;

import com.bioskop.hypecinema.dto.ScreeningRequestDTO;
import com.bioskop.hypecinema.model.Screening;

import java.time.LocalDateTime;
import java.util.List;

public interface ScreeningService {
    List<Screening> getAllScreenings();
    List<Screening> getScreeningsByMovie(Long movieId);
    List<Screening> getScreeningsByDateRange(LocalDateTime start, LocalDateTime end);
    Screening getScreeningById(Long id);
    Screening createScreening(ScreeningRequestDTO request);
    void deleteScreening(Long id);
}
