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

    @Autowired
    public OrderService(OrderRepository orderRepository,
                        CartService cartService,
                        OrderItemRepository orderItemRepository) {
        this.orderRepository = orderRepository;
        this.cartService = cartService;
        this.orderItemRepository = orderItemRepository;
    }

    // 
    public Order createOrder(User user) {
        // 
        Cart cart = cartService.getCartByUser(user);
        List<CartItem> cartItems = cartService.getCartItems(cart);

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // 
        Order order = new Order();
        order.setUser(user);
        order.setStatus(Order.OrderStatus.PENDING);
        
        // 
        BigDecimal totalPrice = BigDecimal.ZERO;
        for (CartItem cartItem : cartItems) {
            totalPrice = totalPrice.add(
                cartItem.getProduct().getPrice()
                    .multiply(BigDecimal.valueOf(cartItem.getQuantity()))
            );
        }
        order.setTotalPrice(totalPrice);
        order = orderRepository.save(order);

        // 
        for (CartItem cartItem : cartItems) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setUnitPrice(cartItem.getProduct().getPrice());
            orderItemRepository.save(orderItem);
        }

        // 
        cartService.clearCart(user);

        return order;
    }

    // 
    @Transactional(readOnly = true)
    public List<OrderDto> getOrdersByUser(User user) {
        return orderRepository.findByUser(user).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // 
    @Transactional(readOnly = true)
    public OrderDto getOrderById(User user, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        // 
        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access");
        }

        return convertToDTO(order);
    }

    //  DTO
    private OrderDto convertToDTO(Order order) {
        OrderDto dto = new OrderDto();
        dto.setId(order.getId());
        dto.setTotalPrice(order.getTotalPrice());
        dto.setStatus(order.getStatus());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setUpdatedAt(order.getUpdatedAt());
        
        //  JPQL 
        List<OrderItem> orderItems = orderItemRepository.findByOrderId(order.getId());
        Set<OrderItemDto> orderItemDtos = orderItems.stream()
                .map(item -> {
                    OrderItemDto itemDto = new OrderItemDto();
                    itemDto.setId(item.getId());
                    itemDto.setOrderId(order.getId());
                    Product product = item.getProduct();
                    itemDto.setProductId(product.getId());
                    itemDto.setProductName(product.getName());
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