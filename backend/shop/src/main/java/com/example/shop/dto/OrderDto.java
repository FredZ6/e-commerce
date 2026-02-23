package com.example.shop.dto;

import com.example.shop.model.Order.OrderStatus;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Data
public class OrderDto {
    private Long id;
    private BigDecimal totalPrice;
    private OrderStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Set<OrderItemDto> orderItems;
} 