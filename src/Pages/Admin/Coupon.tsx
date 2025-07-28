import React, { useState } from "react";

import { UserReducerInitialState } from "@/types/reducer-types";
import { useSelector } from "react-redux";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { couponApi } from "@/redux/api/couponAPI";

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
  const [createCoupon] = couponApi.useCreateCouponMutation();

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
    <Card key={couponDetail._id} className="p-4">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="font-bold text-lg">{couponDetail.coupon}</h3>
          <p className="text-sm text-muted-foreground">
            Discount: ${couponDetail.amount}
          </p>
        </div>
        <Badge variant="outline" className="bg-green-50 text-green-700">
          Active
        </Badge>
      </div>
    </Card>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Create New Coupon</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={submitHandler} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="coupon" className="text-sm font-medium">
                Coupon Code
              </label>
              <Input
                id="coupon"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
                className="uppercase"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="amount" className="text-sm font-medium">
                Discount Amount ($)
              </label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter discount amount"
              />
            </div>
            <Button type="submit" className="w-full">
              Create Coupon
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Available Coupons</h2>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <>
              {data?.coupons && data.coupons.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {data.coupons.map(renderCouponCard)}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">
                  No coupons available
                </p>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Coupon;
