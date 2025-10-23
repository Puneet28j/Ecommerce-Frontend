import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CouponInputProps } from "@/types/types";
import { VscError } from "react-icons/vsc";

export const CouponInput: React.FC<CouponInputProps> = ({
  couponCode,
  handleCouponChange,
  isValidCouponCode,
  discount,
}) => (
  <div className="mt-4">
    <label className="text-sm font-medium text-gray-700 mb-2 block">
      Have a coupon code?
    </label>
    <Input
      type="text"
      placeholder="Enter coupon code"
      value={couponCode.toUpperCase()}
      onChange={(e) => handleCouponChange(e.target.value)}
      className="w-full md:w-1/2 lg:w-1/3"
    />
    {couponCode && (
      <div className="mt-2 text-sm flex items-center" aria-live="polite">
        {isValidCouponCode ? (
          <Badge className="bg-green-500 text-white hover:bg-green-600">
            ✓ ₹{discount} off applied with{" "}
            <span className="ml-1 font-bold">{couponCode}</span>
          </Badge>
        ) : (
          <span className="text-red-500 flex items-center">
            <VscError className="mr-1" /> Invalid coupon code
          </span>
        )}
      </div>
    )}
  </div>
);
