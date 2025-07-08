package com.twicenice.twicenice_backend.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.twicenice.twicenice_backend.model.Product;
import com.twicenice.twicenice_backend.repository.ProductRepository;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    private final String BASE_IMAGE_URL = "http://localhost:8080/api/products/images/";

    public Product addProduct(Product product) {
        
        if (product.getImageUrl() != null) {
            String[] parts = product.getImageUrl().split("/");
            product.setImageUrl(parts[parts.length - 1]);
        }
        return productRepository.save(product);
    }

    public String storeImage(MultipartFile file) throws IOException {
        String uploadDir = "uploads";
        try {
            Files.createDirectories(Paths.get(uploadDir));

            String filename = UUID.randomUUID() + "." +
                    getFileExtension(file.getOriginalFilename());
            Path destination = Paths.get(uploadDir, filename);
            Files.copy(file.getInputStream(), destination);

            return filename;
        } catch (IOException e) {
            throw new IOException("Failed to store file: " + file.getOriginalFilename(), e);
        }
    }

    private String getFileExtension(String filename) {
        if (filename == null) {
            return "";
        }
        int lastDot = filename.lastIndexOf(".");
        return lastDot == -1 ? "" : filename.substring(lastDot + 1);
    }

    
    public List<Product> getAllProducts() {
        List<Product> products = productRepository.findAll();
        products.forEach(this::enrichImageUrl);
        return products;
    }

    public List<Product> getProductsByCategory(String category) {
        List<Product> products = productRepository.findByCategory(category);
        products.forEach(this::enrichImageUrl);
        return products;
    }

    public Product getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        enrichImageUrl(product);
        return product;
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    public Product updateProduct(Long id, Product updatedProduct) {
        Product existing = productRepository.findById(id).orElseThrow();

        existing.setName(updatedProduct.getName());
        existing.setDescription(updatedProduct.getDescription());
        existing.setPrice(updatedProduct.getPrice());
        existing.setCategory(updatedProduct.getCategory());
        existing.setStock(updatedProduct.getStock());

        if (updatedProduct.getImageUrl() != null) {
            String[] parts = updatedProduct.getImageUrl().split("/");
            existing.setImageUrl(parts[parts.length - 1]);
        }

        return productRepository.save(existing);
    }

    
    private void enrichImageUrl(Product product) {
        if (product.getImageUrl() != null && !product.getImageUrl().startsWith("http")) {
            product.setImageUrl(BASE_IMAGE_URL + product.getImageUrl());
        }
    }
}
