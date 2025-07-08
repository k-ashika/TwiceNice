package com.twicenice.twicenice_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.twicenice.twicenice_backend.model.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {}
