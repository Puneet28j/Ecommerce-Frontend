// src/components/common/Order/OrderItemsList.tsx
import { memo } from "react";
import { OrderItem } from "../types/types";

interface OrderItemsListProps {
  items: OrderItem[];
}

const OrderItemsList = memo(({ items }: OrderItemsListProps) => (
  <>
    <div className="text-sm font-extrabold">Order Items</div>
    {items.map((item) => {
      if (!item.productId || typeof item.productId !== "object") return null;
      return (
        <div key={item._id} className="flex items-center gap-2 p-1 border-b">
          <img
            src={item?.productId?.photoUrl?.replace(
              "/upload/",
              "/upload/c_fill,h_100,w_100,q_auto:low/"
            )}
            loading="lazy"
            alt={item.productId.name}
            className="w-12 h-12 object-cover rounded-sm"
          />
          <div>
            <div className="text-sm font-medium leading-tight">
              {item.productId.name}
            </div>
            <div className="text-xs text-gray-500 leading-tight">
              Quantity: {item.quantity}
            </div>
            <div className="text-xs text-gray-500 leading-tight">
              Price: ${item.productId.price}
            </div>
          </div>
        </div>
      );
    })}
  </>
));
export default OrderItemsList;
