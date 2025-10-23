import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Copy, IndianRupeeIcon, Sparkles } from "lucide-react";
import { useState } from "react";

interface CouponDetail {
  coupon: string;
  amount: number;
}

interface CouponCardProps {
  coupon: CouponDetail;
  index: number;
  onApply: (code: string) => void;
  isApplied: boolean;
}

export const CouponCard: React.FC<CouponCardProps> = ({
  coupon,
  index,
  onApply,
  isApplied,
}) => {
  const [copied, setCopied] = useState(false);
  const isTopDeal = index === 0 && !isApplied;

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(coupon.coupon);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative overflow-hidden drop-shadow-lg  rounded-xl">
      {/* SVG Mask for transparent cutouts */}
      <svg className="absolute  inset-0 w-full h-full z-[1] pointer-events-none">
        <defs>
          <mask id={`coupon-mask-${index}`}>
            <rect width="100%" height="100%" fill="white" />
            <circle cx="0" cy="50%" r="12" fill="black" />
            <circle cx="100%" cy="50%" r="12" fill="black" />
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="none"
          mask={`url(#coupon-mask-${index})`}
        />
      </svg>

      <Card
        className="relative  overflow-hidden border-0 hover:shadow-xl transition-all duration-300  rounded-xl z-[2]"
        style={{
          mask: `url(#coupon-mask-${index})`,
          WebkitMask: `url(#coupon-mask-${index})`,
          maskRepeat: "no-repeat",
          maskSize: "100% 100%",
          WebkitMaskRepeat: "no-repeat",
          WebkitMaskSize: "100% 100%",
        }}
      >
        <div className="flex h-28 sm:h-32 relative  rounded-xl overflow-hidden">
          {/* Left Side - Colored Section */}
          <div
            className={`relative flex-1 flex flex-col justify-between p-4 sm:p-5
    ${
      isApplied
        ? "bg-gradient-to-br from-emerald-500 to-green-600"
        : "bg-gradient-to-br from-red-600 via-rose-600 to-pink-600"
    }`}
          >
            {/* Top Badge */}
            <div className="flex items-start justify-between">
              <Badge className="bg-white/20 text-white border-0 text-[9px] font-bold uppercase tracking-wider backdrop-blur-sm px-2.5 py-0.5">
                Gift Voucher
              </Badge>

              {isTopDeal && (
                <Badge className="bg-amber-400 text-amber-900 border-0 text-[9px] font-bold px-2.5 py-0.5 flex items-center gap-1">
                  <Sparkles size={10} />
                  TOP
                </Badge>
              )}
            </div>

            {/* Amount */}
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg sm:text-4xl flex items-center gap-1 font-black text-white leading-none">
                  <IndianRupeeIcon className="size-3.5 sm:size-8" />
                  {coupon.amount}
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-white/90 uppercase tracking-wide">
                  Cashback
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-white/80 mt-1">
                Save ₹{coupon.amount} on your order
              </p>
            </div>
          </div>

          {/* Right Side - White Section */}
          <div className="w-40 sm:w-44 bg-white flex flex-col justify-between pr-5 p-3 sm:p-4 relative">
            {/* Applied Checkmark */}
            {isApplied && (
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white z-10">
                <CheckCircle2 size={16} className="text-white fill-white" />
              </div>
            )}

            <div className="flex flex-col justify-between h-full">
              {/* Top Section */}
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Voucher Code
                </p>

                {/* Code Box */}
                <button
                  onClick={handleCopy}
                  className={`group/copy w-full flex items-center justify-between p-1 sm:p-2 rounded-md border-2 border-dashed transition-all
                    ${
                      isApplied
                        ? "bg-emerald-50 border-emerald-300"
                        : "bg-gray-50 border-gray-300 hover:border-purple-400 hover:bg-purple-50"
                    }`}
                >
                  <span className="font-mono text-sm font-black text-gray-900 tracking-tight">
                    {coupon.coupon}
                  </span>
                  {copied ? (
                    <CheckCircle2
                      size={14}
                      className="text-emerald-600 flex-shrink-0"
                    />
                  ) : (
                    <Copy
                      size={14}
                      className="text-gray-400 group-hover/copy:text-purple-600 flex-shrink-0 transition-colors"
                    />
                  )}
                </button>
              </div>

              {/* Bottom Section */}
              <div className="space-y-2">
                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

                <Button
                  size="sm"
                  disabled={isApplied}
                  onClick={() => onApply(coupon.coupon)}
                  className={`w-full h-7 sm:h-8 text-[11px] sm:text-xs font-bold rounded-md transition-all duration-200
    ${
      isApplied
        ? "bg-emerald-600 text-white cursor-default"
        : "bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg"
    }`}
                >
                  {isApplied ? (
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 size={14} />
                      Applied
                    </span>
                  ) : (
                    "Apply"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
