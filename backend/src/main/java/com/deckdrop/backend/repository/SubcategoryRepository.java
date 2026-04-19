package com.deckdrop.backend.repository;

import com.deckdrop.backend.model.Subcategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubcategoryRepository extends JpaRepository<Subcategory, Long> {
}