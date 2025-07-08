package com.twicenice.twicenice_backend.controller;

import com.twicenice.twicenice_backend.model.Product;
import com.twicenice.twicenice_backend.model.User;
import com.twicenice.twicenice_backend.repository.ProductRepository;
import com.twicenice.twicenice_backend.repository.UserRepository;
import com.twicenice.twicenice_backend.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @GetMapping("/products")
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    
    @GetMapping("/profile/{id}")
    public ResponseEntity<User> getUserProfile(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/profile/{id}")
    public ResponseEntity<User> updateProfile(@PathVariable Long id, @RequestBody User updatedUser) {
        return userRepository.findById(id).map(existingUser -> {
            existingUser.setName(updatedUser.getName());
            existingUser.setAddress(updatedUser.getAddress());

            if (updatedUser.getPassword() != null && !updatedUser.getPassword().isBlank()) {
                existingUser.setPassword(updatedUser.getPassword()); 
            }

            
            return ResponseEntity.ok(userService.updateUserProfile(existingUser));
        }).orElse(ResponseEntity.notFound().build());
    }
    @GetMapping("/products/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

}



