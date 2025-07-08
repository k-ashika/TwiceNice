package com.twicenice.twicenice_backend.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.twicenice.twicenice_backend.model.User;
import com.twicenice.twicenice_backend.repository.UserRepository;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public Optional<User> loginUser(String email, String password) {
        Optional<User> user = userRepository.findByEmail(email);
        return user.filter(u -> passwordEncoder.matches(password, u.getPassword()));
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    public User updateUserProfile(User user) {
        if (user.getPassword() != null && !user.getPassword().isBlank()) {
            if (!user.getPassword().startsWith("$2a$")) { 
                user.setPassword(passwordEncoder.encode(user.getPassword()));
            }
        }
        return userRepository.save(user);
    }
    public boolean isSameUser(String email, Long userId) {
        return userRepository.findByEmail(email)
            .map(user -> user.getId().equals(userId))
            .orElse(false);
    }
    public Long getUserIdByEmail(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"))
            .getId();
    }
}
