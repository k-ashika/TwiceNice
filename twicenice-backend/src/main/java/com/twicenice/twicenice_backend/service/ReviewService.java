package com.twicenice.twicenice_backend.service;

import com.twicenice.twicenice_backend.dto.ReviewResponseDTO;
import com.twicenice.twicenice_backend.model.Product;
import com.twicenice.twicenice_backend.model.Review;
import com.twicenice.twicenice_backend.repository.ProductRepository;
import com.twicenice.twicenice_backend.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ProductRepository productRepo;

    @Autowired
    private OrderService orderService;

    public ReviewResponseDTO addReview(Long productId, Review review) {
        
        if (!orderService.hasUserPurchasedProduct(review.getUserId(), productId)) {
            throw new IllegalStateException("You must purchase this product before reviewing");
        }

        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
       
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        
        review.setUserName(username); 
        review.setProduct(product);
        
        Review savedReview = reviewRepository.save(review);
        
        ReviewResponseDTO response = new ReviewResponseDTO();
        response.setId(savedReview.getId());
        response.setRating(savedReview.getRating());
        response.setComment(savedReview.getComment());
        response.setUserName(savedReview.getUserName());
        response.setVerifiedPurchase(true);
        return response;
    }
    public List<Review> getReviewsForProduct(Long productId) {
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return reviewRepository.findByProduct(product);
    }
    public boolean canUserReviewProduct(Long userId, Long productId) {
        
        return orderService.hasUserPurchasedProduct(userId, productId);
    }
    public List<Review> getReviewsByProductId(Long productId) {
        return reviewRepository.findByProductId(productId);
    }
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    public void deleteReviewById(Long id) {
        reviewRepository.deleteById(id);
    }

}
