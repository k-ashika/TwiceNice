package com.twicenice.twicenice_backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "return_items")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReturnItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "return_request_id")
    private ReturnRequest returnRequest;
    
    private Long productId;
    private int quantity;
    @Column(name = "`condition`") 
    private String condition;
    private String itemReason;
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public ReturnRequest getReturnRequest() {
		return returnRequest;
	}
	public void setReturnRequest(ReturnRequest returnRequest) {
		this.returnRequest = returnRequest;
	}
	public Long getProductId() {
		return productId;
	}
	public void setProductId(Long productId) {
		this.productId = productId;
	}
	public int getQuantity() {
		return quantity;
	}
	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}
	public String getCondition() {
		return condition;
	}
	public void setCondition(String condition) {
		this.condition = condition;
	}
	public String getItemReason() {
		return itemReason;
	}
	public void setItemReason(String itemReason) {
		this.itemReason = itemReason;
	}
    
}