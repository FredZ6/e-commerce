package com.example.shop.security;

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
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@TestPropertySource(properties = {
        "management.endpoints.web.exposure.include=health,info,metrics,prometheus"
})
class SecurityBaselineContractTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    private String userUsername;
    private String adminUsername;
    private static final String PASSWORD = "User123@";

    @BeforeEach
    void setUpUsers() {
        userUsername = "baseline_user_" + System.nanoTime();
        adminUsername = "baseline_admin_" + System.nanoTime();

        User user = new User();
        user.setUsername(userUsername);
        user.setEmail(userUsername + "@example.com");
        user.setPassword(passwordEncoder.encode(PASSWORD));
        user.setRole("USER");
        userRepository.save(user);

        User admin = new User();
        admin.setUsername(adminUsername);
        admin.setEmail(adminUsername + "@example.com");
        admin.setPassword(passwordEncoder.encode(PASSWORD));
        admin.setRole("ADMIN");
        userRepository.save(admin);
    }

    @Test
    void metricsEndpointShouldRequireAdmin() throws Exception {
        mockMvc.perform(get("/actuator/metrics"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(get("/actuator/metrics")
                        .header("Authorization", bearerToken(userUsername)))
                .andExpect(status().isForbidden());

        mockMvc.perform(get("/actuator/metrics")
                        .header("Authorization", bearerToken(adminUsername)))
                .andExpect(status().isOk());
    }

    @Test
    void adminOrderEndpointShouldBeRoleProtected() throws Exception {
        mockMvc.perform(get("/api/orders/admin")
                        .header("Authorization", bearerToken(userUsername)))
                .andExpect(status().isForbidden());

        mockMvc.perform(get("/api/orders/admin")
                        .header("Authorization", bearerToken(adminUsername)))
                .andExpect(status().isOk());
    }

    @Test
    void productCatalogShouldRemainPublic() throws Exception {
        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk());
    }

    private String bearerToken(String username) throws Exception {
        String loginBody = """
                {"username":"%s","password":"%s"}
                """.formatted(username, PASSWORD);

        MvcResult loginResult = mockMvc.perform(post("/api/users/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginBody))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode loginJson = objectMapper.readTree(loginResult.getResponse().getContentAsString());
        return "Bearer " + loginJson.get("token").asText();
    }
}
