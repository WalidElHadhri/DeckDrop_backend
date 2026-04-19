package com.deckdrop.backend.service;

import com.deckdrop.backend.dto.ProductRequest;
import com.deckdrop.backend.dto.ProductResponse;
import com.deckdrop.backend.exception.ResourceNotFoundException;
import com.deckdrop.backend.model.Product;
import com.deckdrop.backend.repository.ProductRepository;
import com.deckdrop.backend.model.Category;
import com.deckdrop.backend.model.Subcategory;
import com.deckdrop.backend.repository.CategoryRepository;
import com.deckdrop.backend.repository.SubcategoryRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final SubcategoryRepository subcategoryRepository;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository, SubcategoryRepository subcategoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.subcategoryRepository = subcategoryRepository;
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> findAll() {
        return productRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public ProductResponse findById(Long id) {
        return productRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Product with id " + id + " not found"));
    }

    @Transactional
    public ProductResponse create(ProductRequest request) {
        Product product = new Product();
        applyRequest(product, request);
        Product saved = productRepository.save(product);
        return toResponse(saved);
    }

    @Transactional
    public ProductResponse update(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product with id " + id + " not found"));

        applyRequest(product, request);
        Product saved = productRepository.save(product);
        return toResponse(saved);
    }

    @Transactional
    public void delete(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product with id " + id + " not found");
        }
        productRepository.deleteById(id);
    }

    private void applyRequest(Product product, ProductRequest request) {
        product.setName(request.name().trim());
        product.setDescription(request.description());
        product.setPrice(request.price());
        product.setCurrency(request.currency().toUpperCase());
        product.setPreorder(request.preorder());
        product.setReleaseDate(request.releaseDate());
        product.setStockQuantity(request.stockQuantity());
        
        if (request.categoryId() != null) {
            Category category = categoryRepository.findById(request.categoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            product.setCategory(category);
        } else {
            product.setCategory(null);
        }

        if (request.subcategoryId() != null) {
            Subcategory subcategory = subcategoryRepository.findById(request.subcategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Subcategory not found"));
            product.setSubcategory(subcategory);
        } else {
            product.setSubcategory(null);
        }

        if (request.images() != null) {
            product.setImages(new java.util.ArrayList<>(request.images()));
        } else {
            product.setImages(new java.util.ArrayList<>());
        }
    }

    private ProductResponse toResponse(Product product) {
        ProductResponse.CategoryDto categoryDto = product.getCategory() != null 
            ? new ProductResponse.CategoryDto(product.getCategory().getId(), product.getCategory().getName()) 
            : null;
        
        ProductResponse.SubcategoryDto subcategoryDto = product.getSubcategory() != null 
            ? new ProductResponse.SubcategoryDto(product.getSubcategory().getId(), product.getSubcategory().getName()) 
            : null;

        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getCurrency(),
                product.isPreorder(),
                product.getReleaseDate(),
                product.getStockQuantity(),
                categoryDto,
                subcategoryDto,
                product.getImages(),
                product.getCreatedAt(),
                product.getUpdatedAt()
        );
    }
}
