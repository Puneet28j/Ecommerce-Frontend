import { memo } from "react";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";
import { Badge } from "../../components/ui/badge";
import { Card } from "../../components/ui/card";
import { Order } from "../../types/types";
import OrderDetails from "./OrderDetails";

interface OrderItemProps {
  order: Order;
  isLast: boolean;
  lastOrderRef: (node: HTMLDivElement | null) => void;
  copiedOrderId: string | null;
  onCopyOrderId: (orderId: string) => void;
}

const OrderItem = memo(
  ({
    order,
    isLast,
    lastOrderRef,
    copiedOrderId,
    onCopyOrderId,
  }: OrderItemProps) => {
    // const [isOpen, setIsOpen] = useState(false);

    const getStatusStyle = (status: string) => {
      const statusMap: Record<string, string> = {
        Delivered: "bg-green-700",
        Shipped: "bg-orange-700",
        Processing: "bg-yellow-700",
      };
      return statusMap[status] || "bg-purple-400";
    };
    const visibleItems = order.orderItems.slice(0, 4);
    const remaining = Math.max(order.orderItems.length - 4, 0);
    return (
      <Card className="border-none">
        <AccordionItem
          value={order._id}
          ref={isLast ? lastOrderRef : null}
          className="border-none"
        >
          <AccordionTrigger className="hover:no-underline ">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <div className="relative flex gap-1">
                  {visibleItems.map(
                    (item, index) =>
                      item.productId &&
                      typeof item.productId === "object" && (
                        <img
                          key={item._id}
                          src={item.productId.photo[0]?.url}
                          alt={item.name}
                          className={`w-20 h-20 object-cover rounded-full border-2 overflow-hidden ${
                            index > 0 ? "-ml-6" : ""
                          }`} // Stack effect
                          style={{
                            zIndex: order.orderItems.length - index,
                          }}
                        />
                      )
                  )}
                  {remaining > 0 && (
                    <div
                      className="w-20 h-20 rounded-full -ml-6 flex items-center justify-center bg-slate-300  border-2 text-xs font-semibold"
                      style={{
                        zIndex: order.orderItems.length + 1, // Ensure it's always on top
                      }}
                    >
                      +{remaining}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <h3 className="text-sm font-semibold ">
                  Order #{order._id.slice(-6)}
                </h3>
                <div className="text-xl font-extrabold">₹ {order.total}</div>
                <div className="text-xs font-thin">(Incl. of all taxes)</div>
                <Badge
                  variant="outline"
                  className={`${getStatusStyle(order.status)}`}
                >
                  {order.status}
                </Badge>
              </div>
            </div>
          </AccordionTrigger>

          {/* Accordion - Order Details Section */}
          <AccordionContent>
            <OrderDetails
              order={order}
              copiedOrderId={copiedOrderId}
              onCopyOrderId={onCopyOrderId}
            />
          </AccordionContent>
        </AccordionItem>
      </Card>
    );
  }
);

export default OrderItem;
