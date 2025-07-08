package com.twicenice.twicenice_backend.controller;

import com.twicenice.twicenice_backend.model.Order;
import com.twicenice.twicenice_backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/orders")
@CrossOrigin(origins = "*")
public class AdminOrderController {

    @Autowired
    private OrderService orderService;

   
    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    
    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long orderId) {
        return ResponseEntity.ok(orderService.getOrderById(orderId));
    }

    
    @PutMapping("/{orderId}")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestBody String newStatus
    ) {
        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, newStatus));
    }
}
