package com.example.shop.service;

import com.example.shop.model.*;
import com.example.shop.repository.*;
import com.example.shop.dto.OrderDto;
import com.example.shop.dto.OrderItemDto;
import com.example.shop.exception.ResourceNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartService cartService;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;

    @Autowired
    public OrderService(OrderRepository orderRepository,
                        CartService cartService,
                        OrderItemRepository orderItemRepository,
                        ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.cartService = cartService;
        this.orderItemRepository = orderItemRepository;
        this.productRepository = productRepository;
    }

    // 创建订单
    @Transactional
    public Order createOrder(User user) {
        // 获取用户的购物车
        Cart cart = cartService.getCartByUser(user);
        List<CartItem> cartItems = cartService.getCartItems(cart);

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // 创建订单
        Order order = new Order();
        order.setUser(user);
        order.setStatus(Order.OrderStatus.PENDING);
        
        // 计算总价
        BigDecimal totalPrice = BigDecimal.ZERO;
        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();
            int currentStock = product.getStock() == null ? 0 : product.getStock();
            if (currentStock < cartItem.getQuantity()) {
                throw new RuntimeException("Insufficient stock: " + product.getName());
            }
            product.setStock(currentStock - cartItem.getQuantity());
            productRepository.save(product);

            totalPrice = totalPrice.add(
                product.getPrice()
                    .multiply(BigDecimal.valueOf(cartItem.getQuantity()))
            );
        }
        order.setTotalPrice(totalPrice);
        order = orderRepository.save(order);

        // 创建订单项
        for (CartItem cartItem : cartItems) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setUnitPrice(cartItem.getProduct().getPrice());
            orderItemRepository.save(orderItem);
        }

        // 清空购物车
        cartService.clearCart(user);

        return order;
    }

    // 获取用户的所有订单
    @Transactional(readOnly = true)
    public List<OrderDto> getOrdersByUser(User user) {
        return orderRepository.findByUser(user).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OrderDto> getAllOrdersForAdmin() {
        return orderRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // 获取订单详情
    @Transactional(readOnly = true)
    public OrderDto getOrderById(User user, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        // 验证订单属于当前用户
        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access");
        }

        return convertToDTO(order);
    }

    @Transactional
    public OrderDto updateOrderStatus(Long orderId, Order.OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        validateStatusTransition(order.getStatus(), status);
        order.setStatus(status);
        order = orderRepository.save(order);
        return convertToDTO(order);
    }

    private void validateStatusTransition(Order.OrderStatus current, Order.OrderStatus target) {
        if (current == target) {
            return;
        }

        boolean valid = switch (current) {
            case PENDING -> target == Order.OrderStatus.PAID || target == Order.OrderStatus.CANCELLED;
            case PAID -> target == Order.OrderStatus.SHIPPED || target == Order.OrderStatus.CANCELLED;
            case SHIPPED -> target == Order.OrderStatus.COMPLETED;
            case COMPLETED, CANCELLED -> false;
        };

        if (!valid) {
            throw new RuntimeException("Invalid order status transition: " + current + " -> " + target);
        }
    }

    // 转换为 DTO
    private OrderDto convertToDTO(Order order) {
        OrderDto dto = new OrderDto();
        dto.setId(order.getId());
        dto.setTotalPrice(order.getTotalPrice());
        dto.setStatus(order.getStatus());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setUpdatedAt(order.getUpdatedAt());
        
        // 使用 JPQL 直接获取订单项
        List<OrderItem> orderItems = orderItemRepository.findByOrderId(order.getId());
        Set<OrderItemDto> orderItemDtos = orderItems.stream()
                .map(item -> {
                    OrderItemDto itemDto = new OrderItemDto();
                    itemDto.setId(item.getId());
                    itemDto.setOrderId(order.getId());
                    Product product = item.getProduct();
                    itemDto.setProductId(product.getId());
                    itemDto.setProductName(product.getName());
                    itemDto.setProductImageUrl(product.getImageUrl());
                    itemDto.setQuantity(item.getQuantity());
                    itemDto.setUnitPrice(item.getUnitPrice());
                    itemDto.setTotalPrice(item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
                    return itemDto;
                })
                .collect(Collectors.toSet());
        
        dto.setOrderItems(orderItemDtos);
        return dto;
    }
}
