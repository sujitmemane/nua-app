/** Snapshot of a product as stored in the client-side cart. */
export interface CartItem {
  productId: number;
  title: string;
  thumbnail: string;
  price: number;
  discountPercentage: number;
  quantity: number;
}
