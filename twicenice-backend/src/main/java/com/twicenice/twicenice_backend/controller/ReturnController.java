package com.twicenice.twicenice_backend.controller;

import com.twicenice.twicenice_backend.dto.*;
import com.twicenice.twicenice_backend.model.*;
import com.twicenice.twicenice_backend.service.*;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user/returns")
@RequiredArgsConstructor
public class ReturnController {
    private static final Logger logger = LoggerFactory.getLogger(ReturnController.class);
    
    private final ReturnService returnService;
    private final UserService userService;
    private final OrderService orderService; 
    @Autowired 
    public ReturnController(ReturnService returnService, 
                          UserService userService,
                          OrderService orderService) {
        this.returnService = returnService;
        this.userService = userService;
        this.orderService = orderService;
    }
    @PostMapping
    public ResponseEntity<?> createReturnRequest(
            @Valid @RequestBody CreateReturnRequestDto request,
            BindingResult bindingResult,
            Principal principal) {
        
        logger.info("Received return request: {}", request); 
        
        if (bindingResult.hasErrors()) {
            logger.error("Validation errors: {}", bindingResult.getAllErrors());
            return ResponseEntity.badRequest().body(bindingResult.getAllErrors());
        }
        
        if (principal == null || principal.getName() == null) {
            logger.error("Unauthorized access attempt");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        try {
            Long userId = userService.getUserIdByEmail(principal.getName());
            if (userId == null) {
                logger.error("User not found for email: {}", principal.getName());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            
            Order order = orderService.getOrderById(request.getOrderId());
            if (order == null || !order.getUserId().equals(userId)) {
                logger.error("Order not found or doesn't belong to user. Order: {}, User: {}", request.getOrderId(), userId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                       .body("Order not found or doesn't belong to user");
            }
           
            List<ReturnItem> items = request.getItems().stream()
                .map(dto -> {
                    ReturnItem item = new ReturnItem();
                    item.setProductId(dto.getProductId());
                    item.setQuantity(dto.getQuantity());
                    item.setItemReason(dto.getReason()); 
                    item.setCondition(dto.getCondition());
                    return item;
                })
                .collect(Collectors.toList());
            
            ReturnRequest created = returnService.requestReturn(
                request.getOrderId(),
                userId,
                request.getReason(),
                items
            );
            
            return ResponseEntity.ok(returnService.mapToDto(created));
            
        } catch (Exception e) {
            logger.error("Error creating return request", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                   .body("Error processing return: " + e.getMessage());
        }
    }

 
    @GetMapping("/{userId}")
    public ResponseEntity<List<ReturnRequestDto>> getUserReturns(
            @PathVariable Long userId,
            Principal principal) {
        
        
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        if (!userService.isSameUser(principal.getName(), userId)) {
            logger.warn("User {} attempted to access returns for user {}", principal.getName(), userId);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        List<ReturnRequestDto> returns = returnService.getReturnsByUserId(userId);
        logger.info("Returning {} return requests for user {}", returns.size(), userId);
        
        return ResponseEntity.ok(returns);
    }
    @DeleteMapping("/{returnId}")
    public ResponseEntity<?> deleteReturnRequest(
            @PathVariable Long returnId,
            Principal principal) {
        
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        try {
            Long userId = userService.getUserIdByEmail(principal.getName());
            returnService.deleteReturn(returnId, userId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error deleting return request");
        }
    }
}




