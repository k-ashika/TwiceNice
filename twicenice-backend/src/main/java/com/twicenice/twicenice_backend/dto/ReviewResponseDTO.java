package com.twicenice.twicenice_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

public class ReviewResponseDTO {
    private Long id;
    private int rating;
    private String comment;
    private String userName;
    private boolean verifiedPurchase;
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public int getRating() {
		return rating;
	}
	public void setRating(int rating) {
		this.rating = rating;
	}
	public String getComment() {
		return comment;
	}
	public void setComment(String comment) {
		this.comment = comment;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public boolean isVerifiedPurchase() {
		return verifiedPurchase;
	}
	public void setVerifiedPurchase(boolean verifiedPurchase) {
		this.verifiedPurchase = verifiedPurchase;
	}
	public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private int rating;
        private String comment;
        private String userName;
        private boolean verifiedPurchase;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder rating(int rating) {
            this.rating = rating;
            return this;
        }
        public ReviewResponseDTO build() {
            ReviewResponseDTO dto = new ReviewResponseDTO();
            dto.setId(id);
            dto.setRating(rating);
            dto.setComment(comment);
            dto.setUserName(userName);
            dto.setVerifiedPurchase(verifiedPurchase);
            return dto;
        }
    }
}