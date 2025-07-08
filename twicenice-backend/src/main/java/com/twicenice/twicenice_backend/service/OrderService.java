package com.twicenice.twicenice_backend.service;

import com.twicenice.twicenice_backend.model.*;
import com.twicenice.twicenice_backend.repository.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    public Order placeOrder(Long userId) {
        List<Cart> cartItems = cartRepository.findByUserId(userId);
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty!");
        }

        Order order = new Order();
        order.setUserId(userId);
        order.setStatus("PLACED");
        order.setCreatedAt(LocalDateTime.now());
        order.setReturnWindowEnd(LocalDateTime.now().plusDays(30)); 
        order.setReturnable(true); 
        List<OrderItem> orderItems = new ArrayList<>();
        double total = 0;

        for (Cart cart : cartItems) {
            Product product = productRepository.findById(cart.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            if (product.getStock() < cart.getQuantity()) {
                throw new RuntimeException("Product '" + product.getName() + "' is out of stock!");
            }

            product.setStock(product.getStock() - cart.getQuantity());
            productRepository.save(product);

            OrderItem item = new OrderItem();
            item.setProductId(product.getId());
            item.setProductName(product.getName());
            item.setImageUrl(product.getImageUrl());
            item.setQuantity(cart.getQuantity());
            item.setPrice(product.getPrice() * cart.getQuantity());
            item.setOrder(order);

            total += item.getPrice();
            orderItems.add(item);
        }

        order.setTotalPrice(total);
        order.setItems(orderItems);
        cartRepository.deleteAll(cartItems);

        return orderRepository.save(order);
    }


    public List<Order> getUserOrders(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
    }

    public Order updateOrderStatus(Long id, String newStatus) {
        Order order = getOrderById(id);
        order.setStatus(newStatus);
        return orderRepository.save(order);
    }
    public void deleteOrder(Long orderId) {
        orderRepository.deleteById(orderId);
    }
    public boolean hasUserPurchasedProduct(Long userId, Long productId) {
        return orderRepository.existsByUserIdAndItems_ProductId(userId, productId);
    }
    public boolean isOrderReturnable(Long orderId) {
        Order order = getOrderById(orderId);
        return order.isReturnable() && 
               LocalDateTime.now().isBefore(order.getReturnWindowEnd());
    }
    public Order createOrder(Long userId, double totalPrice, List<OrderItem> items) {
        Order order = new Order();
        order.setUserId(userId);
        order.setTotalPrice(totalPrice);
        order.setStatus("PLACED");
        order.setCreatedAt(LocalDateTime.now());
        order.setReturnWindowEnd(LocalDateTime.now().plusDays(30));
        order.setReturnable(true);
        order.setItems(items);
        
        
        return order;
    }
}
