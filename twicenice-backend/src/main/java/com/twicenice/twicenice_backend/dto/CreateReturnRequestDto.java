package com.twicenice.twicenice_backend.dto;

import lombok.Data;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

@Data
public class CreateReturnRequestDto {
    @NotNull(message = "Order ID is required")
    private Long orderId;
    
    @NotBlank(message = "Reason is required")
    private String reason;
    
    @NotEmpty(message = "At least one item is required")
    private List<ReturnItemDto> items;

	public Long getOrderId() {
		return orderId;
	}

	public void setOrderId(Long orderId) {
		this.orderId = orderId;
	}

	public String getReason() {
		return reason;
	}

	public void setReason(String reason) {
		this.reason = reason;
	}

	public List<ReturnItemDto> getItems() {
		return items;
	}

	public void setItems(List<ReturnItemDto> items) {
		this.items = items;
	}
    
    
}