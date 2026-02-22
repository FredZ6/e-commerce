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

    // 获取用户的购物车
    public Cart getCartByUser(User user) {
        return cartRepository.findByUser(user)
                .orElseGet(() -> {
                    // 如果用户没有购物车，创建一个新的
                    Cart cart = new Cart();
                    cart.setUser(user);
                    return cartRepository.save(cart);
                });
    }

    // 获取购物车中的所有购物车项
    public List<CartItem> getCartItems(Cart cart) {
        return cartItemRepository.findByCart(cart);
    }

    // 添加商品到购物车
    public CartItem addCartItem(User user, Long productId, Integer quantity) {
        if (quantity == null || quantity <= 0) {
            throw new RuntimeException("Quantity must be greater than 0");
        }

        Cart cart = getCartByUser(user);
        Product product = productService.getProductById(productId);
        
        // 直接使用cartItemRepository查找已存在的商品
        CartItem existingItem = cartItemRepository.findByCartAndProduct(cart, product)
            .orElse(null);
        
        if (existingItem != null) {
            // 如果已存在，更新数量
            int newQuantity = existingItem.getQuantity() + quantity;
            if (product.getStock() != null && newQuantity > product.getStock()) {
                throw new RuntimeException("Insufficient stock: " + product.getName());
            }
            existingItem.setQuantity(newQuantity);
            return cartItemRepository.save(existingItem);
        } else {
            // 如果不存在，创建新的购物车项
            if (product.getStock() != null && quantity > product.getStock()) {
                throw new RuntimeException("Insufficient stock: " + product.getName());
            }
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(quantity);
            return cartItemRepository.save(newItem);
        }
    }

    // 更新购物车项的数量
    @Transactional
    public CartItem updateCartItemQuantity(User user, Long cartItemId, Integer quantity) {
        // 验证数量是否合法
        if (quantity <= 0) {
            throw new RuntimeException("Quantity must be greater than 0");
        }

        // 获取购物车项
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        // 验证购物车项是否属于当前用户
        if (!cartItem.getCart().getUser().getId().equals(user.getId())) {
            log.warn("Unauthorized access attempt: User {} trying to update cart item {} belonging to user {}", 
                user.getId(), cartItemId, cartItem.getCart().getUser().getId());
            throw new RuntimeException("Unauthorized access");
        }

        // 更新数量
        Product product = cartItem.getProduct();
        if (product.getStock() != null && quantity > product.getStock()) {
            throw new RuntimeException("Insufficient stock: " + product.getName());
        }
        cartItem.setQuantity(quantity);
        return cartItemRepository.save(cartItem);
    }

    // 删除购物车项
    public void deleteCartItem(User user, Long cartItemId) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("CartItem not found"));

        // 验证购物车项属于当前用户
        if (!cartItem.getCart().getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access");
        }

        cartItemRepository.delete(cartItem);
    }

    // 清空购物车
    public void clearCart(User user) {
        Cart cart = getCartByUser(user);
        List<CartItem> cartItems = cartItemRepository.findByCart(cart);
        cartItemRepository.deleteAll(cartItems);
    }
}
