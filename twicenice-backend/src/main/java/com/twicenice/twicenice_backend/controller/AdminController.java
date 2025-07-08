//package com.twicenice.twicenice_backend.controller;
//
//import com.twicenice.twicenice_backend.model.Admin;
//import com.twicenice.twicenice_backend.service.AdminService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.web.bind.annotation.*;
//
//import java.security.Principal;
//import java.util.Optional;
//
//@RestController
//@RequestMapping("/api/admin")
//@PreAuthorize("hasRole('ADMIN')")
//public class AdminController {
//
//    @Autowired
//    private AdminService adminService;
//
//    @GetMapping("/profile")
//    public Admin getProfile(Principal principal) {
//        return adminService.getAdminByEmail(principal.getName())
//            .orElseThrow(() -> new RuntimeException("Admin not found"));
//    }
//
//    @PutMapping("/profile")
//    public Admin updateProfile(@RequestBody Admin updatedAdmin) {
//        return adminService.updateAdmin(updatedAdmin);
//    }
//
//    @GetMapping("/dashboard")
//    public String adminDashboard() {
//        return "Welcome to Admin Dashboard!";
//    }
//}



package com.twicenice.twicenice_backend.controller;

import com.twicenice.twicenice_backend.model.Admin;
import com.twicenice.twicenice_backend.model.User;
import com.twicenice.twicenice_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

import org.springframework.security.crypto.password.PasswordEncoder; // ✅ Import

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; 

    @GetMapping("/profile")
    public Admin getProfile(Principal principal) {
        return userRepository.findByEmail(principal.getName())
                .filter(user -> "ROLE_ADMIN".equals(user.getRole()))
                .map(user -> new Admin(user.getId(), user.getName(), user.getEmail(), user.getPassword()))
                .orElseThrow(() -> new RuntimeException("Admin not found or not authorized"));
    }

    @PutMapping("/profile")
    public Admin updateProfile(@RequestBody Admin updatedAdmin) {
        return userRepository.findById(updatedAdmin.getId())
                .filter(user -> "ROLE_ADMIN".equals(user.getRole()))
                .map(user -> {
                    user.setName(updatedAdmin.getName());
                    user.setEmail(updatedAdmin.getEmail());

                    
                    String hashedPassword = passwordEncoder.encode(updatedAdmin.getPassword());
                    user.setPassword(hashedPassword);

                    return userRepository.save(user);
                })
                .map(user -> new Admin(user.getId(), user.getName(), user.getEmail(), user.getPassword()))
                .orElseThrow(() -> new RuntimeException("Admin not found or not authorized"));
    }

    @GetMapping("/dashboard")
    public String adminDashboard() {
        return "Welcome to Admin Dashboard!";
    }
}
