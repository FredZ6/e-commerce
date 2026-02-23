package com.example.shop.config;

import com.example.shop.model.Product;
import com.example.shop.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.springframework.boot.DefaultApplicationArguments;

import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class DemoCatalogSeederTest {

    private ProductRepository productRepository;
    private DemoCatalogSeeder seeder;

    @BeforeEach
    void setUp() {
        productRepository = Mockito.mock(ProductRepository.class);
        seeder = new DemoCatalogSeeder(productRepository);
    }

    @Test
    void seedsCuratedProductsWhenCatalogIsEmpty() throws Exception {
        when(productRepository.findAll()).thenReturn(List.of());

        seeder.run(new DefaultApplicationArguments(new String[0]));

        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<Product>> productsCaptor = ArgumentCaptor.forClass(List.class);
        verify(productRepository).saveAll(productsCaptor.capture());
        List<Product> seededProducts = productsCaptor.getValue();

        assertThat(seededProducts).hasSize(6);
        assertThat(seededProducts)
                .allSatisfy(product -> {
                    assertThat(product.getName()).isNotBlank();
                    assertThat(product.getDescription()).isNotBlank();
                    assertThat(product.getDetails()).isNotBlank();
                    assertThat(product.getStock()).isPositive();
                    assertThat(product.getImageUrl()).startsWith("https://images.pexels.com/photos/");
                });
    }

    @Test
    void updatesDemoImageWhenCatalogAlreadyExists() throws Exception {
        Product existingMouse = product(
                "Wireless Mouse",
                "A smooth and responsive wireless mouse.",
                "19.99",
                "/demo-products/wireless-mouse.svg",
                120,
                "Ergonomic contour with silent click design.\nBluetooth and 2.4G dual mode."
        );
        Product existingKeyboard = product(
                "Mechanical Keyboard",
                "A durable mechanical keyboard with backlight.",
                "79.99",
                "https://images.pexels.com/photos/31497027/pexels-photo-31497027.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
                80,
                "Hot-swappable switches and PBT keycaps.\nCompact layout for productivity."
        );
        when(productRepository.findAll()).thenReturn(List.of(existingMouse, existingKeyboard));

        seeder.run(new DefaultApplicationArguments(new String[0]));

        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<Product>> productsCaptor = ArgumentCaptor.forClass(List.class);
        verify(productRepository).saveAll(productsCaptor.capture());
        List<Product> syncedProducts = productsCaptor.getValue();

        assertThat(syncedProducts).hasSize(5);
        assertThat(syncedProducts).contains(existingMouse);
        assertThat(existingMouse.getImageUrl())
                .isEqualTo("https://images.pexels.com/photos/13870518/pexels-photo-13870518.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260");
    }

    @Test
    void skipsSaveWhenCatalogAlreadySynced() throws Exception {
        when(productRepository.findAll()).thenReturn(List.of(
                product(
                        "Wireless Mouse",
                        "A smooth and responsive wireless mouse.",
                        "19.99",
                        "https://images.pexels.com/photos/13870518/pexels-photo-13870518.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
                        120,
                        "Ergonomic contour with silent click design.\nBluetooth and 2.4G dual mode."
                ),
                product(
                        "Mechanical Keyboard",
                        "A durable mechanical keyboard with backlight.",
                        "79.99",
                        "https://images.pexels.com/photos/31497027/pexels-photo-31497027.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
                        80,
                        "Hot-swappable switches and PBT keycaps.\nCompact layout for productivity."
                ),
                product(
                        "HD Monitor",
                        "A 24-inch full HD monitor.",
                        "149.99",
                        "https://images.pexels.com/photos/1714203/pexels-photo-1714203.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
                        45,
                        "1080p IPS panel with vivid color accuracy.\nIncludes HDMI and DisplayPort."
                ),
                product(
                        "USB-C Hub",
                        "A compact USB-C hub for daily expansion.",
                        "39.99",
                        "https://images.pexels.com/photos/7742583/pexels-photo-7742583.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
                        95,
                        "Supports 4K HDMI output, USB 3.0, and pass-through charging."
                ),
                product(
                        "Laptop Stand",
                        "An aluminum stand for ergonomic desk setup.",
                        "34.99",
                        "https://images.pexels.com/photos/14458078/pexels-photo-14458078.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
                        110,
                        "Improves airflow and raises screen height to reduce neck strain."
                ),
                product(
                        "Noise-Canceling Headphones",
                        "Over-ear headphones with active noise canceling.",
                        "129.99",
                        "https://images.pexels.com/photos/15372898/pexels-photo-15372898.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
                        60,
                        "Up to 30 hours battery life with USB-C fast charging."
                )
        ));

        seeder.run(new DefaultApplicationArguments(new String[0]));

        verify(productRepository, never()).saveAll(anyList());
    }

    private Product product(String name,
                            String description,
                            String price,
                            String imageUrl,
                            int stock,
                            String details) {
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(new BigDecimal(price));
        product.setImageUrl(imageUrl);
        product.setStock(stock);
        product.setDetails(details);
        return product;
    }
}
