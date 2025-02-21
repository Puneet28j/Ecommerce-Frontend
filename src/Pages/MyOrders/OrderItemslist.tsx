import { memo } from "react";
import { OrderItem } from "../../types/types";

interface OrderItemsListProps {
  items: OrderItem[];
}

const OrderItemsList = memo(({ items }: OrderItemsListProps) => (
  <>
    <div className="text-sm font-extrabold">Order Items</div>
    {items.map((item) => (
      <div key={item._id} className="flex items-center gap-2 p-1 ">
        {item.productId && typeof item.productId === "object" && (
          <>
            <img
              src={item.productId.photo[0]?.url.replace(
                "/upload/",
                "/upload/c_fill,h_100,w_100,q_auto:low/"
              )}
              alt={item.productId.name}
              className="w-12 h-12 object-cover rounded-sm"
            />
            <div>
              <div className="text-sm font-medium">{item.productId.name}</div>
              <div className="text-xs text-gray-500">
                Quantity: {item.quantity}
              </div>
              <div className="text-xs text-gray-500">
                Price: ${item.productId.price}
              </div>
            </div>
          </>
        )}
      </div>
    ))}
  </>
));

export default OrderItemsList;
