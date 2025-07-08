package com.twicenice.twicenice_backend.service;

import com.twicenice.twicenice_backend.model.Cart;
import com.twicenice.twicenice_backend.repository.CartRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    
    
    
    public Cart addToCart(Cart cart) {
        
        Optional<Cart> existing = cartRepository.findByUserIdAndProductId(cart.getUserId(), cart.getProductId());

        if (existing.isPresent()) {
            Cart existingCart = existing.get();
            existingCart.setQuantity(existingCart.getQuantity() + cart.getQuantity());
            return cartRepository.save(existingCart);
        }

        return cartRepository.save(cart);
    }

    public List<Cart> getUserCart(Long userId) {
        System.out.println("CartService: Fetching cart for user " + userId);
        return cartRepository.findByUserId(userId);
    }

    @Transactional
    public void removeFromCart(Long userId, Long productId) {
        cartRepository.deleteByUserIdAndProductId(userId, productId);
    }

    @Transactional
    public void clearCart(Long userId) {
        List<Cart> userCart = cartRepository.findByUserId(userId);
        cartRepository.deleteAll(userCart);
    }
    @Transactional
    public void decreaseQuantityOrRemove(Long userId, Long productId) {
        cartRepository.findByUserIdAndProductId(userId, productId).ifPresent(cart -> {
            if (cart.getQuantity() > 1) {
                cart.setQuantity(cart.getQuantity() - 1);
                cartRepository.save(cart);
            } else {
                cartRepository.delete(cart);
            }
        });
    }

    @Transactional
    public void incrementQuantity(Long userId, Long productId) {
        cartRepository.findByUserIdAndProductId(userId, productId).ifPresent(cart -> {
            cart.setQuantity(cart.getQuantity() + 1);
            cartRepository.save(cart);
        });
    }


}
