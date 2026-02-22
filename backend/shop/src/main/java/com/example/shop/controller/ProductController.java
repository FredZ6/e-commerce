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

    // 公开接口 - 获取所有商品
    @GetMapping
    @PreAuthorize("permitAll()")  // 允许所有人访问
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    // 公开接口 - 获取单个商品
    @GetMapping("/{id}")
    @PreAuthorize("permitAll()")  // 允许所有人访问
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Product product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }

    // 管理员接口 - 添加商品
    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")  // 确保这里是hasRole而不是hasAuthority
    public ResponseEntity<Product> addProduct(@Valid @RequestBody Product product) {
        Product newProduct = productService.addProduct(product);
        return ResponseEntity.ok(newProduct);
    }

    // 管理员接口 - 更新商品
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")  // 仅管理员可访问
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @Valid @RequestBody Product productDetails) {
        Product updatedProduct = productService.updateProduct(id, productDetails);
        return ResponseEntity.ok(updatedProduct);
    }

    // 管理员接口 - 删除商品
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")  // 仅管理员可访问
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok("Product deleted successfully");
    }
}