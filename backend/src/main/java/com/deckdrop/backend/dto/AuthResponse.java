package com.deckdrop.backend.dto;

public record AuthResponse(
        String token,
        String tokenType,
        String email,
        String role
) {
}
