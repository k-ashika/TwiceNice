package com.twicenice.twicenice_backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.twicenice.twicenice_backend.model.Product;
import com.twicenice.twicenice_backend.model.User;
import com.twicenice.twicenice_backend.model.WishlistItem;

public interface WishlistRepository extends JpaRepository<WishlistItem, Long> {
    List<WishlistItem> findByUser(User user);
    boolean existsByUserAndProduct(User user, Product product); // Add this line
    Optional<WishlistItem> findByUserAndProduct(User user, Product product);
    
}
