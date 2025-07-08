package com.twicenice.twicenice_backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.twicenice.twicenice_backend.model.Cart;

public interface CartRepository extends JpaRepository<Cart, Long> {
    List<Cart> findByUserId(Long userId);
   void deleteByUserIdAndProductId(Long userId, Long productId);
   Optional<Cart> findByUserIdAndProductId(Long userId, Long productId);
   void deleteByUserId(Long userId);
}
