package com.example.shop.contract;

import com.example.shop.model.User;
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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class ProductContractTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void ensureAdminExists() {
        userRepository.findByUsername("contract_admin").orElseGet(() -> {
            User admin = new User();
            admin.setUsername("contract_admin");
            admin.setEmail("contract_admin@example.com");
            admin.setPassword(passwordEncoder.encode("Admin123@"));
            admin.setRole("ADMIN");
            return userRepository.save(admin);
        });
    }

    @Test
    void createProduct_shouldPersistStockAndDetails() throws Exception {
        String body = """
          {"name":"Keyboard","description":"Mech","price":99.99,
           "imageUrl":"https://img","stock":12,"details":"Hot-swappable"}
          """;

        mockMvc.perform(post("/api/products/add")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body)
                .header("Authorization", adminToken()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.stock").value(12))
            .andExpect(jsonPath("$.details").value("Hot-swappable"));
    }

    private String adminToken() throws Exception {
        String loginRequest = """
            {"username":"contract_admin","password":"Admin123@"}
            """;

        MvcResult loginResult = mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginRequest))
            .andExpect(status().isOk())
            .andReturn();

        JsonNode jsonNode = objectMapper.readTree(loginResult.getResponse().getContentAsString());
        return "Bearer " + jsonNode.get("token").asText();
    }
}
