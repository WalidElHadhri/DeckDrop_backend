package com.deckdrop.backend.service;

import com.deckdrop.backend.dto.UserProfileUpdateRequest;
import com.deckdrop.backend.dto.UserResponse;
import com.deckdrop.backend.model.AppUser;
import com.deckdrop.backend.repository.AppUserRepository;
import java.util.List;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final AppUserRepository appUserRepository;

    public UserService(AppUserRepository appUserRepository) {
        this.appUserRepository = appUserRepository;
    }

    public AppUser getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return appUserRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Current user not found"));
    }

    public UserResponse getCurrentUserProfile() {
        return toResponse(getCurrentUser());
    }

    public UserResponse updateProfile(UserProfileUpdateRequest request) {
        AppUser user = getCurrentUser();
        if (request.firstName() != null) user.setFirstName(request.firstName());
        if (request.lastName() != null) user.setLastName(request.lastName());
        if (request.phoneNumber() != null) user.setPhoneNumber(request.phoneNumber());
        if (request.address() != null) user.setAddress(request.address());
        if (request.profilePicUrl() != null) user.setProfilePicUrl(request.profilePicUrl());
        
        AppUser updated = appUserRepository.save(user);
        return toResponse(updated);
    }

    public List<UserResponse> findAll() {
        return appUserRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private UserResponse toResponse(AppUser user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getPhoneNumber(),
                user.getAddress(),
                user.getProfilePicUrl(),
                user.getRole().name(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
}
