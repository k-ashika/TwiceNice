package com.twicenice.twicenice_backend.repository;

import com.twicenice.twicenice_backend.model.Review;
import com.twicenice.twicenice_backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProduct(Product product);
    List<Review> findByProductId(Long productId);
    List<Review> findTop5ByOrderByIdDesc();
}
