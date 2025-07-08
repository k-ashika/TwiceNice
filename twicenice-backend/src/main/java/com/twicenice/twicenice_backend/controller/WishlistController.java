//package com.twicenice.twicenice_backend.controller;
//
//import java.util.List;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.core.Authentication;
//import org.springframework.web.bind.annotation.DeleteMapping;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import com.twicenice.twicenice_backend.model.User;
//import com.twicenice.twicenice_backend.service.UserService;
//import com.twicenice.twicenice_backend.service.WishlistService;
//import com.twicenice.twicenice_backend.model.Product;
//@RestController
//@RequestMapping("/api/wishlist")
//public class WishlistController {
//    
//    @Autowired
//    private WishlistService wishlistService;
//    @Autowired
//    private UserService userService;
//
//    @GetMapping
//    public ResponseEntity<List<Product>> getWishlist(Authentication authentication) {
//        User user = (User) authentication.getPrincipal();
//        return ResponseEntity.ok(wishlistService.getWishlist(user));
//    }
//    
//    @PostMapping("/add/{productId}")
//    public ResponseEntity<?> addToWishlist(@PathVariable Long productId, Authentication authentication) {
//        User user = (User) authentication.getPrincipal();
//        wishlistService.addToWishlist(user, productId);
//        return ResponseEntity.ok().build();
//    }
//    
//    @PostMapping("/move-to-cart/{productId}")
//    public ResponseEntity<?> moveToCart(@PathVariable Long productId, Authentication authentication) {
//        User user = (User) authentication.getPrincipal();
//        wishlistService.moveToCart(user, productId);
//        return ResponseEntity.ok().build();
//    }
//    
//    @DeleteMapping("/remove/{productId}")
//    public ResponseEntity<?> removeFromWishlist(@PathVariable Long productId, Authentication authentication) {
//        User user = (User) authentication.getPrincipal();
//        wishlistService.removeFromWishlist(user, productId);
//        return ResponseEntity.ok().build();
//    }
//}



package com.twicenice.twicenice_backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.twicenice.twicenice_backend.model.User;
import com.twicenice.twicenice_backend.model.Product;
import com.twicenice.twicenice_backend.service.UserService;
import com.twicenice.twicenice_backend.service.WishlistService;
import com.twicenice.twicenice_backend.service.CustomUserDetails;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<Product>> getWishlist(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();
        return ResponseEntity.ok(wishlistService.getWishlist(user));
    }

    @PostMapping("/add/{productId}")
    public ResponseEntity<?> addToWishlist(@PathVariable Long productId, Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();
        wishlistService.addToWishlist(user, productId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/move-to-cart/{productId}")
    public ResponseEntity<?> moveToCart(@PathVariable Long productId, Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();
        wishlistService.moveToCart(user, productId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<?> removeFromWishlist(@PathVariable Long productId, Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();
        wishlistService.removeFromWishlist(user, productId);
        return ResponseEntity.ok().build();
    }
}
