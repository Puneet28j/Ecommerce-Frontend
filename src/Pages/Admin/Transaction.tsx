import { useSelector } from "react-redux";
import { Navigate, useParams, Link } from "react-router-dom";
import { RootState } from "../../redux/store";
import { useDemoOrderDetailsQuery } from "../../redux/api/demoAPI";
import { useOrderDetailsQuery, useUpdateOrderMutation } from "../../redux/api/orderAPI";
import { Order, OrderItem } from "../../types/types";
import { responseToast } from "../../utils/features";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ShoppingBag, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin, 
  ChevronLeft,
  Calendar
} from "lucide-react";
import toast from "react-hot-toast";
import { format } from "date-fns";

const Transaction = () => {
  const params = useParams();
  const { user } = useSelector((state: RootState) => state.userReducer);
  const { isDemoMode } = useSelector((state: RootState) => state.demo);

  // 1. Fetch data based on mode
  const { 
    data: demoData, 
    isLoading: demoLoading, 
    isError: demoError 
  } = useDemoOrderDetailsQuery(params.id!, { skip: !isDemoMode });

  const { 
    data: realData, 
    isLoading: realLoading, 
    isError: realError 
  } = useOrderDetailsQuery(params.id!, { skip: isDemoMode });

  const order = isDemoMode ? demoData?.order : realData?.order;
  const isLoading = isDemoMode ? demoLoading : realLoading;
  const isError = isDemoMode ? demoError : realError;

  // 2. Mutations (only for real mode)
  const [updateOrder] = useUpdateOrderMutation();

  const updateHandler = async (status: string) => {
    if (isDemoMode) {
      toast.error("This is a Read-Only Demo. Contact me for full admin access at puneet2862001j@gmail.com.");
      return;
    }

    const res = await updateOrder({
      userId: user?._id!,
      orderId: order?._id!,
      status,
    });
    responseToast(res, null, "");
  };

  // Status Badge Helper
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Processing": return "bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-900/50";
      case "Shipped": return "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900/50";
      case "Delivered": return "bg-green-100 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900/50";
      default: return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Processing": return <Clock className="w-3.5 h-3.5 mr-1.5" />;
      case "Shipped": return <Truck className="w-3.5 h-3.5 mr-1.5" />;
      case "Delivered": return <CheckCircle className="w-3.5 h-3.5 mr-1.5" />;
      default: return <ShoppingBag className="w-3.5 h-3.5 mr-1.5" />;
    }
  };

  if (isLoading) return <TransactionSkeleton />;
  if (isError) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
      <div className="p-4 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500">
        <ShoppingBag className="w-10 h-10" />
      </div>
      <h2 className="text-xl font-semibold text-foreground">Error loading order</h2>
      <p className="text-muted-foreground">Could not fetch details for this order.</p>
      <Button variant="outline" onClick={() => window.location.reload()}>Try Again</Button>
    </div>
  );
  if (!order) return <Navigate to="/admin/orders" />;

  const {
    shippingInfo,
    orderItems,
    user: orderUser,
    subTotal,
    tax,
    discount,
    shippingCharges,
    total,
    status,
    createdAt,
  } = order as Order & { createdAt?: string };

  const formattedDate = createdAt ? format(new Date(createdAt), "MMMM dd, yyyy") : "N/A";

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-7xl font-sans space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
           <div className="flex items-center gap-2 text-muted-foreground mb-1">
             <Link to="/admin/orders" className="hover:text-primary transition-colors flex items-center gap-1 text-sm font-medium">
               <ChevronLeft className="w-4 h-4" /> Back to Orders
             </Link>
           </div>
           <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
             Order #{order._id?.slice(-6).toUpperCase()}
           </h1>
           <div className="flex items-center gap-3 text-sm text-muted-foreground">
             <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {formattedDate}</span>
             <span className="h-1 w-1 rounded-full bg-muted-foreground/30"></span>
             <span>{orderItems.length} items</span>
           </div>
        </div>
        <div className="flex items-center gap-3">
           <Badge variant="outline" className={`${getStatusColor(status)} px-3 py-1.5 text-sm font-medium rounded-full uppercase tracking-wider`}>
              {getStatusIcon(status)} {status}
           </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/60 shadow-sm overflow-hidden bg-card">
            <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-primary" />
                Order Items
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {orderItems.map((i: OrderItem) => {
                  const photo = (i as any).photo || i.productId?.photoUrl;
                  return (
                    <div key={i._id} className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 gap-4 hover:bg-muted/30 transition-colors">
                      <div className="flex items-start gap-4 w-full">
                        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-border bg-muted/20">
                          <img
                            src={photo}
                            alt={i.name}
                            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <h4 className="font-medium text-foreground line-clamp-2 leading-relaxed">
                            <Link to={`/admin/product/${i.productId?._id || i.productId}`} className="hover:text-primary transition-colors">
                                {i.name}
                            </Link>
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            ID: <span className="font-mono text-xs ml-1">{i._id?.slice(-8)}</span>
                          </p>
                          <div className="flex items-center gap-2 mt-1 sm:hidden">
                             <Badge variant="secondary" className="text-xs font-normal">Qty: {i.quantity}</Badge>
                             <span className="font-semibold text-sm">₹{i.price}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right hidden sm:block">
                        <p className="font-semibold text-foreground">₹{i.price * i.quantity}</p>
                        <p className="text-sm text-muted-foreground mt-0.5">{i.quantity} x ₹{i.price}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 border-t border-border/50 p-4 flex justify-between items-center text-sm text-muted-foreground">
               <span>Total Items: {orderItems.reduce((acc, item) => acc + item.quantity, 0)}</span>
            </CardFooter>
          </Card>
        </div>

        {/* Right Column: Order Info & Actions */}
        <div className="space-y-6">
          
          {/* Order Status & Summary */}
          <Card className="border-border/60 shadow-sm bg-card">
            <CardHeader className="bg-muted/30 border-b border-border/50">
              <CardTitle className="text-base font-semibold">Order Status</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
               <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Update Status</label>
                <Select 
                  value={status} 
                  onValueChange={updateHandler}
                  disabled={status === "Delivered"}
                >
                   <SelectTrigger className="w-full h-11 bg-background border-input focus:ring-primary/20">
                    <SelectValue>
                      <div className="flex items-center gap-2">
                         {getStatusIcon(status)}
                         <span className={status === "Delivered" ? "text-green-600 dark:text-green-500 font-medium" : "text-foreground"}>
                           {status}
                         </span>
                      </div>
                    </SelectValue>
                   </SelectTrigger>
                   <SelectContent>
                      <SelectItem value="Processing">Processing</SelectItem>
                      <SelectItem value="Shipped">Shipped</SelectItem>
                      <SelectItem value="Delivered">Delivered</SelectItem>
                   </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground leading-relaxed">
                   {status === "Delivered" 
                     ? "This order has been delivered and cannot be modified." 
                     : "Updating status will notify the customer via email."}
                </p>
              </div>

               <Separator />

              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium text-foreground">₹{subTotal}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium text-foreground">₹{shippingCharges}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-medium text-foreground">₹{tax}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Discount</span>
                  <span className="text-red-500 font-medium">-₹{discount}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold text-foreground">Total</span>
                  <span className="text-xl font-bold text-primary">₹{total}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Info */}
          <Card className="border-border/60 shadow-sm bg-card">
            <CardHeader className="bg-muted/30 border-b border-border/50">
             <CardTitle className="text-base font-semibold">Customer Details</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-start gap-4">
                 <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg border border-primary/20">
                    {orderUser.name?.[0]?.toUpperCase()}
                 </div>
                 <div className="space-y-1">
                    <p className="font-semibold text-foreground">{orderUser.name}</p>
                    <p className="text-xs text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded w-fit">ID: {orderUser._id}</p>
                 </div>
              </div>

              <div className="space-y-4">
                 <div className="flex gap-3">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                    <div className="text-sm">
                       <p className="font-medium text-foreground">Shipping Address</p>
                       <p className="text-muted-foreground mt-1 leading-relaxed">
                          {shippingInfo.address}<br />
                          {shippingInfo.city}, {shippingInfo.state}<br />
                          {shippingInfo.country} - {shippingInfo.pinCode}
                       </p>
                    </div>
                 </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const TransactionSkeleton = () => (
  <div className="container mx-auto p-4 md:p-8 max-w-7xl space-y-6">
     <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-8 w-24 rounded-full" />
     </div>
     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
           <Skeleton className="h-[400px] w-full rounded-xl" />
        </div>
        <div className="space-y-6">
           <Skeleton className="h-[300px] w-full rounded-xl" />
           <Skeleton className="h-[200px] w-full rounded-xl" />
        </div>
     </div>
  </div>
);

export default Transaction;
