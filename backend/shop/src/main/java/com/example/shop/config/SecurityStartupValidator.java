package com.example.shop.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.stream.Stream;

@Component
public class SecurityStartupValidator {

    private static final String LOCAL_DEFAULT_SECRET =
            "local-dev-jwt-secret-local-dev-jwt-secret-local-dev-jwt-secret-local-dev-jwt-secret";

    private final Environment environment;
    private final String jwtSecret;

    public SecurityStartupValidator(Environment environment,
                                    @Value("${jwt.secret:}") String jwtSecret) {
        this.environment = environment;
        this.jwtSecret = jwtSecret;
    }

    @PostConstruct
    public void validate() {
        if (isLocalOrTestProfile()) {
            return;
        }

        if (jwtSecret == null || jwtSecret.isBlank()) {
            throw new IllegalStateException("JWT secret must be configured for non-local environments.");
        }

        if (LOCAL_DEFAULT_SECRET.equals(jwtSecret)) {
            throw new IllegalStateException("Refusing to start with local default JWT secret outside local/test.");
        }

        if (jwtSecret.getBytes(StandardCharsets.UTF_8).length < 64) {
            throw new IllegalStateException("JWT secret must be at least 64 bytes for HS512.");
        }
    }

    private boolean isLocalOrTestProfile() {
        String[] activeProfiles = environment.getActiveProfiles();
        Stream<String> profilesToEvaluate = activeProfiles.length > 0
                ? Arrays.stream(activeProfiles)
                : Arrays.stream(environment.getDefaultProfiles());

        return profilesToEvaluate
                .anyMatch(profile -> "local".equalsIgnoreCase(profile) || "test".equalsIgnoreCase(profile));
    }
}
