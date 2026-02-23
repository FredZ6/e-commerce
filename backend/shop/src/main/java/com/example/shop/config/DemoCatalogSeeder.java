package com.example.shop.config;

import com.example.shop.model.Product;
import com.example.shop.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Component
@Profile({"local", "demo"})
public class DemoCatalogSeeder implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DemoCatalogSeeder.class);
    private final ProductRepository productRepository;

    public DemoCatalogSeeder(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (productRepository.count() > 0) {
            return;
        }

        List<Product> demoProducts = List.of(
                buildProduct(
                        "Wireless Mouse",
                        "A smooth and responsive wireless mouse.",
                        "19.99",
                        "/demo-products/wireless-mouse.svg",
                        120,
                        "Ergonomic contour with silent click design.\nBluetooth and 2.4G dual mode."
                ),
                buildProduct(
                        "Mechanical Keyboard",
                        "A durable mechanical keyboard with backlight.",
                        "79.99",
                        "/demo-products/mechanical-keyboard.svg",
                        80,
                        "Hot-swappable switches and PBT keycaps.\nCompact layout for productivity."
                ),
                buildProduct(
                        "HD Monitor",
                        "A 24-inch full HD monitor.",
                        "149.99",
                        "/demo-products/hd-monitor.svg",
                        45,
                        "1080p IPS panel with vivid color accuracy.\nIncludes HDMI and DisplayPort."
                ),
                buildProduct(
                        "USB-C Hub",
                        "A compact USB-C hub for daily expansion.",
                        "39.99",
                        "/demo-products/usb-c-hub.svg",
                        95,
                        "Supports 4K HDMI output, USB 3.0, and pass-through charging."
                ),
                buildProduct(
                        "Laptop Stand",
                        "An aluminum stand for ergonomic desk setup.",
                        "34.99",
                        "/demo-products/laptop-stand.svg",
                        110,
                        "Improves airflow and raises screen height to reduce neck strain."
                ),
                buildProduct(
                        "Noise-Canceling Headphones",
                        "Over-ear headphones with active noise canceling.",
                        "129.99",
                        "/demo-products/noise-canceling-headphones.svg",
                        60,
                        "Up to 30 hours battery life with USB-C fast charging."
                )
        );

        productRepository.saveAll(demoProducts);
        log.info("Seeded {} demo products for local profile.", demoProducts.size());
    }

    private Product buildProduct(String name,
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
