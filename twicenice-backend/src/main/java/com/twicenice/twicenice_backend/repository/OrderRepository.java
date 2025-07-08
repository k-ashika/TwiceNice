package com.twicenice.twicenice_backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.twicenice.twicenice_backend.model.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);
    List<Order> findTop5ByOrderByCreatedAtDesc();
    @Query("SELECT COUNT(o) > 0 FROM Order o JOIN o.items i WHERE o.userId = :userId AND i.productId = :productId")
    boolean existsByUserIdAndItems_ProductId(@Param("userId") Long userId, 
                                           @Param("productId") Long productId);
    @Query("SELECT o FROM Order o WHERE o.userId = :userId AND o.status = 'DELIVERED' AND o.returnWindowEnd > CURRENT_TIMESTAMP")
    List<Order> findReturnableByUserId(@Param("userId") Long userId);
    @Modifying
    @Query("UPDATE Order o SET o.isReturnable = false WHERE o.id = :orderId")
    void disableReturns(@Param("orderId") Long orderId);
    
    long countByStatusIgnoreCase(String status);
    
}
