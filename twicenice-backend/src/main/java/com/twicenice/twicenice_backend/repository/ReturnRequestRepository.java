package com.twicenice.twicenice_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.twicenice.twicenice_backend.model.ReturnRequest;

public interface ReturnRequestRepository extends JpaRepository<ReturnRequest, Long> {
    List<ReturnRequest> findByUserId(Long userId);
    List<ReturnRequest> findByStatus(String status);
    
    @Query("SELECT r FROM ReturnRequest r LEFT JOIN FETCH r.items ORDER BY r.requestDate DESC")
    List<ReturnRequest> findAllWithItems();
    @Query("SELECT r FROM ReturnRequest r JOIN FETCH r.items WHERE r.order.id = :orderId AND r.status IN :statuses")
    List<ReturnRequest> findByOrderIdAndStatusIn(
        @Param("orderId") Long orderId, 
        @Param("statuses") List<String> statuses);
}
