import {
  Bar,
  CartItem,
  Line,
  Order,
  Pie,
  Product,
  ShippingInfo,
  Stats,
  User,
} from "./types";

export type CustomError = {
  status: number;
  data: {
    message: string;
    success: boolean;
  };
};
export type MessageResponse = {
  message: string;
  success: boolean;
  user: User;
};
export type AllUsersResponse = {
  users: User[];
  success: boolean;
};
export type UserResponse = {
  user: User;
  success: boolean;
};

export type AllProductsResponse = {
  success: boolean;
  products: Product[];
};

export type CategoriesResponse = {
  success: boolean;
  categories: string[];
};
export type SearchProductsResponse = AllProductsResponse & {
  pagination: {
    totalOrders: number;
    currentPage: number;
    totalPages: number;
    limit: number;
  };
};

export type ProductDetailsResponse = {
  success: boolean;
  product: Product;
};

export type ProductResponse = {
  success: boolean;
  product: Product;
};
export type AllOrdersResponse = {
  success: boolean;
  orders: Order[];
  pagination: {
    totalPages: number;
    totalOrders: number;
    currentPage: number;
  };
};

export type OrderDetailsResponse = {
  success: boolean;
  order: Order;
};
export type StatsResponse = {
  success: boolean;
  stats: Stats;
};
export type PieResponse = {
  success: boolean;
  charts: Pie;
};
export type BarResponse = {
  success: boolean;
  charts: Bar;
};
export type LineResponse = {
  success: boolean;
  charts: Line;
};
export type SearchProductsQuery = {
  price: string;
  page: number;
  category: string;
  search: string;
  sort: string;
};
export type NewProductRequest = {
  id: string;
  formData: FormData;
};
export interface UpdateProductRequest {
  formData: FormData;
  userId: string;
  productId: string;
}
export type DeleteUserRequest = {
  userId: string;
  adminUserId: string;
};
export type DeleteProductRequest = {
  userId: string;
  productId: string;
};
export type UpdateProductReview = {
  userId: string;
  productId: string;
  rating: number;
  comment?: string;
};

export interface RateProductRequest {
  productId: string;
  userId: string;
  rating: number;
  comment?: string;
  user: {
    name: string;
    photo: string;
  };
}

export type NewOrderRequest = {
  shippingInfo: ShippingInfo;
  orderItems: CartItem[];
  subTotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  user: string;
};
export type UpdateOrderRequest = {
  userId: string;
  orderId: string;
};

export interface ExistingPhoto {
  url: string;
  public_id: string;
}
