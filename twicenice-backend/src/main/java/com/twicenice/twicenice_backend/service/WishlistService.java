package com.twicenice.twicenice_backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.twicenice.twicenice_backend.model.Cart;
import com.twicenice.twicenice_backend.model.Product;
import com.twicenice.twicenice_backend.model.User;
import com.twicenice.twicenice_backend.model.WishlistItem;
import com.twicenice.twicenice_backend.repository.ProductRepository;
import com.twicenice.twicenice_backend.repository.WishlistRepository;

@Service
public class WishlistService {
    
    @Autowired
    private WishlistRepository wishlistRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private CartService cartService;
    
    public List<Product> getWishlist(User user) {
        return wishlistRepository.findByUser(user).stream()
            .map(WishlistItem::getProduct)
            .collect(Collectors.toList());
    }
    
    public void addToWishlist(User user, Long productId) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found"));
        
        if (!wishlistRepository.existsByUserAndProduct(user, product)) {
            WishlistItem item = new WishlistItem();
            item.setUser(user);
            item.setProduct(product);
            wishlistRepository.save(item);
        }
    }
    
    public void moveToCart(User user, Long productId) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found"));
        
        wishlistRepository.findByUserAndProduct(user, product).ifPresent(item -> {
            Cart cartItem = new Cart();
            cartItem.setUserId(user.getId()); 
            cartItem.setProductId(product.getId());
            cartItem.setQuantity(1);
            cartService.addToCart(cartItem);
            wishlistRepository.delete(item);
        });
    }
    
    public void removeFromWishlist(User user, Long productId) {
        productRepository.findById(productId).ifPresent(product -> 
            wishlistRepository.findByUserAndProduct(user, product)
                .ifPresent(wishlistRepository::delete)
        );
    }
}