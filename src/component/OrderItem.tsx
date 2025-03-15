import { memo } from "react";
import { Order } from "../types/types";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
// import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { OrderDetails } from "./OrderDetails";
import { Card } from "../components/ui/card";

interface OrderItemProps {
  order: Order;
  isLast: boolean;
  lastOrderRef: (node: HTMLDivElement | null) => void;
  copiedOrderId: string | null;
  onCopyOrderId: (orderId: string) => void;
}

export const OrderItem = memo(
  ({
    order,
    isLast,
    lastOrderRef,
    copiedOrderId,
    onCopyOrderId,
  }: OrderItemProps) => {
    const getStatusStyle = (status: string) => {
      const statusMap: Record<string, string> = {
        Delivered: "bg-green-700",
        Shipped: "bg-orange-700",
        Processing: "bg-yellow-700",
      };
      return statusMap[status] || "bg-purple-400";
    };

    const visibleItems = order.orderItems.slice(0, 3);
    const remaining = Math.max(order.orderItems.length - 3, 0);

    return (
      <Card className="border-none">
        <AccordionItem
          value={order._id}
          ref={isLast ? lastOrderRef : null}
          className="border-none"
        >
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <div className="relative flex gap-1">
                  {visibleItems.map(
                    (item, index) =>
                      item.productId &&
                      typeof item.productId === "object" && (
                        <img
                          key={item._id}
                          src={item.productId.photoUrl}
                          alt={item.name}
                          className={`w-20 h-20 object-cover rounded-full border-2 overflow-hidden ${
                            index > 0 ? "-ml-6" : ""
                          }`}
                          style={{ zIndex: order.orderItems.length - index }}
                        />
                      )
                  )}
                  {remaining > 0 && (
                    <div
                      className="flex justify-center items-center text-xs"
                      style={{ zIndex: order.orderItems.length + 1 }}
                    >
                      +{remaining}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <h3 className="text-sm font-semibold">
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
          <AccordionContent>
            <OrderDetails
              order={order}
              copiedOrderId={copiedOrderId}
              onCopyOrderId={onCopyOrderId}
              showTax
            />
          </AccordionContent>
        </AccordionItem>
      </Card>
    );
  }
);
