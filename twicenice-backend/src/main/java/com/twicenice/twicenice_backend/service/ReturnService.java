package com.twicenice.twicenice_backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.twicenice.twicenice_backend.dto.ReturnRequestDto;
import com.twicenice.twicenice_backend.model.*;
import com.twicenice.twicenice_backend.repository.*;

import jakarta.transaction.Transactional;

import com.twicenice.twicenice_backend.dto.ReturnItemDto;

@Service
@Transactional
public class ReturnService {
    private static final Logger logger = LoggerFactory.getLogger(ReturnService.class);
    
    private final ReturnRequestRepository returnRequestRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final ReturnItemRepository returnItemRepository;
    private final String baseImageUrl = "http://localhost:8080/api/products/images/";

    @Autowired
    public ReturnService(ReturnRequestRepository returnRequestRepository,
                        OrderRepository orderRepository,
                        ProductRepository productRepository,
                        ReturnItemRepository returnItemRepository) {
        this.returnRequestRepository = returnRequestRepository;
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.returnItemRepository = returnItemRepository;
    }
   
    public ReturnRequest requestReturn(Long orderId, Long userId, String reason, List<ReturnItem> items) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));

        logger.info("Checking return eligibility for order {}: current={}, windowEnd={}, isReturnable={}", 
            orderId, LocalDateTime.now(), order.getReturnWindowEnd(), order.isReturnable());

        if (order.getReturnWindowEnd() == null) {
            throw new RuntimeException("Return window not configured for this order");
        }

        if (!order.isReturnable()) {
            throw new RuntimeException("Order is marked as non-returnable");
        }

        if (LocalDateTime.now().isAfter(order.getReturnWindowEnd())) {
            throw new RuntimeException("Return window expired on " + order.getReturnWindowEnd());
        }

        if (!order.getStatus().equals("DELIVERED")) {
            throw new RuntimeException("Only delivered orders can be returned");
        }

        
        List<ReturnRequest> existingReturns = returnRequestRepository.findByOrderIdAndStatusIn(
            orderId, List.of("PENDING", "APPROVED")
        );

        for (ReturnItem newItem : items) {
            boolean alreadyReturned = existingReturns.stream()
                .flatMap(r -> r.getItems().stream())
                .anyMatch(existingItem -> 
                    existingItem.getProductId().equals(newItem.getProductId())
                );
            if (alreadyReturned) {
                throw new RuntimeException(
                    "Product " + newItem.getProductId() + " already has an active return request"
                );
            }
        }

        ReturnRequest request = new ReturnRequest();
        request.setOrder(order);
        request.setUserId(userId);
        request.setReason(reason);
        request.setStatus("PENDING");
        request.setRequestDate(LocalDateTime.now());

        ReturnRequest savedRequest = returnRequestRepository.save(request);

        items.forEach(item -> {
            item.setReturnRequest(savedRequest);
            returnItemRepository.save(item);
        });

        savedRequest.setItems(items);
        return returnRequestRepository.save(savedRequest);
    }

    public List<ReturnRequestDto> getReturnsByUserId(Long userId) {
        return returnRequestRepository.findByUserId(userId)
            .stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }

    public List<ReturnRequestDto> getAllReturns() {
        logger.debug("Querying database for returns");
        List<ReturnRequest> requests = returnRequestRepository.findAllWithItems();
        logger.debug("Found {} return requests", requests.size());
        if(!requests.isEmpty()) {
            logger.debug("First return ID: {}", requests.get(0).getId());
        }
        return requests.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public ReturnRequestDto processReturn(Long returnId, String action, String comments) {
        ReturnRequest request = returnRequestRepository.findById(returnId)
            .orElseThrow(() -> new RuntimeException("Return request not found"));
        
        request.setStatus(action);
        request.setProcessedDate(LocalDateTime.now());
        request.setAdminComments(comments);
        
        if ("APPROVED".equals(action)) {
            request.getItems().forEach(item -> {
                productRepository.increaseStock(item.getProductId(), item.getQuantity());
            });
        }
        
        ReturnRequest saved = returnRequestRepository.save(request);
        return mapToDto(saved);
    }

    public ReturnRequestDto mapToDto(ReturnRequest entity) {
        ReturnRequestDto dto = new ReturnRequestDto();
        dto.setId(entity.getId());
        dto.setOrderId(entity.getOrder().getId());
        dto.setUserId(entity.getUserId());
        dto.setReason(entity.getReason());
        dto.setStatus(entity.getStatus());
        dto.setRequestDate(entity.getRequestDate());
        dto.setProcessedDate(entity.getProcessedDate());
        dto.setAdminComments(entity.getAdminComments());
        
        
        if (entity.getItems() != null && !entity.getItems().isEmpty()) {
            Long firstProductId = entity.getItems().get(0).getProductId();
            String imageUrl = productRepository.findImageUrlById(firstProductId);
            if (imageUrl != null) {
                dto.setProductImageUrl(baseImageUrl + imageUrl);
            }
        }
        
        
        if (entity.getItems() != null) {
            dto.setItems(entity.getItems().stream()
                .map(item -> {
                    ReturnItemDto itemDto = new ReturnItemDto();
                    itemDto.setProductId(item.getProductId());
                    itemDto.setQuantity(item.getQuantity());
                    itemDto.setReason(item.getItemReason());
                    itemDto.setCondition(item.getCondition());
                    return itemDto;
                })
                .collect(Collectors.toList()));
        } else {
            dto.setItems(List.of());
        }
        
        return dto;
    }
    
    public void deleteReturn(Long returnId, Long userId) {
        ReturnRequest request = returnRequestRepository.findById(returnId)
            .orElseThrow(() -> new RuntimeException("Return request not found"));
        
        if (!request.getUserId().equals(userId)) {
            throw new RuntimeException("You can only delete your own return requests");
        }
        
        if (!"PENDING".equals(request.getStatus())) {
            throw new RuntimeException("Only PENDING returns can be deleted");
        }
        
        returnRequestRepository.delete(request);
    }
}