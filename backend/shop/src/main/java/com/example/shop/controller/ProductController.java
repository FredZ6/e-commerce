package com.example.shop.controller;

import com.example.shop.model.Product;
import com.example.shop.service.ProductService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    //  - 
    @GetMapping
    @PreAuthorize("permitAll()")  // 
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    //  - 
    @GetMapping("/{id}")
    @PreAuthorize("permitAll()")  // 
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Product product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }

    //  - 
    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")  // hasRolehasAuthority
    public ResponseEntity<Product> addProduct(@Valid @RequestBody Product product) {
        Product newProduct = productService.addProduct(product);
        return ResponseEntity.ok(newProduct);
    }

    //  - 
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")  // 
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @Valid @RequestBody Product productDetails) {
        Product updatedProduct = productService.updateProduct(id, productDetails);
        return ResponseEntity.ok(updatedProduct);
    }

    //  - 
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")  // 
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok("Product deleted successfully");
    }
}