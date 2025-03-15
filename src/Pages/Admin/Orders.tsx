// import { useCallback, useRef, useState } from "react";
// import { useSelector } from "react-redux";
// import { RootState } from "../../redux/store";
// import { orderApi } from "../../redux/api/orderAPI";
// import { Accordion } from "../../components/ui/accordion";
// import { useCopyOrderId, useOrderPagination } from "../../lib/hooks";
// import { Order } from "../../types/types";
// import { OrderItem } from "../../component/OrderItem";
// import { LoadingSpinner } from "../../component/Loader";

// const Orders = () => {
//   const { user } = useSelector((state: RootState) => state.userReducer);
//   const { copiedOrderId, handleCopyOrderId } = useCopyOrderId();
//   const [page, setPage] = useState(1);
//   const [allOrders, setAllOrders] = useState<Order[]>([]);
//   const [hasMore, setHasMore] = useState(true);
//   const observer = useRef<IntersectionObserver | null>(null);

//   // const queryResult = orderApi.useMyOrdersQuery(
//   //   { id: user?._id!, page, limit: 10 },
//   //   { skip: !user?._id }
//   // );

//   const { isLoading, isFetching } = useOrderPagination(
//     queryResult,
//     page,
//     setPage,
//     allOrders,
//     setAllOrders,
//     hasMore,
//     setHasMore
//   );

//   const lastOrderRef = useCallback(
//     (node: HTMLDivElement | null) => {
//       if (isLoading || isFetching || !node) return;
//       if (observer.current) observer.current.disconnect();

//       observer.current = new IntersectionObserver((entries) => {
//         if (entries[0].isIntersecting && hasMore) {
//           setPage((prev) => prev + 1);
//         }
//       });

//       observer.current.observe(node);
//     },
//     [isLoading, isFetching, hasMore]
//   );

//   if (isLoading && page === 1) {
//     return (
//       <div className="flex items-center justify-center h-full">
//         <LoadingSpinner />
//       </div>
//     );
//   }
//   return (
//     <div className="w-full px-4 py-6 relative font-primary">
//       <h2 className="text-2xl font-bold mb-6">Orders</h2>
//       <Accordion type="single" collapsible className="w-full space-y-2">
//         {allOrders.map((order, index) => (
//           <OrderItem
//             key={order._id}
//             order={order}
//             isLast={index === allOrders.length - 1}
//             lastOrderRef={lastOrderRef}
//             copiedOrderId={copiedOrderId}
//             onCopyOrderId={handleCopyOrderId}
//             variant="admin"
//           />
//         ))}
//       </Accordion>

//       {isFetching && (
//         <div className="flex justify-center mt-4">
//           <LoadingSpinner />
//         </div>
//       )}
//     </div>
//   );
// };

// export default Orders;
