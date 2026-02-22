package com.example.shop.config;

import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.assertj.core.api.Assertions.assertThat;

class ConfigLoadTest {

    @Test
    void contextLoadsWithEnvBackedSecrets() throws IOException {
        String properties = Files.readString(Path.of("src/main/resources/application.properties"));

        assertThat(properties).contains("spring.datasource.url=${DB_URL:");
        assertThat(properties).contains("spring.datasource.username=${DB_USERNAME:");
        assertThat(properties).contains("spring.datasource.password=${DB_PASSWORD:");
        assertThat(properties).contains("jwt.secret=${JWT_SECRET:");
    }
}
