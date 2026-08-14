package com.bioskop.hypecinema.service;

import com.bioskop.hypecinema.dto.AuthResponse;
import com.bioskop.hypecinema.dto.LoginRequest;
import com.bioskop.hypecinema.dto.RegisterRequest;
import com.bioskop.hypecinema.dto.UserDTO;

public interface AuthService {

    AuthResponse registerUser(RegisterRequest registerRequest);

    AuthResponse loginUser(LoginRequest loginRequest);

    UserDTO getCurrentUserProfile(String username);
}
