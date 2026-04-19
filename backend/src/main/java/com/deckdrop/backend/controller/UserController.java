package com.deckdrop.backend.controller;

import com.deckdrop.backend.dto.UserProfileUpdateRequest;
import com.deckdrop.backend.dto.UserResponse;
import com.deckdrop.backend.service.UserService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public UserResponse getCurrentUser() {
        return userService.getCurrentUserProfile();
    }

    @PutMapping("/me")
    public UserResponse updateProfile(@RequestBody UserProfileUpdateRequest request) {
        return userService.updateProfile(request);
    }

    @GetMapping
    public List<UserResponse> findAll() {
        return userService.findAll();
    }
}
