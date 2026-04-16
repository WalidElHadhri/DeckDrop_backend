package com.deckdrop.backend.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

public record ProductResponse(
        Long id,
        String name,
        String description,
        BigDecimal price,
        String currency,
        boolean preorder,
        LocalDate releaseDate,
        Integer stockQuantity,
        Instant createdAt,
        Instant updatedAt
) {
}
