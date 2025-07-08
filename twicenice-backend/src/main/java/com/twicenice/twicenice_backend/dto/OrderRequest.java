package com.twicenice.twicenice_backend.dto;

import lombok.Data;

@Data
public class OrderRequest {
    private Long userId;
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
