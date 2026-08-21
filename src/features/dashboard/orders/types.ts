export interface DashboardOrderItem {
  title?: string;
  image?: string | null;
  quantity?: number;
  unit_price?: number;
  total_price?: number;
}

export interface DashboardOrderRefund {
  _id?: string;
  refundType?: string;
  status?: string;
  refundAmount?: number;
  adminNote?: string;
  stripeRefundId?: string;
}

export interface DashboardOrder {
  _id: string;
  order_id?: string;
  status?: string;
  payment_status?: string;
  total_items?: number;
  formatted_address?: string;
  contact_number?: string;
  createdAt?: string;
  updatedAt?: string;
  payment_intent_id?: string;
  transaction_id?: string;
  coupon?: string;
  discount_percentage?: number;
  discount_amount?: number;
  user?: {
    _id?: string;
    name?: string;
    email?: string;
    image?: string | null;
  };
  items?: DashboardOrderItem[];
  price_breakdown?: {
    products_price?: number;
    serviceFee?: number;
    delivery_charge?: number;
    discount_amount?: number;
    tax?: number;
    total_price?: number;
    subtotal?: number;
  };
  address_breakdown?: {
    city?: string;
    postal_code?: string;
    street_address?: string;
    country?: string;
    contact_number?: string;
    coupon?: string;
  };
  refund?: DashboardOrderRefund;
}
