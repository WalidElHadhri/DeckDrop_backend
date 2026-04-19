package com.deckdrop.backend.controller;

import com.deckdrop.backend.model.Category;
import com.deckdrop.backend.model.Subcategory;
import com.deckdrop.backend.repository.CategoryRepository;
import com.deckdrop.backend.repository.SubcategoryRepository;
import com.deckdrop.backend.exception.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryRepository categoryRepository;
    private final SubcategoryRepository subcategoryRepository;

    public CategoryController(CategoryRepository categoryRepository, SubcategoryRepository subcategoryRepository) {
        this.categoryRepository = categoryRepository;
        this.subcategoryRepository = subcategoryRepository;
    }

    @GetMapping
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Category createCategory(@RequestBody Category category) {
        return categoryRepository.save(category);
    }

    @PutMapping("/{id}")
    public Category updateCategory(@PathVariable Long id, @RequestBody Category categoryDetails) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        category.setName(categoryDetails.getName());
        category.setDescription(categoryDetails.getDescription());
        return categoryRepository.save(category);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCategory(@PathVariable Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Category not found");
        }
        categoryRepository.deleteById(id);
    }

    @PostMapping("/{categoryId}/subcategories")
    @ResponseStatus(HttpStatus.CREATED)
    public Subcategory createSubcategory(@PathVariable Long categoryId, @RequestBody Subcategory subcategory) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        subcategory.setCategory(category);
        return subcategoryRepository.save(subcategory);
    }

    @PutMapping("/subcategories/{subcategoryId}")
    public Subcategory updateSubcategory(@PathVariable Long subcategoryId, @RequestBody Subcategory subcategoryDetails) {
        Subcategory subcategory = subcategoryRepository.findById(subcategoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Subcategory not found"));
        subcategory.setName(subcategoryDetails.getName());
        subcategory.setDescription(subcategoryDetails.getDescription());
        return subcategoryRepository.save(subcategory);
    }

    @DeleteMapping("/subcategories/{subcategoryId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteSubcategory(@PathVariable Long subcategoryId) {
        if (!subcategoryRepository.existsById(subcategoryId)) {
            throw new ResourceNotFoundException("Subcategory not found");
        }
        subcategoryRepository.deleteById(subcategoryId);
    }
}