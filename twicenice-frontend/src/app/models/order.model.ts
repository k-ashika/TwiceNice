import { OrderItem } from "./order-item.model";

export interface Order {
  id: number;
  userId: number;
  totalPrice: number;
  status: string;
  createdAt: string; // or Date if you're using Date objects
  items: OrderItem[];
  isReturnable?: boolean; // Add this
  returnWindowEnd?: string; // Add this if needed
}
