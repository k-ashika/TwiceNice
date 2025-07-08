import { Product } from './product.model'; // make sure path is correct

export interface Review {
  id?: number;
  rating: number;
  comment: string;
  userId: number;
  userName?: string;
  verifiedPurchase?: boolean;
  product?: Product; 
  productId?: number; // ✅ Use full Product type here
}
