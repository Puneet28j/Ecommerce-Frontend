import { Badge } from "@/components/ui/badge";
import { CouponCard } from "./CouponCard";

interface CouponSectionProps {
  couponCode: string;
  isValidCouponCode: boolean;
  applyCouponFromCard: (code: string) => void;
  CouponData: {
    coupons: {
      _id: string;
      coupon: string;
      amount: number;
    }[];
  };
}

const CouponSection = ({
  isValidCouponCode,
  applyCouponFromCard,
  couponCode,
  CouponData,
}: CouponSectionProps) => {
  return (
    <div className="px-4 py-4 sm:py-6">
      <div className="mb-3 sm:mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            Available Offers
          </h2>
          <Badge
            variant="outline"
            className="text-[10px] sm:text-xs border-green-200 text-green-700 bg-green-50"
          >
            {CouponData.coupons.length} Active
          </Badge>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Click to apply and save on your order
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3">
        {[...CouponData.coupons]
          .sort((a, b) => b.amount - a.amount)
          .slice(0, 5)
          .map((coupon, index) => (
            <CouponCard
              key={coupon._id}
              coupon={coupon}
              index={index}
              onApply={applyCouponFromCard}
              isApplied={couponCode === coupon.coupon && isValidCouponCode}
            />
          ))}
      </div>

      {CouponData.coupons.length > 5 && (
        <div className="text-center mt-3">
          <button className="text-xs sm:text-sm text-green-600 hover:text-green-700 font-medium transition-colors">
            View {CouponData.coupons.length - 5} more offers →
          </button>
        </div>
      )}
    </div>
  );
};

export default CouponSection;
