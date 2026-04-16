package com.deckdrop.backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;

public record ProductRequest(
        @NotBlank @Size(max = 150) String name,
        @Size(max = 2000) String description,
        @NotNull @DecimalMin("0.00") BigDecimal price,
        @NotBlank @Size(min = 3, max = 3) String currency,
        boolean preorder,
        LocalDate releaseDate,
        @NotNull @Min(0) Integer stockQuantity
) {
}
