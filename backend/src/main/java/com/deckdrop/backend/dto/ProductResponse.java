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
        CategoryDto category,
        SubcategoryDto subcategory,
        java.util.List<String> images,
        Instant createdAt,
        Instant updatedAt
) {
    public record CategoryDto(Long id, String name) {}
    public record SubcategoryDto(Long id, String name) {}
}
