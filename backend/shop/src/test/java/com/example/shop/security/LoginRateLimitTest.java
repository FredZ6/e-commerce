package com.example.shop.security;

import com.example.shop.model.User;
import com.example.shop.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@TestPropertySource(properties = {
        "security.login.max-attempts=3",
        "security.login.failure-window-seconds=600",
        "security.login.block-duration-seconds=600"
})
class LoginRateLimitTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private String username;
    private static final String WRONG_PASSWORD = "Wrong123@";

    @BeforeEach
    void setUp() {
        username = "rate_limit_user_" + System.nanoTime();

        User user = new User();
        user.setUsername(username);
        user.setEmail(username + "@example.com");
        user.setPassword(passwordEncoder.encode("User123@"));
        user.setRole("USER");
        userRepository.save(user);
    }

    @Test
    void blocksLoginAfterMaxFailedAttempts() throws Exception {
        for (int i = 0; i < 3; i++) {
            login(WRONG_PASSWORD)
                    .andExpect(status().isUnauthorized());
        }

        login(WRONG_PASSWORD)
                .andExpect(status().isTooManyRequests());

        login("User123@")
                .andExpect(status().isTooManyRequests());
    }

    @Test
    void successfulLoginResetsFailureCounter() throws Exception {
        login(WRONG_PASSWORD)
                .andExpect(status().isUnauthorized());
        login(WRONG_PASSWORD)
                .andExpect(status().isUnauthorized());

        login("User123@")
                .andExpect(status().isOk());

        login(WRONG_PASSWORD)
                .andExpect(status().isUnauthorized());
    }

    private org.springframework.test.web.servlet.ResultActions login(String password) throws Exception {
        String body = """
                {"username":"%s","password":"%s"}
                """.formatted(username, password);

        return mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body));
    }
}
