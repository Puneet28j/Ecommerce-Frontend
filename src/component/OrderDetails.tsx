// src/component/OrderDetails.tsx
import React, { memo, useMemo } from "react";
import { Clipboard, ClipboardCheck } from "lucide-react";
import { Order } from "../types/types";
import OrderItemsList from "./OrderItemList";

/**
 * - memoized; only re-renders when order or copiedOrderId changes
 * - useMemo for derived values (orderDate)
 */

interface Props {
  order: Order;
  copiedOrderId: string | null;
  onCopyOrderId: (id: string) => void;
  showTax?: boolean;
}

const OrderDetails: React.FC<Props> = ({
  order,
  copiedOrderId,
  onCopyOrderId,
  showTax = false,
}) => {
  const orderDate = useMemo(
    () =>
      new Date(order.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    [order.createdAt]
  );

  return (
    <div className="space-y-2 pt-2">
      <div className="flex justify-between text-xs">
        <span className="text-gray-500">Order ID:</span>
        <div className="flex items-center">
          <span className="font-mono break-all" style={{ fontSize: 12 }}>
            {order._id}
          </span>
          <button
            onClick={() => onCopyOrderId(order._id)}
            className="ml-2"
            aria-label="Copy order id"
            type="button"
          >
            {copiedOrderId === order._id ? (
              <ClipboardCheck className="h-4 w-4 text-green-500" />
            ) : (
              <Clipboard className="h-4 w-4 text-gray-500" />
            )}
          </button>
        </div>
      </div>

      <div className="flex justify-between text-xs">
        <span className="text-gray-500">Date:</span>
        <span>{orderDate}</span>
      </div>

      <div className="flex justify-between text-xs">
        <span className="text-gray-500">Shipping Address:</span>
        <span className="text-right">
          {order.shippingInfo.address}, {order.shippingInfo.state}
        </span>
      </div>

      {showTax && (
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Tax:</span>
          <span>₹ {order.tax}</span>
        </div>
      )}

      <div className="flex justify-between text-xs">
        <span className="text-gray-500">Discount:</span>
        <span className={showTax ? "text-red-500" : ""}>
          ₹ {order.discount}
        </span>
      </div>

      <OrderItemsList items={order.orderItems} />
    </div>
  );
};

export default memo(OrderDetails, (prev, next) => {
  // re-render only if order id, copied state, or orderItems changed
  return (
    prev.order._id === next.order._id &&
    prev.copiedOrderId === next.copiedOrderId &&
    prev.order.orderItems.length === next.order.orderItems.length
  );
});
