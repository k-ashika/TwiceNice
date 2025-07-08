package com.twicenice.twicenice_backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "return_requests", 
uniqueConstraints = @UniqueConstraint(
    name = "unique_active_return", 
    columnNames = {"order_id", "status"}
))
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReturnRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;
    
    private Long userId;
    private String reason;
    private String status; 
    private LocalDateTime requestDate;
    private LocalDateTime processedDate;
    private String adminComments;
    @OneToMany(mappedBy = "returnRequest", cascade = CascadeType.ALL)
    private List<ReturnItem> items;
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Order getOrder() {
		return order;
	}
	public void setOrder(Order order) {
		this.order = order;
	}
	public Long getUserId() {
		return userId;
	}
	public void setUserId(Long userId) {
		this.userId = userId;
	}
	public String getReason() {
		return reason;
	}
	public void setReason(String reason) {
		this.reason = reason;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public LocalDateTime getRequestDate() {
		return requestDate;
	}
	public void setRequestDate(LocalDateTime requestDate) {
		this.requestDate = requestDate;
	}
	public LocalDateTime getProcessedDate() {
		return processedDate;
	}
	public void setProcessedDate(LocalDateTime processedDate) {
		this.processedDate = processedDate;
	}
	public String getAdminComments() {
		return adminComments;
	}
	public void setAdminComments(String adminComments) {
		this.adminComments = adminComments;
	}
	public List<ReturnItem> getItems() {
		return items;
	}
	public void setItems(List<ReturnItem> items) {
		this.items = items;
	}
	
    
}