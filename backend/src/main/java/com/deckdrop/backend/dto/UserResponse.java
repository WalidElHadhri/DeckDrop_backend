package com.deckdrop.backend.dto;

import java.time.Instant;

public record UserResponse(
        Long id,
        String email,
        String firstName,
        String lastName,
        String phoneNumber,
        String address,
        String profilePicUrl,
        String role,
        Instant createdAt,
        Instant updatedAt
) {
}
