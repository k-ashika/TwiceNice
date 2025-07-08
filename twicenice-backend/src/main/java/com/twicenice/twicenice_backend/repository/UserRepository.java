package com.twicenice.twicenice_backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.twicenice.twicenice_backend.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
	Optional<User> findByName(String name);
	Optional<User> findByEmail(String email);

}
