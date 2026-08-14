package com.bioskop.hypecinema.dto;

import com.bioskop.hypecinema.model.LoyaltyTier;
import com.bioskop.hypecinema.model.Role;

public class AuthResponse {

    private String token;
    private String tokenType = "Bearer";
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private Role role;
    private int loyaltyPoints;
    private int lifetimePoints;
    private LoyaltyTier loyaltyTier;

    public AuthResponse() {
    }

    public AuthResponse(String token, Long id, String username, String email, String fullName, Role role, int loyaltyPoints, int lifetimePoints, LoyaltyTier loyaltyTier) {
        this.token = token;
        this.tokenType = "Bearer";
        this.id = id;
        this.username = username;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
        this.loyaltyPoints = loyaltyPoints;
        this.lifetimePoints = lifetimePoints;
        this.loyaltyTier = loyaltyTier;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public int getLoyaltyPoints() {
        return loyaltyPoints;
    }

    public void setLoyaltyPoints(int loyaltyPoints) {
        this.loyaltyPoints = loyaltyPoints;
    }

    public int getLifetimePoints() {
        return lifetimePoints;
    }

    public void setLifetimePoints(int lifetimePoints) {
        this.lifetimePoints = lifetimePoints;
    }

    public LoyaltyTier getLoyaltyTier() {
        return loyaltyTier;
    }

    public void setLoyaltyTier(LoyaltyTier loyaltyTier) {
        this.loyaltyTier = loyaltyTier;
    }
}
