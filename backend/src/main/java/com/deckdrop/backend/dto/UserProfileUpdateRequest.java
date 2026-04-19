package com.deckdrop.backend.dto;

public record UserProfileUpdateRequest(
        String firstName,
        String lastName,
        String phoneNumber,
        String address,
        String profilePicUrl
) {
}
