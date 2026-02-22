package com.example.shop.integration;

import com.example.shop.model.Cart;
import com.example.shop.model.CartItem;
import com.example.shop.model.Product;
import com.example.shop.model.User;
import com.example.shop.repository.CartItemRepository;
import com.example.shop.repository.CartRepository;
import com.example.shop.repository.ProductRepository;
import com.example.shop.repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class CheckoutFlowIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

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

    private String username;
    private final String password = "User123@";
    private Product product;

    @BeforeEach
    void setUp() {
        username = "checkout_user_" + System.nanoTime();

        User user = new User();
        user.setUsername(username);
        user.setEmail(username + "@example.com");
        user.setPassword(passwordEncoder.encode(password));
        user.setRole("USER");
        user = userRepository.save(user);

        product = new Product();
        product.setName("Checkout Product");
        product.setDescription("For integration test");
        product.setPrice(new BigDecimal("30.00"));
        product.setImageUrl("https://img/checkout");
        product.setStock(5);
        product.setDetails("integration");
        product = productRepository.save(product);

        Cart cart = new Cart();
        cart.setUser(user);
        cart = cartRepository.save(cart);

        CartItem item = new CartItem();
        item.setCart(cart);
        item.setProduct(product);
        item.setQuantity(2);
        cartItemRepository.save(item);
    }

    @Test
    void checkoutFlow_shouldCreateOrderAndClearCart() throws Exception {
        String token = userToken();

        mockMvc.perform(post("/api/orders")
                .header("Authorization", token))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").exists())
            .andExpect(jsonPath("$.totalPrice").value(60.00));

        mockMvc.perform(get("/api/cart")
                .header("Authorization", token))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isEmpty());

        Product refreshed = productRepository.findById(product.getId()).orElseThrow();
        assertEquals(3, refreshed.getStock());
    }

    private String userToken() throws Exception {
        String loginRequest = """
            {"username":"%s","password":"%s"}
            """.formatted(username, password);

        MvcResult loginResult = mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginRequest))
            .andExpect(status().isOk())
            .andReturn();

        JsonNode jsonNode = objectMapper.readTree(loginResult.getResponse().getContentAsString());
        return "Bearer " + jsonNode.get("token").asText();
    }
}
