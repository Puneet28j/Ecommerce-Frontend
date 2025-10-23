import { CouponInput } from "@/component/Coupon/CouponInput";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckoutSummaryProps } from "@/types/types";
import { useNavigate } from "react-router-dom";
import CartPriceDetail from "./CartPriceDetail";

const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({
  subTotal,
  shippingCharges,
  tax,
  discount,
  total,
  cartItems,
  isValidCouponCode,
  couponCode,
  handleCouponChange,
}) => {
  const navigate = useNavigate();
  return (
    <Card className=" shadow-lg rounded-lg  p-4 m-4 w-full">
      <h2 className="text-lg font-semibold  mb-4">Order Summary</h2>
      <CartPriceDetail label="Subtotal" value={subTotal} />
      <CartPriceDetail label="Shipping Charges" value={shippingCharges} />
      <CartPriceDetail label="Tax" value={tax} />
      <CartPriceDetail label="Discount" value={discount} isDiscount />
      <hr className="my-3 " />
      <CartPriceDetail label="Total" value={total} />
      <CouponInput
        couponCode={couponCode}
        handleCouponChange={handleCouponChange}
        isValidCouponCode={isValidCouponCode}
        discount={discount}
      />
      {cartItems.length > 0 && (
        <Button onClick={() => navigate("/shipping")} className="w-full mt-4">
          Proceed to Checkout
        </Button>
      )}
    </Card>
  );
};

export default CheckoutSummary;
