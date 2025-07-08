package com.twicenice.twicenice_backend.controller;

import com.twicenice.twicenice_backend.dto.ReturnRequestDto;
import com.twicenice.twicenice_backend.service.ReturnService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/returns")
public class AdminReturnController {

    private final ReturnService returnService;

    public AdminReturnController(ReturnService returnService) {
        this.returnService = returnService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReturnRequestDto>> getAllReturns() {
        return ResponseEntity.ok(returnService.getAllReturns());
    }

    @PutMapping("/{returnId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> processReturn(
            @PathVariable Long returnId,
            @RequestBody ProcessReturnRequest request) {
        try {
            ReturnRequestDto processedReturn = returnService.processReturn(
                returnId, 
                request.getAction(), 
                request.getComments()
            );
            return ResponseEntity.ok(processedReturn);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                   .body("Error processing return: " + e.getMessage());
        }
    }

    static class ProcessReturnRequest {
        private String action;
        private String comments;
        
        public String getAction() { return action; }
        public void setAction(String action) { this.action = action; }
        public String getComments() { return comments; }
        public void setComments(String comments) { this.comments = comments; }
    }
}