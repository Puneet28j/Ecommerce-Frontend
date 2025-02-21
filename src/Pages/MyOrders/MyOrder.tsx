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

  const { data, isLoading, isFetching } = orderApi.useMyOrdersQuery(
    { id: user?._id!, page, limit: 10 },
    { skip: !user?._id }
  );
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (data?.orders) {
      setMyOrders((prevOrders) => [
        ...prevOrders,
        ...data.orders.filter(
          (order: { _id: any }) =>
            !prevOrders.some((prevOrder) => prevOrder._id === order._id)
        ),
      ]);
      // Use pagination info from the backend if available:
      if (data.pagination) {
        setHasMore(data.pagination.currentPage < data.pagination.totalPages);
      } else {
        // Fallback logic if pagination info is not provided
        setHasMore(data.orders.length > 0);
      }
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
        if (entries[0].isIntersecting && hasMore) setPage((prev) => prev + 1);
      });

      observer.current.observe(node);
    },
    [isLoading, isFetching, hasMore]
  );

  if (isLoading)
    return (
      <div className="flex items-center">
        <Spinner />
      </div>
    );

  return (
    <div className="w-full px-2  sm:px-4 py-6 relative  font-primary">
      <div>{myOrders.length}</div>
      <h2 className="text-xl font-bold p-4 pt-0">My Orders Summary</h2>
      <Accordion type="single" collapsible className="w-full space-y-2">
        {myOrders.length > 0 &&
          myOrders.map((order, index) => (
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
    </div>
  );
};

export default MyOrder;

const Spinner = () => {
  return (
    <div className="w-10 h-10 border-4 border-gray-300 border-t-gray-600  rounded-full animate-spin"></div>
  );
};
