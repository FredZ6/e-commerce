package com.example.shop.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class LoginAttemptService {

    private static final class LoginAttemptState {
        private int failures;
        private Instant firstFailureAt;
        private Instant blockedUntil;
    }

    private final Map<String, LoginAttemptState> states = new ConcurrentHashMap<>();
    private final int maxAttempts;
    private final Duration failureWindow;
    private final Duration blockDuration;

    public LoginAttemptService(@Value("${security.login.max-attempts:5}") int maxAttempts,
                               @Value("${security.login.failure-window-seconds:300}") long failureWindowSeconds,
                               @Value("${security.login.block-duration-seconds:900}") long blockDurationSeconds) {
        this.maxAttempts = maxAttempts;
        this.failureWindow = Duration.ofSeconds(failureWindowSeconds);
        this.blockDuration = Duration.ofSeconds(blockDurationSeconds);
    }

    public boolean isBlocked(String key) {
        LoginAttemptState state = states.get(normalizeKey(key));
        if (state == null) {
            return false;
        }

        Instant now = Instant.now();
        if (state.blockedUntil != null && now.isBefore(state.blockedUntil)) {
            return true;
        }

        if (state.blockedUntil != null && !now.isBefore(state.blockedUntil)) {
            states.remove(normalizeKey(key));
        }
        return false;
    }

    public void recordFailure(String key) {
        final String normalized = normalizeKey(key);
        final Instant now = Instant.now();

        states.compute(normalized, (ignored, current) -> {
            LoginAttemptState state = current == null ? new LoginAttemptState() : current;

            if (state.firstFailureAt == null || now.isAfter(state.firstFailureAt.plus(failureWindow))) {
                state.failures = 0;
                state.firstFailureAt = now;
                state.blockedUntil = null;
            }

            state.failures += 1;
            if (state.failures >= maxAttempts) {
                state.blockedUntil = now.plus(blockDuration);
            }

            return state;
        });
    }

    public void recordSuccess(String key) {
        states.remove(normalizeKey(key));
    }

    private String normalizeKey(String key) {
        return key == null ? "" : key.trim().toLowerCase();
    }
}
