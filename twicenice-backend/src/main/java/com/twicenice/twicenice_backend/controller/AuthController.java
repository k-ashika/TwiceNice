package com.twicenice.twicenice_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.twicenice.twicenice_backend.dto.LoginRequest;
import com.twicenice.twicenice_backend.jwt.JwtService;
import com.twicenice.twicenice_backend.model.User;
import com.twicenice.twicenice_backend.repository.UserRepository;
import com.twicenice.twicenice_backend.service.CustomUserDetails;
import com.twicenice.twicenice_backend.service.UserService;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true") 
@RestController
@RequestMapping("/api/auth") 
public class AuthController {

    @Autowired
    private UserService userService;
    
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtService jwtService;

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        if (user.getRole() == null || user.getRole().isBlank()) {
            user.setRole("ROLE_USER");
        }
        return userService.registerUser(user);
    }

    @PostMapping("/register-admin")
    public ResponseEntity<User> registerAdmin(@RequestBody User user) {
        user.setRole("ROLE_ADMIN");
        return ResponseEntity.ok(userService.registerUser(user));
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest request) {
        Optional<User> optionalUser = userService.getUserByEmail(request.getEmail());

        if (optionalUser.isEmpty() || !passwordEncoder.matches(request.getPassword(), optionalUser.get().getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }

        User user = optionalUser.get();
        CustomUserDetails userDetails = new CustomUserDetails(user);
        String token = jwtService.generateToken(userDetails);

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("id", user.getId());
        response.put("email", user.getEmail());
        response.put("role", user.getRole());

        return ResponseEntity.ok(response);
    }
}
