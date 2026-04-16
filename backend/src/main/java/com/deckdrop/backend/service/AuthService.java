package com.deckdrop.backend.service;

import com.deckdrop.backend.dto.AuthLoginRequest;
import com.deckdrop.backend.dto.AuthRegisterRequest;
import com.deckdrop.backend.dto.AuthResponse;
import com.deckdrop.backend.exception.ConflictException;
import com.deckdrop.backend.model.AppUser;
import com.deckdrop.backend.model.Role;
import com.deckdrop.backend.repository.AppUserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService customUserDetailsService;
    private final JwtService jwtService;

    public AuthService(AppUserRepository appUserRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       CustomUserDetailsService customUserDetailsService,
                       JwtService jwtService) {
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.customUserDetailsService = customUserDetailsService;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse register(AuthRegisterRequest request) {
        String email = request.email().trim().toLowerCase();

        if (appUserRepository.existsByEmail(email)) {
            throw new ConflictException("Email already registered");
        }

        AppUser user = new AppUser();
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setRole(appUserRepository.count() == 0 ? Role.ADMIN : Role.USER);
        appUserRepository.save(user);

        UserDetails userDetails = customUserDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtService.generateToken(userDetails);

        return new AuthResponse(token, "Bearer", user.getEmail(), user.getRole().name());
    }

    public AuthResponse login(AuthLoginRequest request) {
        String email = request.email().trim().toLowerCase();

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.password())
        );

        UserDetails userDetails = customUserDetailsService.loadUserByUsername(email);
        String token = jwtService.generateToken(userDetails);

        String role = appUserRepository.findByEmail(email)
                .map(user -> user.getRole().name())
                .orElse("USER");

        return new AuthResponse(token, "Bearer", email, role);
    }
}
