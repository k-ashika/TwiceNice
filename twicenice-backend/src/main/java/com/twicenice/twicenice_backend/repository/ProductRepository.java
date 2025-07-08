package com.twicenice.twicenice_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.twicenice.twicenice_backend.model.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategory(String category);
    @Modifying
    @Query("UPDATE Product p SET p.stock = p.stock + :quantity WHERE p.id = :productId")
    void increaseStock(@Param("productId") Long productId, @Param("quantity") int quantity);
    
    @Query("SELECT p.imageUrl FROM Product p WHERE p.id = :productId")
    String findImageUrlById(@Param("productId") Long productId);
}
