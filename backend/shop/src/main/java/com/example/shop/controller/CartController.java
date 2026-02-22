package com.example.shop.controller;

import com.example.shop.model.CartItem;
import com.example.shop.model.User;
import com.example.shop.service.CartService;
import com.example.shop.service.UserService;
import com.example.shop.util.JwtTokenUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;
    private final UserService userService;
    private final JwtTokenUtil jwtTokenUtil;

    @Autowired
    public CartController(CartService cartService,
                          UserService userService,
                          JwtTokenUtil jwtTokenUtil) {
        this.cartService = cartService;
        this.userService = userService;
        this.jwtTokenUtil = jwtTokenUtil;
    }

    // 获取购物车中的商品
    @GetMapping
    public ResponseEntity<List<CartItem>> getCartItems(@RequestHeader("Authorization") String token) {
        User user = getUserFromToken(token);
        List<CartItem> cartItems = cartService.getCartItems(cartService.getCartByUser(user));
        return ResponseEntity.ok(cartItems);
    }

    // 添加商品到购物车
    @PostMapping
    public ResponseEntity<CartItem> addCartItem(
            @RequestHeader("Authorization") String token,
            @RequestParam Long productId,
            @RequestParam Integer quantity) {
        User user = getUserFromToken(token);
        CartItem cartItem = cartService.addCartItem(user, productId, quantity);
        return ResponseEntity.ok(cartItem);
    }

    // 更新购物车项
    @PutMapping("/{cartItemId}")
    public ResponseEntity<?> updateCartItemQuantity(
            @RequestHeader("Authorization") String token,
            @PathVariable Long cartItemId,
            @RequestParam Integer quantity) {
        try {
            User user = getUserFromToken(token);
            CartItem updatedItem = cartService.updateCartItemQuantity(user, cartItemId, quantity);
            return ResponseEntity.ok(updatedItem);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 删除购物车项
    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<?> deleteCartItem(
            @RequestHeader("Authorization") String token,
            @PathVariable Long cartItemId) {
        User user = getUserFromToken(token);
        cartService.deleteCartItem(user, cartItemId);
        return ResponseEntity.ok("Cart item deleted successfully");
    }

    // 清空购物车
    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart(@RequestHeader("Authorization") String token) {
        User user = getUserFromToken(token);
        cartService.clearCart(user);
        return ResponseEntity.ok("Cart cleared successfully");
    }

    // 从令牌中获取用户信息
    private User getUserFromToken(String token) {
        String username = jwtTokenUtil.getUsernameFromToken(token.substring(7));
        return userService.findByUsername(username);
    }
}