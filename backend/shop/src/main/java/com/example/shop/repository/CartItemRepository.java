package com.example.shop.repository;

import com.example.shop.model.CartItem;
import com.example.shop.model.Cart;
import com.example.shop.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    // 根据购物车查找购物车项列表
    List<CartItem> findByCart(Cart cart);

    // 根据购物车和商品查找购物车项
    Optional<CartItem> findByCartAndProduct(Cart cart, Product product);
}