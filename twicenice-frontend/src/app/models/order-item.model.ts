export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  imageUrl: string; // ✅ Add this line
  sku?: string;
}
