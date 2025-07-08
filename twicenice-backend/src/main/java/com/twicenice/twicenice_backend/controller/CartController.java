package com.twicenice.twicenice_backend.controller;

import com.twicenice.twicenice_backend.model.Cart;
import com.twicenice.twicenice_backend.model.User;
import com.twicenice.twicenice_backend.repository.UserRepository;
import com.twicenice.twicenice_backend.service.CartService;import com.twicenice.twicenice_backend.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/cart") 
@CrossOrigin(origins = "*")
public class CartController {

    @Autowired
    private CartService cartService;
@Autowired
private UserRepository userRepository;
    @PostMapping("/add")
    public ResponseEntity<Cart> addToCart(@RequestBody Cart cart) {
        return ResponseEntity.ok(cartService.addToCart(cart));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Cart>> getUserCart(@PathVariable Long userId) {
        List<Cart> cartItems = cartService.getUserCart(userId);
        return ResponseEntity.ok(cartItems);
    }

    @DeleteMapping("/remove")
    public ResponseEntity<Void> removeFromCart(@RequestParam Long userId, @RequestParam Long productId) {
        cartService.removeFromCart(userId, productId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/clear/{userId}")
    public ResponseEntity<Void> clearCart(@PathVariable Long userId) {
        cartService.clearCart(userId);
        return ResponseEntity.noContent().build();
    }
    @PutMapping("/increment")
    public ResponseEntity<Void> incrementCartItem(@RequestParam Long userId, @RequestParam Long productId) {
        cartService.incrementQuantity(userId, productId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/decrement")
    public ResponseEntity<Void> decrementCartItem(@RequestParam Long userId, @RequestParam Long productId) {
        cartService.decreaseQuantityOrRemove(userId, productId);
        return ResponseEntity.noContent().build();
    }
    @PostMapping("/add/{productId}")
    public ResponseEntity<Cart> addToCart(@PathVariable Long productId, Authentication auth) {
        // Get user ID from JWT token
        String email = auth.getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        
        Cart cart = new Cart();
        cart.setUserId(user.getId());
        cart.setProductId(productId);
        cart.setQuantity(1); 

        return ResponseEntity.ok(cartService.addToCart(cart));
    }


}
