package com.twicenice.twicenice_backend.service;

import com.twicenice.twicenice_backend.model.Admin;
import com.twicenice.twicenice_backend.repository.AdminRepository;
import com.twicenice.twicenice_backend.repository.CartRepository;
import com.twicenice.twicenice_backend.repository.OrderRepository;
import com.twicenice.twicenice_backend.repository.UserRepository;
import com.twicenice.twicenice_backend.repository.WishlistRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class AdminService {
	
    private final AdminRepository adminRepository;
  
    public AdminService(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    public Optional<Admin> getAdminByEmail(String email) {
        return adminRepository.findByEmail(email);
    }

    public Admin updateAdmin(Admin admin) {
        return adminRepository.save(admin);
    }
    
}
