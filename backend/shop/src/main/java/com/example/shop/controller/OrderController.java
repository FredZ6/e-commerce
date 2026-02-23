package com.example.shop.controller;

import com.example.shop.model.Order;
import com.example.shop.model.User;
import com.example.shop.service.OrderService;
import com.example.shop.service.UserService;
import com.example.shop.util.JwtTokenUtil;
import com.example.shop.dto.OrderDto;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final UserService userService;
    private final JwtTokenUtil jwtTokenUtil;

    @Autowired
    public OrderController(OrderService orderService,
                           UserService userService,
                           JwtTokenUtil jwtTokenUtil) {
        this.orderService = orderService;
        this.userService = userService;
        this.jwtTokenUtil = jwtTokenUtil;
    }

    // 
    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestHeader("Authorization") String token) {
        User user = getUserFromToken(token);
        Order order = orderService.createOrder(user);
        return ResponseEntity.ok(order);
    }

    // 
    @GetMapping
    public ResponseEntity<List<OrderDto>> getOrders(@RequestHeader("Authorization") String token) {
        User user = getUserFromToken(token);
        List<OrderDto> orders = orderService.getOrdersByUser(user);
        return ResponseEntity.ok(orders);
    }

    // 
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDto> getOrderById(
            @RequestHeader("Authorization") String token,
            @PathVariable Long orderId) {
        User user = getUserFromToken(token);
        OrderDto order = orderService.getOrderById(user, orderId);
        return ResponseEntity.ok(order);
    }

    // 
    private User getUserFromToken(String token) {
        String username = jwtTokenUtil.getUsernameFromToken(token.substring(7));
        return userService.findByUsername(username);
    }
}