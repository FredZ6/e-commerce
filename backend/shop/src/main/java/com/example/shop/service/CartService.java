package com.example.shop.service;

import com.example.shop.model.*;
import com.example.shop.repository.*;

import com.example.shop.exception.ResourceNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;
import java.util.List;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@Transactional
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductService productService;

    @Autowired
    public CartService(CartRepository cartRepository,
                       CartItemRepository cartItemRepository,
                       ProductService productService) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productService = productService;
    }

    // 
    public Cart getCartByUser(User user) {
        return cartRepository.findByUser(user)
                .orElseGet(() -> {
                    // 
                    Cart cart = new Cart();
                    cart.setUser(user);
                    return cartRepository.save(cart);
                });
    }

    // 
    public List<CartItem> getCartItems(Cart cart) {
        return cartItemRepository.findByCart(cart);
    }

    // 
    public CartItem addCartItem(User user, Long productId, Integer quantity) {
        Cart cart = getCartByUser(user);
        Product product = productService.getProductById(productId);
        
        // cartItemRepository
        CartItem existingItem = cartItemRepository.findByCartAndProduct(cart, product)
            .orElse(null);
        
        if (existingItem != null) {
            // 
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
            return cartItemRepository.save(existingItem);
        } else {
            // 
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(quantity);
            return cartItemRepository.save(newItem);
        }
    }

    // 
    @Transactional
    public CartItem updateCartItemQuantity(User user, Long cartItemId, Integer quantity) {
        // 
        if (quantity <= 0) {
            throw new RuntimeException("Quantity must be greater than 0");
        }

        // 
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        // 
        if (!cartItem.getCart().getUser().getId().equals(user.getId())) {
            log.warn("Unauthorized access attempt: User {} trying to update cart item {} belonging to user {}", 
                user.getId(), cartItemId, cartItem.getCart().getUser().getId());
            throw new RuntimeException("Unauthorized access");
        }

        // 
        cartItem.setQuantity(quantity);
        return cartItemRepository.save(cartItem);
    }

    // 
    public void deleteCartItem(User user, Long cartItemId) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("CartItem not found"));

        // 
        if (!cartItem.getCart().getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access");
        }

        cartItemRepository.delete(cartItem);
    }

    // 
    public void clearCart(User user) {
        Cart cart = getCartByUser(user);
        List<CartItem> cartItems = cartItemRepository.findByCart(cart);
        cartItemRepository.deleteAll(cartItems);
    }
}