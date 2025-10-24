// src/component/OrderItemList.tsx
import React, { memo } from "react";
import { OrderItem as OrderItemType } from "../types/types";

/**
 * - memoized list of items
 * - each image uses width/height to avoid layout shift
 */

interface Props {
  items: OrderItemType[];
}

const OrderItemsList: React.FC<Props> = ({ items }) => {
  return (
    <>
      <div className="text-sm font-extrabold mt-2">Order Items</div>
      {items.map((item) => {
        if (!item.productId || typeof item.productId !== "object") return null;
        const thumb = item.productId.photoUrl?.replace?.(
          "/upload/",
          "/upload/c_fill,h_100,w_100,q_auto:low/"
        );
        return (
          <div key={item._id} className="flex items-center gap-2 p-1 border-b">
            <img
              src={thumb}
              alt={item.productId.name}
              loading="lazy"
              width={64}
              height={64}
              className="w-12 h-12 object-cover rounded-sm"
              draggable={false}
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">
                {item.productId.name}
              </div>
              <div className="text-xs text-gray-500">
                Quantity: {item.quantity}
              </div>
              <div className="text-xs text-gray-500">
                Price: ₹ {item.productId.price}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default memo(OrderItemsList);
