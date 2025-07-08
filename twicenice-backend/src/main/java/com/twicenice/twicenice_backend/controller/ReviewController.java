package com.twicenice.twicenice_backend.controller;

import com.twicenice.twicenice_backend.dto.ReviewResponseDTO;
import com.twicenice.twicenice_backend.model.Review;
import com.twicenice.twicenice_backend.repository.ReviewRepository;
import com.twicenice.twicenice_backend.service.CustomUserDetails;
import com.twicenice.twicenice_backend.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;
    private ReviewRepository ReviewRepository;
    
    
    @PostMapping("/product/{productId}")
    public ResponseEntity<?> addReview(
            @PathVariable Long productId, 
            @RequestBody Review review,
            Authentication authentication) {
        try {
           
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            review.setUserId(userDetails.getId()); 
            
            ReviewResponseDTO response = reviewService.addReview(productId, review);
            return ResponseEntity.ok(response);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    
    }

    @GetMapping("/can-review/{productId}")
    public ResponseEntity<Boolean> canUserReviewProduct(
            @PathVariable Long productId,
            @RequestParam Long userId) {
        return ResponseEntity.ok(reviewService.canUserReviewProduct(userId, productId));
    }
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Review>> getReviewsByProduct(@PathVariable Long productId) {
        List<Review> reviews = reviewService.getReviewsByProductId(productId);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Review>> getAllReviews() {
        List<Review> reviews = reviewService.getAllReviews();
        return ResponseEntity.ok(reviews);
    }

 
    @DeleteMapping("/admin/delete/{reviewId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteReview(@PathVariable Long reviewId) {
        reviewService.deleteReviewById(reviewId);
        return ResponseEntity.ok(Collections.singletonMap("message", "Review deleted successfully."));
    }

    


}

