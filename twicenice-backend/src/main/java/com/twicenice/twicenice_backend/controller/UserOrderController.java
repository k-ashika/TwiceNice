package com.twicenice.twicenice_backend.controller;

import com.twicenice.twicenice_backend.dto.OrderRequest;
import com.twicenice.twicenice_backend.model.Order;
import com.twicenice.twicenice_backend.model.User;
import com.twicenice.twicenice_backend.repository.UserRepository;
import com.twicenice.twicenice_backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/user/orders")
@CrossOrigin(origins = "*")
public class UserOrderController {

    @Autowired
    private OrderService orderService;
    
    @Autowired
    private UserRepository userRepository;


    
    @PostMapping("/place")
    public ResponseEntity<Order> placeOrder(@RequestBody OrderRequest request) {
        Order order = orderService.placeOrder(request.getUserId());
        return ResponseEntity.ok(order);
    }

    
    @GetMapping("/{userId}")
    public ResponseEntity<List<Order>> getUserOrders(@PathVariable Long userId) {
        return ResponseEntity.ok(orderService.getUserOrders(userId));
    }
    @GetMapping("/details/{orderId}")
    public ResponseEntity<Order> getOrderDetails(
        @PathVariable Long orderId,
        @RequestHeader("Authorization") String token) {
        
        
        Order order = orderService.getOrderById(orderId);
        return ResponseEntity.ok(order);
    }
    @DeleteMapping("/{orderId}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long orderId) {
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        
        String userEmail = authentication.getName();
        User user = userRepository.findByEmail(userEmail)
                       .orElseThrow(() -> new RuntimeException("User not found"));

        
        Order order = orderService.getOrderById(orderId);
        if (order == null) {
            return ResponseEntity.notFound().build();
        }

        
        if (!order.getUserId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        orderService.deleteOrder(orderId);
        return ResponseEntity.noContent().build();
    }




}
