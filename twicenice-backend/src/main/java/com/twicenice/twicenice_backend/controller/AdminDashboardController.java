package com.twicenice.twicenice_backend.controller;

import com.twicenice.twicenice_backend.model.Order;
import com.twicenice.twicenice_backend.model.Review;
import com.twicenice.twicenice_backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminDashboardController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private ReviewRepository reviewRepository;


//    @GetMapping("/summary")
//    public Map<String, Object> getSummary() {
//        Map<String, Object> map = new HashMap<>();
//        map.put("totalUsers", userRepository.count());
//        map.put("totalProducts", productRepository.count());
//        map.put("totalOrders", orderRepository.count());
//        map.put("totalRevenue", orderRepository.findAll().stream().mapToDouble(Order::getTotalPrice).sum());
//       
//        
//        List<Order> recentOrders = orderRepository
//                .findTop5ByOrderByCreatedAtDesc();
//
//        
//        List<Map<String, Object>> orderSummaries = new ArrayList<>();
//        for (Order order : recentOrders) {
//            Map<String, Object> o = new HashMap<>();
//            o.put("id", order.getId());
//            o.put("userId", order.getUserId());
//            o.put("createdAt", order.getCreatedAt());
//            o.put("totalPrice", order.getTotalPrice());
//            o.put("status", order.getStatus());
//            orderSummaries.add(o);
//        }
//
//        map.put("recentOrders", orderSummaries);
//        
//        List<Review> recentReviews = reviewRepository.findTop5ByOrderByIdDesc();
//        List<Map<String, Object>> reviewSummaries = new ArrayList<>();
//        for (Review review : recentReviews) {
//            Map<String, Object> r = new HashMap<>();
//            r.put("id", review.getId());
//            r.put("userId", review.getUserId());
//            r.put("productId", review.getProduct() != null ? review.getProduct().getId() : null);
//
//            r.put("rating", review.getRating());
//            r.put("comment", review.getComment());
//            reviewSummaries.add(r);
//        }
//        map.put("recentReviews", reviewSummaries);
//
//        return map;
//    }
    @GetMapping("/summary")
    public Map<String, Object> getSummary() {
        Map<String, Object> map = new HashMap<>();
        map.put("totalUsers", userRepository.count());
        map.put("totalProducts", productRepository.count());
        map.put("totalOrders", orderRepository.count());
        map.put("totalRevenue", orderRepository.findAll().stream().mapToDouble(Order::getTotalPrice).sum());

        // NEW: Count each order status
        Map<String, Long> statusCounts = new HashMap<>();
        statusCounts.put("PLACED", orderRepository.countByStatusIgnoreCase("PLACED"));
        statusCounts.put("PAID", orderRepository.countByStatusIgnoreCase("PAID"));
        statusCounts.put("CANCELLED", orderRepository.countByStatusIgnoreCase("CANCELLED"));
        map.put("orderStatusCounts", statusCounts);

        // Recent orders
        List<Order> recentOrders = orderRepository.findTop5ByOrderByCreatedAtDesc();
        List<Map<String, Object>> orderSummaries = new ArrayList<>();
        for (Order order : recentOrders) {
            Map<String, Object> o = new HashMap<>();
            o.put("id", order.getId());
            o.put("userId", order.getUserId());
            o.put("createdAt", order.getCreatedAt());
            o.put("totalPrice", order.getTotalPrice());
            o.put("status", order.getStatus());
            orderSummaries.add(o);
        }
        map.put("recentOrders", orderSummaries);

       
        List<Review> recentReviews = reviewRepository.findTop5ByOrderByIdDesc();
        List<Map<String, Object>> reviewSummaries = new ArrayList<>();
        for (Review review : recentReviews) {
            Map<String, Object> r = new HashMap<>();
            r.put("id", review.getId());
            r.put("userId", review.getUserId());
            r.put("productId", review.getProduct() != null ? review.getProduct().getId() : null);
            r.put("rating", review.getRating());
            r.put("comment", review.getComment());
            reviewSummaries.add(r);
        }
        map.put("recentReviews", reviewSummaries);

        return map;
    }

}
