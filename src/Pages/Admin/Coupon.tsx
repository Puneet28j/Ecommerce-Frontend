import React, { useState } from "react";
import { useSelector } from "react-redux";
import { UserReducerInitialState } from "@/types/reducer-types";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { couponApi } from "@/redux/api/couponAPI";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

interface CouponDetail {
  _id: string;
  coupon: string;
  amount: number;
}

const Coupon = () => {
  const [couponCode, setCouponCode] = useState("");
  const [amount, setAmount] = useState("");

  const { user } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer
  );

  const { data, isLoading } = couponApi.useGetCouponsQuery(user?._id || "");
  const [createCoupon, { isLoading: isCreating }] =
    couponApi.useCreateCouponMutation();

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!couponCode || !amount) {
      toast.error("Please fill all fields");
      return;
    }

    if (!user?._id) {
      toast.error("User authentication required");
      return;
    }

    try {
      const response = await createCoupon({
        coupon: couponCode.toUpperCase(),
        amount: Number(amount),
        id: user._id,
      }).unwrap();

      if (response.success) {
        toast.success(response.message || "Coupon created successfully");
        setCouponCode("");
        setAmount("");
      }
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to create coupon");
    }
  };

  const renderCouponCard = (couponDetail: CouponDetail) => (
    <Card
      key={couponDetail._id}
      className="p-5 border shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="font-semibold text-lg tracking-tight">
            {couponDetail.coupon}
          </h3>
          <p className="text-sm text-muted-foreground">
            Save <span className="font-medium">${couponDetail.amount}</span>
          </p>
        </div>
        <Badge variant="secondary" className="bg-green-100 text-green-700">
          Active
        </Badge>
      </div>
    </Card>
  );

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
      {/* Coupon Creation */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            Create a New Coupon
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submitHandler} className="space-y-5">
            <div className="grid gap-2">
              <Label htmlFor="coupon">Coupon Code</Label>
              <Input
                id="coupon"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="e.g. SAVE20"
                className="uppercase"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount">Discount Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isCreating}>
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" /> Creating...
                </>
              ) : (
                "Create Coupon"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Coupons List */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Available Coupons</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="p-5">
                  <Skeleton className="h-5 w-24 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </Card>
              ))}
            </div>
          ) : data?.coupons && data.coupons.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {data.coupons.map(renderCouponCard)}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-6">
              No coupons available
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Coupon;
