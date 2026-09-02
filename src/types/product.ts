export const PRODUCT_BADGES = [
  "Best Sellers",
  "New Releases",
  "Trending Products",
  "Accessories",
] as const;

export type ProductBadge = (typeof PRODUCT_BADGES)[number];

export interface ProductReview {
  id: string;
  user: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedPurchase?: boolean;
}

export interface Product {
  id: string;
  title: string;
  author: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  imageKey?: string;
  images?: string[];
  category: string;
  rating?: number;
  reviewsCount?: number;
  inStock?: boolean;
  stockCount?: number;
  badge?: string;
  format?: ("Hardcover" | "Paperback" | "E-Book" | "Audiobook")[];
  pages?: number;
  publisher?: string;
  publishedDate?: string;
  isbn?: string;
  language?: string;
  dimensions?: string;
  description?: string;
  synopsis?: string;
  authorBio?: string;
  features?: string[];
  reviews?: ProductReview[];
}
