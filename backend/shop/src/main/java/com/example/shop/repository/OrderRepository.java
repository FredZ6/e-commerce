package com.example.shop.repository;

import com.example.shop.model.Order;
import com.example.shop.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    // 
    List<Order> findByUser(User user);

    //  JOIN FETCH  orderItems
    @Query("SELECT DISTINCT o FROM Order o LEFT JOIN FETCH o.orderItems WHERE o.user = :user")
    List<Order> findOrdersWithItemsByUser(@Param("user") User user);
}