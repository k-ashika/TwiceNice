package com.twicenice.twicenice_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.twicenice.twicenice_backend.model.Admin;

import java.util.Optional;

public interface AdminRepository extends JpaRepository<Admin, Long> {
    Optional<Admin> findByEmail(String email);
}
