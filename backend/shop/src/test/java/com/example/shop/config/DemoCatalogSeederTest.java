package com.example.shop.config;

import com.example.shop.model.Product;
import com.example.shop.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.springframework.boot.DefaultApplicationArguments;

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
        when(productRepository.count()).thenReturn(0L);

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
                    assertThat(product.getImageUrl()).startsWith("/demo-products/");
                });
    }

    @Test
    void doesNotSeedWhenCatalogAlreadyExists() throws Exception {
        when(productRepository.count()).thenReturn(3L);

        seeder.run(new DefaultApplicationArguments(new String[0]));

        verify(productRepository, never()).saveAll(anyList());
    }
}
