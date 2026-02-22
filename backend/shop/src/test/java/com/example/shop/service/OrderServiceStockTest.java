package com.example.shop.service;

import com.example.shop.model.Cart;
import com.example.shop.model.CartItem;
import com.example.shop.model.Product;
import com.example.shop.model.User;
import com.example.shop.repository.CartItemRepository;
import com.example.shop.repository.CartRepository;
import com.example.shop.repository.ProductRepository;
import com.example.shop.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@Transactional
class OrderServiceStockTest {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setUsername("stock_user_" + System.nanoTime());
        user.setEmail(user.getUsername() + "@example.com");
        user.setPassword(passwordEncoder.encode("User123@"));
        user.setRole("USER");
        user = userRepository.save(user);

        Product product = new Product();
        product.setName("Limited Product");
        product.setDescription("Limited stock");
        product.setPrice(new BigDecimal("99.99"));
        product.setImageUrl("https://img/limited");
        product.setStock(1);
        product.setDetails("Only one left");
        product = productRepository.save(product);

        Cart cart = new Cart();
        cart.setUser(user);
        cart = cartRepository.save(cart);

        CartItem cartItem = new CartItem();
        cartItem.setCart(cart);
        cartItem.setProduct(product);
        cartItem.setQuantity(2);
        cartItemRepository.save(cartItem);
    }

    @Test
    void createOrder_shouldFailWhenStockInsufficient() {
        RuntimeException exception = assertThrows(RuntimeException.class, () -> orderService.createOrder(user));
        assertTrue(exception.getMessage().contains("Insufficient stock"));
    }
}
