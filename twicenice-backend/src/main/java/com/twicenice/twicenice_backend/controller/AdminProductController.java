package com.twicenice.twicenice_backend.controller;

import com.twicenice.twicenice_backend.model.Product;
import com.twicenice.twicenice_backend.service.FileStorageService;
import com.twicenice.twicenice_backend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/admin/products")
@CrossOrigin(origins = "*")
public class AdminProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private FileStorageService fileStorageService;

    @PostMapping(value = "/add", consumes = "multipart/form-data")
    public ResponseEntity<Product> addProduct(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("price") double price,
            @RequestParam("category") String category,
            @RequestParam("image") MultipartFile file,
            @RequestParam("stock") int stock
    ) throws IOException {
    	String imageUrl = fileStorageService.storeFile(file);
        
    	Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        product.setCategory(category);
        product.setStock(stock);
        product.setImageUrl(imageUrl);

        return ResponseEntity.ok(productService.addProduct(product));
    }

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(productService.getProductsByCategory(category));
    }

    @PutMapping(value = "/edit/{id}", consumes = "multipart/form-data")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("price") double price,
            @RequestParam("category") String category,
            @RequestParam("stock") int stock,
            @RequestParam(value = "image", required = false) MultipartFile file
    ) throws IOException {

        Product existing = productService.getProductById(id); 

        String imageUrl = existing.getImageUrl(); 

        if (file != null && !file.isEmpty()) {
            imageUrl = fileStorageService.storeFile(file); 
        }

        Product updated = new Product();
        updated.setName(name);
        updated.setDescription(description);
        updated.setPrice(price);
        updated.setCategory(category);
        updated.setStock(stock);
        updated.setImageUrl(imageUrl); 

        return ResponseEntity.ok(productService.updateProduct(id, updated));
    }



    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
