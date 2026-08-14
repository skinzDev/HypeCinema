package com.bioskop.hypecinema.controller;

import com.bioskop.hypecinema.dto.AuthResponse;
import com.bioskop.hypecinema.dto.LoginRequest;
import com.bioskop.hypecinema.dto.MessageResponse;
import com.bioskop.hypecinema.dto.RegisterRequest;
import com.bioskop.hypecinema.dto.UserDTO;
import com.bioskop.hypecinema.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            AuthResponse authResponse = authService.registerUser(registerRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(authResponse);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage(), false));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Greška prilikom registracije: " + e.getMessage(), false));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            AuthResponse authResponse = authService.loginUser(loginRequest);
            return ResponseEntity.ok(authResponse);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("Neispravno korisničko ime ili lozinka!", false));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("Korisnik nije autentifikovan.", false));
        }
        UserDTO userDTO = authService.getCurrentUserProfile(authentication.getName());
        return ResponseEntity.ok(userDTO);
    }

    @GetMapping("/admin-check")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> checkAdminAccess() {
        return ResponseEntity.ok(new MessageResponse("Uspešno ste pristupili Admin zaštićenoj ruti!", true));
    }
}
