package com.twicenice.twicenice_backend.controller;

import com.twicenice.twicenice_backend.model.User;
import com.twicenice.twicenice_backend.repository.UserRepository;
import com.twicenice.twicenice_backend.service.AdminService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin(origins = "*")
public class AdminUserController {

    @Autowired
    private UserRepository userRepository;
    private AdminService adminService;
    
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
//    @DeleteMapping("/{id}")
//    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
//        try {
//            userRepository.deleteById(id); 
//            return ResponseEntity.ok("User deleted successfully");
//        } catch (Exception e) {
//        	e.printStackTrace(); 
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting user");
//        }
//    }
}
