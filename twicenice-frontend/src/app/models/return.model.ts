// return.model.ts
export interface ReturnRequest {
  id: number;
  orderId: number;
  userId: number;
  reason: string;
  status: string;
  requestDate: string;
  processedDate?: string;
  adminComments?: string;
  items: ReturnItem[];
  productImageUrl?: string;
}

export interface ReturnItem {
  productId: number;
  quantity: number;
  reason: string;
  condition?: string;
}