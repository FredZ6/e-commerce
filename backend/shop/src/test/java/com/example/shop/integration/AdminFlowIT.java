package com.example.shop.integration;

import com.example.shop.model.Order;
import com.example.shop.model.User;
import com.example.shop.repository.OrderRepository;
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

import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class AdminFlowIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private String adminUsername;
    private final String adminPassword = "Admin123@";
    private Long orderId;

    @BeforeEach
    void setUp() {
        adminUsername = "admin_it_" + System.nanoTime();

        User admin = new User();
        admin.setUsername(adminUsername);
        admin.setEmail(adminUsername + "@example.com");
        admin.setPassword(passwordEncoder.encode(adminPassword));
        admin.setRole("ADMIN");
        userRepository.save(admin);

        User customer = new User();
        customer.setUsername("customer_it_" + System.nanoTime());
        customer.setEmail(customer.getUsername() + "@example.com");
        customer.setPassword(passwordEncoder.encode("User123@"));
        customer.setRole("USER");
        customer = userRepository.save(customer);

        Order order = new Order();
        order.setUser(customer);
        order.setStatus(Order.OrderStatus.PAID);
        order.setTotalPrice(new BigDecimal("120.00"));
        order = orderRepository.save(order);
        orderId = order.getId();
    }

    @Test
    void adminFlow_shouldListOrdersAndUpdateStatus() throws Exception {
        String adminToken = adminToken();

        mockMvc.perform(get("/api/orders/admin")
                .header("Authorization", adminToken))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[*].id", hasItem(orderId.intValue())));

        mockMvc.perform(put("/api/orders/admin/{id}/status", orderId)
                .param("status", "SHIPPED")
                .header("Authorization", adminToken))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("SHIPPED"));
    }

    private String adminToken() throws Exception {
        String loginRequest = """
            {"username":"%s","password":"%s"}
            """.formatted(adminUsername, adminPassword);

        MvcResult loginResult = mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginRequest))
            .andExpect(status().isOk())
            .andReturn();

        JsonNode jsonNode = objectMapper.readTree(loginResult.getResponse().getContentAsString());
        return "Bearer " + jsonNode.get("token").asText();
    }
}
