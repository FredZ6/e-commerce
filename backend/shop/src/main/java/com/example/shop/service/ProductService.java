package com.example.shop.service;

import com.example.shop.model.Product;
import com.example.shop.repository.ProductRepository;
import com.example.shop.exception.ResourceNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    @Autowired
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // 
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // ID
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
    }

    // 
    public Product addProduct(Product product) {
        return productRepository.save(product);
    }

    // 
    public Product updateProduct(Long id, Product productDetails) {
        Product existingProduct = getProductById(id);
        
        // null
        if (productDetails.getName() != null) {
            existingProduct.setName(productDetails.getName());
        }
        if (productDetails.getDescription() != null) {
            existingProduct.setDescription(productDetails.getDescription());
        }
        if (productDetails.getPrice() != null) {
            existingProduct.setPrice(productDetails.getPrice());
        }
        if (productDetails.getImageUrl() != null) {
            existingProduct.setImageUrl(productDetails.getImageUrl());
        }

        return productRepository.save(existingProduct);
    }

    // 
    public void deleteProduct(Long id) {
        Product product = getProductById(id);
        productRepository.delete(product);
    }
}