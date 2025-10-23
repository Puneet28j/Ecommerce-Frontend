export type User = {
  name: string;
  password?: string;
  email: string;
  photo: string;
  gender?: string;
  role?: string;
  dob?: string;
  _id: string;
  token?: string;
};

type RatingValue = 1 | 2 | 3 | 4 | 5;

export type RatingsBreakdown = Record<RatingValue, number>;

export type Product = {
  name: string;
  price: number;
  stock: number;
  category: string;
  description: string;
  createdAt: Date;
  photo: [
    {
      url: string;
      public_id: string;
    }
  ];
  averageRating: number;
  reviewCount: number;
  ratingsBreakdown: RatingsBreakdown;

  _id: string;
};

export type RateProductResponse = {
  userId: string;
  productId: string;
  rating: number;
  comment: string;
  user: {
    name: string;
    photo: string;
  };
};

export type ShippingInfo = {
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
};

export type CartItem = {
  productId: string;
  photo: {
    url: string;
    public_id: string;
  }[];

  name: string;
  price: number;
  quantity: number;
  stock: number;
};

export type OrderItem = {
  productId: {
    photoUrl: string;
    name: string;
    price: number;
    quantity: number;
    stock: number;
    _id: string;
  };

  name: string;
  price: number;
  quantity: number;
  stock: number;
  _id: string;
};
// export type OrderItem = Omit<CartItem, "stock"> & { _id: string };

export type Order = {
  orderItems: OrderItem[];
  shippingInfo: ShippingInfo;
  subTotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  status: string;
  user: { name: string; _id: string; photo: string; email: string };
  _id: string;
  createdAt: Date;
};

type CountAndChange = {
  revenue: {
    total: number;
    lastMonth: number;
    thisMonth: number;
  };
  product: {
    total: number;
    lastMonth: number;
    thisMonth: number;
  };
  user: {
    total: number;
    lastMonth: number;
    thisMonth: number;
  };
  order: {
    total: number;
    lastMonth: number;
    thisMonth: number;
  };
};

type LatestTransaction = {
  _id: string;
  discount: number;
  amount: number;
  quantity: number;
  status: string;
};

type ChangePercent = {
  revenue: number;
  product: number;
  user: number;
  order: number;
};
export type Stats = {
  categoryCount: Record<string, number>[];
  changePercent: ChangePercent;
  count: CountAndChange;
  chart: {
    order: number[];
    revenue: number[];
  };
  userRatio: {
    male: number;
    female: number;
  };
  latestTransaction: LatestTransaction[];
};
export type Pie = {
  orderFullfillment: {
    processing: number;
    shipped: number;
    delivered: number;
  };
  productCategories: Record<string, number>[];
  stockAvailability: {
    inStock: number;
    outofStock: number;
  };
  revenueDistribution: {
    netMargin: number;
    discount: number;
    productionCost: number;
    burnt: number;
    marketingCost: number;
  };
  usersAgeGroup: {
    teen: number;
    adult: number;
    old: number;
  };
  adminCustomer: {
    admin: number;
    customer: number;
  };
};

export type Bar = {
  users: number[];
  products: number[];
  orders: number[];
};
export type Line = {
  users: number[];
  products: number[];
  discount: number[];
  revenue: number[];
};

// components/reviews/types.ts
export interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
    photo?: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ReviewsResponse {
  reviews: Review[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CouponDetail {
  _id: string;
  coupon: string;
  amount: number;
}

export interface CheckoutSummaryProps {
  subTotal: number;
  shippingCharges: number;
  tax: number;
  discount: number;
  total: number;
  cartItems: any[];
  isValidCouponCode: boolean;
  couponCode: string;
  handleCouponChange: (value: string) => void;
}

export interface CouponInputProps {
  couponCode: string;
  handleCouponChange: (value: string) => void;
  isValidCouponCode: boolean;
  discount: number;
}
