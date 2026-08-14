package com.bioskop.hypecinema.service.impl;

import com.bioskop.hypecinema.dto.AuthResponse;
import com.bioskop.hypecinema.dto.LoginRequest;
import com.bioskop.hypecinema.dto.RegisterRequest;
import com.bioskop.hypecinema.dto.UserDTO;
import com.bioskop.hypecinema.model.Role;
import com.bioskop.hypecinema.model.User;
import com.bioskop.hypecinema.repository.UserRepository;
import com.bioskop.hypecinema.security.JwtTokenProvider;
import com.bioskop.hypecinema.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    @Autowired
    public AuthServiceImpl(AuthenticationManager authenticationManager,
                            UserRepository userRepository,
                            PasswordEncoder passwordEncoder,
                            JwtTokenProvider tokenProvider) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    @Override
    @Transactional
    public AuthResponse registerUser(RegisterRequest registerRequest) {
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new IllegalArgumentException("Korisničko ime je već zauzeto!");
        }

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new IllegalArgumentException("Email adresa je već u upotrebi!");
        }

        Role userRole = registerRequest.getRole() != null ? registerRequest.getRole() : Role.ROLE_USER;

        User user = new User(
                registerRequest.getUsername(),
                registerRequest.getEmail(),
                passwordEncoder.encode(registerRequest.getPassword()),
                registerRequest.getFullName(),
                registerRequest.getPhoneNumber(),
                userRole
        );

        User savedUser = userRepository.save(user);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        registerRequest.getUsername(),
                        registerRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        return new AuthResponse(
                jwt,
                savedUser.getId(),
                savedUser.getUsername(),
                savedUser.getEmail(),
                savedUser.getFullName(),
                savedUser.getRole(),
                savedUser.getLoyaltyPoints(),
                savedUser.getLifetimePoints(),
                savedUser.getLoyaltyTier()
        );
    }

    @Override
    public AuthResponse loginUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsernameOrEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        User user = userRepository.findByUsernameOrEmail(loginRequest.getUsernameOrEmail(), loginRequest.getUsernameOrEmail())
                .orElseThrow(() -> new IllegalArgumentException("Korisnik nije pronađen."));

        return new AuthResponse(
                jwt,
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getRole(),
                user.getLoyaltyPoints(),
                user.getLifetimePoints(),
                user.getLoyaltyTier()
        );
    }

    @Override
    public UserDTO getCurrentUserProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Korisnik nije pronađen sa korisničkim imenom: " + username));
        return new UserDTO(user);
    }
}
