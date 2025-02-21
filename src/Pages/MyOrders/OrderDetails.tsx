import { memo } from "react";
import { Clipboard, ClipboardCheck } from "lucide-react";
import { Order } from "../../types/types";
import OrderItemsList from "./OrderItemslist";

interface OrderDetailsProps {
  order: Order;
  copiedOrderId: string | null;
  onCopyOrderId: (orderId: string) => void;
}

const OrderDetails = memo(
  ({ order, copiedOrderId, onCopyOrderId }: OrderDetailsProps) => (
    <div className="space-y-2 pt-2">
      <div className="flex justify-between text-xs">
        <span className="text-gray-500">Order ID:</span>
        <div className="flex items-center">
          <span className="font-mono">{order._id}</span>
          <button onClick={() => onCopyOrderId(order._id)} className="ml-1">
            {copiedOrderId === order._id ? (
              <ClipboardCheck className="h-3 w-3 text-green-500" />
            ) : (
              <Clipboard className="h-3 w-3 text-gray-500" />
            )}
          </button>
        </div>
      </div>
      <div className="flex justify-between text-xs">
        <span className="text-gray-500">Date:</span>
        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
      </div>
      <div className="flex justify-between text-xs">
        <span className="text-gray-500">Shipping Address:</span>
        <span>
          {order.shippingInfo.address}, {order.shippingInfo.state}
        </span>
      </div>

      <div className="flex justify-between text-xs">
        <span className="text-gray-500">Tax:</span>
        <span>${order.tax}</span>
      </div>
      <div className="flex justify-between text-xs">
        <span className="text-gray-500">Discount:</span>
        <span className="text-red-500">- ${order.discount}</span>
      </div>
      <OrderItemsList items={order.orderItems} />
    </div>
  )
);

export default OrderDetails;
