import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { orderApi } from "../../redux/api/orderAPI";
import toast from "react-hot-toast";
import OrderItem from "./OrderItem";
import { Order } from "../../types/types";
import { Accordion } from "../../components/ui/accordion";

const MyOrder = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [hasMore, setHasMore] = useState(true);

  // Reset orders when user changes
  useEffect(() => {
    setMyOrders([]);
    setPage(1);
    setHasMore(true);
  }, [user?._id]);

  const { data, isLoading, isFetching } = orderApi.useMyOrdersQuery(
    { id: user?._id!, page, limit: 10 },
    { skip: !user?._id }
  );

  const observer = useRef<IntersectionObserver | null>(null);

  // Update orders when new data arrives
  useEffect(() => {
    if (data?.orders) {
      setMyOrders((prevOrders) => {
        const newOrders = data.orders.filter(
          (order: Order) =>
            !prevOrders.some((prevOrder) => prevOrder._id === order._id)
        );
        return [...prevOrders, ...newOrders];
      });

      if (data.pagination) {
        setHasMore(data.pagination.currentPage < data.pagination.totalPages);
      } else {
        setHasMore(data.orders.length > 0);
      }
    }
  }, [data]);

  // Copy order ID handler
  const handleCopyOrderId = useCallback((orderId: string) => {
    navigator.clipboard.writeText(orderId).then(() => {
      setCopiedOrderId(orderId);
      toast.success("OrderId copied");
      setTimeout(() => setCopiedOrderId(null), 2000);
    });
  }, []);

  // Intersection observer to trigger pagination
  const lastOrderRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading || isFetching || !node) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      observer.current.observe(node);
    },
    [isLoading, isFetching, hasMore]
  );

  // Show spinner if initial loading is in progress
  if (isLoading && page === 1) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="w-full px-2 sm:px-4 py-6 font-primary">
      <h2 className="text-xl font-bold p-4 pt-0">
        My Orders Summary ({myOrders.length})
      </h2>
      {myOrders.length === 0 && !isLoading && (
        <p className="text-center text-gray-500">No orders found.</p>
      )}
      <Accordion type="single" collapsible className="w-full space-y-2">
        {myOrders.map((order, index) => (
          <OrderItem
            key={order._id}
            order={order}
            isLast={index === myOrders.length - 1}
            lastOrderRef={lastOrderRef}
            copiedOrderId={copiedOrderId}
            onCopyOrderId={handleCopyOrderId}
          />
        ))}
      </Accordion>
      {isFetching && (
        <div className="flex justify-center mt-4">
          <Spinner />
        </div>
      )}
    </div>
  );
};

export default MyOrder;

// Simple Spinner Component
const Spinner = () => (
  <div className="w-10 h-10 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
);
