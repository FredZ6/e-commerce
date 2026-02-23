package com.example.shop.config;

import org.junit.jupiter.api.Test;
import org.springframework.mock.env.MockEnvironment;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

class SecurityStartupValidatorTest {

    private static final String STRONG_SECRET =
            "prod-jwt-secret-prod-jwt-secret-prod-jwt-secret-prod-jwt-secret-123456";
    private static final String LOCAL_DEFAULT_SECRET =
            "local-dev-jwt-secret-local-dev-jwt-secret-local-dev-jwt-secret-local-dev-jwt-secret";

    @Test
    void allowsLocalProfileWithLocalSecret() {
        MockEnvironment environment = new MockEnvironment();
        environment.setActiveProfiles("local");

        SecurityStartupValidator validator = new SecurityStartupValidator(environment, LOCAL_DEFAULT_SECRET);
        assertDoesNotThrow(validator::validate);
    }

    @Test
    void rejectsProdProfileWithLocalDefaultSecret() {
        MockEnvironment environment = new MockEnvironment();
        environment.setActiveProfiles("prod");

        SecurityStartupValidator validator = new SecurityStartupValidator(environment, LOCAL_DEFAULT_SECRET);
        assertThrows(IllegalStateException.class, validator::validate);
    }

    @Test
    void rejectsProdProfileWithShortSecret() {
        MockEnvironment environment = new MockEnvironment();
        environment.setActiveProfiles("prod");

        SecurityStartupValidator validator = new SecurityStartupValidator(environment, "short-secret");
        assertThrows(IllegalStateException.class, validator::validate);
    }

    @Test
    void allowsProdProfileWithStrongSecret() {
        MockEnvironment environment = new MockEnvironment();
        environment.setActiveProfiles("prod");

        SecurityStartupValidator validator = new SecurityStartupValidator(environment, STRONG_SECRET);
        assertDoesNotThrow(validator::validate);
    }

    @Test
    void rejectsProdProfileEvenIfDefaultProfileIsLocal() {
        MockEnvironment environment = new MockEnvironment();
        environment.setDefaultProfiles("local");
        environment.setActiveProfiles("prod");

        SecurityStartupValidator validator = new SecurityStartupValidator(environment, LOCAL_DEFAULT_SECRET);
        assertThrows(IllegalStateException.class, validator::validate);
    }
}
