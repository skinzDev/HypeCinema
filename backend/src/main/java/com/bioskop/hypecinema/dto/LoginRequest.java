package com.bioskop.hypecinema.dto;

public class LoginRequest {

    private String usernameOrEmail;
    private String username;
    private String password;

    public LoginRequest() {
    }

    public LoginRequest(String usernameOrEmail, String password) {
        this.usernameOrEmail = usernameOrEmail;
        this.password = password;
    }

    public String getUsernameOrEmail() {
        if (usernameOrEmail != null && !usernameOrEmail.trim().isEmpty()) {
            return usernameOrEmail;
        }
        return username;
    }

    public void setUsernameOrEmail(String usernameOrEmail) {
        this.usernameOrEmail = usernameOrEmail;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
        if (this.usernameOrEmail == null) {
            this.usernameOrEmail = username;
        }
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}

