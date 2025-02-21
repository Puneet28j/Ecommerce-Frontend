import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { orderApi } from "../redux/api/orderAPI";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Order, OrderItem } from "../types/types";
import toast from "react-hot-toast";
import { Clipboard, ClipboardCheck } from "lucide-react";
import { LoadingSpinner, LoadingSpinner2 } from "../component/Loader";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";

// Memoized OrderItem component
const OrderItems = memo(
  ({
    order,
    isLast,
    lastOrderRef,
    copiedOrderId,
    onCopyOrderId,
  }: {
    order: Order;
    isLast: boolean;
    lastOrderRef: (node: HTMLDivElement | null) => void;
    copiedOrderId: string | null;
    onCopyOrderId: (orderId: string) => void;
  }) => {
    const getStatusStyle = (status: string) => {
      switch (status) {
        case "Delivered":
          return "bg-green-700";
        case "Shipped":
          return "bg-orange-500";
        case "Processing":
          return "bg-yellow-500";
        default:
          return "bg-purple-400";
      }
    };

    return (
      <AccordionItem
        ref={isLast ? lastOrderRef : null}
        value={order._id}
        className="border rounded-lg"
      >
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  className="object-cover w-full h-full rounded-full"
                  src={order?.user?.photo.replace(
                    "/upload/",
                    "/upload/c_fill,h_100,w_100,q_auto:low/"
                  )}
                  loading="lazy"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="text-left">
                <div className="text-sm font-semibold leading-tight">
                  {order.user.name}
                </div>
                <div className="text-xs font-light leading-tight">
                  {order?.user?.email}
                </div>
                <Badge
                  variant="outline"
                  className={`${getStatusStyle(order.status)} mt-1 text-xs`}
                >
                  {order.status}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-extrabold leading-tight">
                ₹ {order.total}
              </div>
              <div className="text-xs text-gray-500 leading-tight">
                {order.orderItems.length} items
              </div>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <OrderDetails
            order={order}
            copiedOrderId={copiedOrderId}
            onCopyOrderId={onCopyOrderId}
          />
        </AccordionContent>
      </AccordionItem>
    );
  }
);

// Memoized OrderDetails component
const OrderDetails = memo(
  ({
    order,
    copiedOrderId,
    onCopyOrderId,
  }: {
    order: Order;
    copiedOrderId: string | null;
    onCopyOrderId: (orderId: string) => void;
  }) => (
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
          {order.shippingInfo.address} {order.shippingInfo.state}
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

// Memoized OrderItemsList component
const OrderItemsList = memo(({ items }: { items: OrderItem[] }) => (
  <>
    <div className="text-sm font-extrabold">Order Items</div>
    {items.map((item) => (
      <div key={item._id} className="flex items-center gap-2 p-1 border-b">
        {item.productId && typeof item.productId === "object" && (
          <>
            <img
              src={item.productId.photo[0]?.url.replace(
                "/upload/",
                "/upload/c_fill,h_100,w_100,q_auto:low/"
              )}
              loading="lazy"
              alt={item.productId.name}
              className="w-12 h-12 object-cover rounded-sm"
            />
            <div>
              <div className="text-sm font-medium leading-tight">
                {item.productId.title}
              </div>
              <div className="text-xs text-gray-500 leading-tight">
                Quantity: {item.quantity}
              </div>
              <div className="text-xs text-gray-500 leading-tight">
                Price: ${item.productId.price}
              </div>
            </div>
          </>
        )}
      </div>
    ))}
  </>
));

const MyOrders = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  const { data, isLoading, isFetching } = orderApi.useMyOrdersQuery(
    { id: user?._id!, page, limit: 10 },
    { skip: !user?._id }
  );

  console.log(myOrders, "myOrders");
  console.log(data?.orders, "new orders");
  useEffect(() => {
    if (data?.orders) {
      setMyOrders((prevOrders) => {
        const newOrders = data.orders.filter(
          (order) =>
            !prevOrders.some((prevOrder) => prevOrder._id === order._id)
        );
        return [...prevOrders, ...newOrders];
      });
      setHasMore(data.orders.length > 0);
    }
  }, [data]);

  const handleCopyOrderId = useCallback((orderId: string) => {
    navigator.clipboard.writeText(orderId).then(() => {
      setCopiedOrderId(orderId);
      toast.success("OrderId copied");
      setTimeout(() => setCopiedOrderId(null), 2000);
    });
  }, []);

  const lastOrderRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading || isFetching || !node) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });

      observer.current.observe(node);
    },
    [isLoading, isFetching, hasMore]
  );

  if (isLoading) return <LoadingSpinner2 />;
  return (
    <div className="w-full px-4 py-6 relative font-primary">
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>
      <Accordion type="single" collapsible className="w-full space-y-2">
        {myOrders.map((order, index) => (
          <OrderItems
            key={order._id}
            order={order}
            isLast={index === myOrders.length - 1}
            lastOrderRef={lastOrderRef}
            copiedOrderId={copiedOrderId}
            onCopyOrderId={handleCopyOrderId}
          />
        ))}
      </Accordion>

      {/* Loader positioned at the bottom center */}
      {(isLoading || isFetching) && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
          <LoadingSpinner size={24} className="text-gray-500" />
        </div>
      )}

      {/* {!hasMore && myOrders.length > 0 && (
        <div className="text-center mt-3">No more orders to load</div>
      )} */}
    </div>
  );
};

export default MyOrders;
