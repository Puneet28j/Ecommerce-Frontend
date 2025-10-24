// src/component/OrderItem.tsx
import React, { memo, useMemo, forwardRef } from "react";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../components/ui/accordion";
import { Badge } from "../components/ui/badge";
import OrderDetails from "./OrderDetails";
import { Card } from "../components/ui/card";
import { Order } from "../types/types";

type Props = {
  order: Order;
  isLast?: boolean;
  lastOrderRef?: (node: HTMLDivElement | null) => void;
  copiedOrderId: string | null;
  onCopyOrderId: (id: string) => void;
};

const statusMap: Record<string, string> = {
  Delivered: "bg-green-700",
  Shipped: "bg-orange-700",
  Processing: "bg-yellow-700",
};

const OrderItem = forwardRef<HTMLDivElement, Props>(
  ({ order, lastOrderRef, copiedOrderId, onCopyOrderId }, ref) => {
    // ✅ Merge forwarded ref and lastOrderRef safely
    const setRefs = (node: HTMLDivElement | null) => {
      if (typeof ref === "function") ref(node);
      else if (ref)
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      if (lastOrderRef) lastOrderRef(node);
    };

    const statusClass = useMemo(
      () => statusMap[order.status] ?? "bg-purple-400",
      [order.status]
    );

    const visibleItems = useMemo(
      () => order.orderItems.slice(0, 3),
      [order.orderItems]
    );
    const remaining = Math.max(order.orderItems.length - 3, 0);
    const shortId = useMemo(() => order._id.slice(-6), [order._id]);

    return (
      <Card className="border-none">
        <div ref={setRefs}>
          <AccordionItem value={order._id} className="border-none">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <div className="relative flex gap-1">
                    {visibleItems.map((item, idx) => {
                      if (!item.productId || typeof item.productId !== "object")
                        return null;
                      const photo = item.productId.photoUrl;
                      const thumb =
                        photo?.replace?.(
                          "/upload/",
                          "/upload/c_fill,h_80,w_80,q_auto:low/"
                        ) ?? photo;

                      return (
                        <img
                          key={item._id}
                          src={thumb}
                          alt={item.name}
                          loading="lazy"
                          width={80}
                          height={80}
                          className={`w-20 h-20 object-cover rounded-full border-2 overflow-hidden ${
                            idx > 0 ? "-ml-6" : ""
                          }`}
                          style={{ zIndex: order.orderItems.length - idx }}
                          draggable={false}
                        />
                      );
                    })}

                    {remaining > 0 && (
                      <div
                        aria-hidden
                        className="flex justify-center items-center text-xs w-10 h-10 rounded-full bg-muted"
                        style={{
                          zIndex: order.orderItems.length + 1,
                          marginLeft: -12,
                        }}
                      >
                        +{remaining}
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <h3 className="text-sm font-semibold">Order #{shortId}</h3>
                  <div className="text-xl font-extrabold">₹ {order.total}</div>
                  <div className="text-xs font-thin">(Incl. of all taxes)</div>
                  <Badge variant="outline" className={statusClass}>
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
        </div>
      </Card>
    );
  }
);

// ✅ Efficient memo comparator
const areEqual = (prev: Props, next: Props) => {
  return (
    prev.order._id === next.order._id &&
    prev.order.total === next.order.total &&
    prev.order.status === next.order.status &&
    prev.copiedOrderId === next.copiedOrderId
  );
};

export default memo(OrderItem, areEqual);
