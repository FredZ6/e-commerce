package com.example.shop.contract;

import com.example.shop.model.Order;
import com.example.shop.model.OrderItem;
import com.example.shop.model.Product;
import com.example.shop.model.User;
import com.example.shop.repository.OrderItemRepository;
import com.example.shop.repository.OrderRepository;
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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class OrderContractTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private String username;
    private final String password = "User123@";

    @BeforeEach
    void setUpOrderFixture() {
        username = "contract_user_" + System.nanoTime();

        User user = new User();
        user.setUsername(username);
        user.setEmail(username + "@example.com");
        user.setPassword(passwordEncoder.encode(password));
        user.setRole("USER");
        user = userRepository.save(user);

        Product product = new Product();
        product.setName("Mouse");
        product.setDescription("Wireless");
        product.setPrice(new BigDecimal("24.99"));
        product.setImageUrl("https://img/mouse");
        product.setStock(100);
        product.setDetails("2.4G");
        product = productRepository.save(product);

        Order order = new Order();
        order.setUser(user);
        order.setStatus(Order.OrderStatus.PENDING);
        order.setTotalPrice(new BigDecimal("49.98"));
        order = orderRepository.save(order);

        OrderItem item = new OrderItem();
        item.setOrder(order);
        item.setProduct(product);
        item.setQuantity(2);
        item.setUnitPrice(new BigDecimal("24.99"));
        orderItemRepository.save(item);
    }

    @Test
    void getOrders_shouldReturnFrontendCompatibleFields() throws Exception {
        mockMvc.perform(get("/api/orders").header("Authorization", userToken()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].id").exists())
            .andExpect(jsonPath("$[0].totalPrice").exists())
            .andExpect(jsonPath("$[0].orderItems[0].productName").exists())
            .andExpect(jsonPath("$[0].orderItems[0].unitPrice").exists())
            .andExpect(jsonPath("$[0].orderItems[0].productImageUrl").exists());
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
