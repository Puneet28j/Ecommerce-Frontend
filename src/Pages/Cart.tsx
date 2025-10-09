import axios from "axios";
import { ShoppingCartIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import CartItemCard from "../component/CartItem";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import {
  addToCart,
  calculatePrice,
  clearCart,
  discountapplied,
  removeCartItem,
  resetCart,
  saveCoupon,
} from "../redux/reducer/cartReducer";
import { RootState, server } from "../redux/store";
import { CartItem } from "../types/types";

const Cart = () => {
  const { cartItems, subTotal, tax, total, shippingCharges, discount } =
    useSelector((state: RootState) => state.cartReducer);
  const dispatch = useDispatch();

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [isValidCouponCode, setIsValidCouponCode] = useState(false);

  // --- CART ITEM HANDLERS ---
  const incrementHandler = (cartItem: CartItem) => {
    if (cartItem.quantity < cartItem.stock) {
      dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity + 1 }));
    }
  };

  const decrementHandler = (cartItem: CartItem) => {
    if (cartItem.quantity > 1) {
      dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity - 1 }));
    }
  };

  const removeHandler = (productId: string) => {
    dispatch(removeCartItem(productId));
  };

  const resetCartFully = () => {
    dispatch(resetCart());
    dispatch(clearCart());
  };

  // --- RE-CALCULATE PRICES ON CART CHANGE ---
  useEffect(() => {
    dispatch(calculatePrice());
  }, [cartItems, dispatch]);

  // --- COUPON CODE VALIDATION (Debounced) ---
  useEffect(() => {
    // If coupon is empty, reset discount & validity immediately.
    if (!couponCode.trim()) {
      dispatch(discountapplied(0));
      setIsValidCouponCode(false);
      dispatch(calculatePrice());
      return;
    }

    const source = axios.CancelToken.source();
    const timerID = setTimeout(() => {
      axios
        .get(`${server}/api/v1/payment/discount?coupon=${couponCode}`, {
          cancelToken: source.token,
        })
        .then((res) => {
          dispatch(discountapplied(res.data.discount));
          dispatch(saveCoupon(couponCode));
          setIsValidCouponCode(true);
          dispatch(calculatePrice());
        })
        .catch((error) => {
          if (axios.isCancel(error)) return; // Ignore cancellations

          if (error.response && error.response.status === 400) {
            // Invalid coupon: reset discount & validity
            dispatch(discountapplied(0));
            setIsValidCouponCode(false);
            dispatch(calculatePrice());
            return;
          }

          console.error("Unexpected error:", error);
        });
    }, 1000);

    return () => {
      clearTimeout(timerID);
      source.cancel("Request canceled due to new input");
    };
  }, [couponCode, dispatch]);

  // --- IMMEDIATE COUPON INVALIDATION WHEN CODE CHANGES ---
  // If the user modifies a valid coupon, we want to immediately clear the discount.
  const handleCouponChange = (value: string) => {
    setCouponCode(value);
    // Reset discount and validity immediately on change.
    dispatch(discountapplied(0));
    setIsValidCouponCode(false);
  };

  // --- IF NO ITEMS IN CART ---
  if (cartItems.length === 0) {
    return (
      <div className="font-primary font-extralight flex justify-center items-center h-[90vh] w-full">
        No Items in Cart <ShoppingCartIcon className="ml-2" />
      </div>
    );
  }

  return (
    <div className=" font-primary max-w-7xl mx-auto">
      <div className="px-4  pt-4 w-full sm:block">
        <Button
          onClick={resetCartFully}
          title="Reset Cart"
          className={`${cartItems.length === 0 ? "hidden" : "w-full sm:block"}`}
        >
          Reset Cart
        </Button>
      </div>
      <main>
        {cartItems.map((item, idx) => (
          <CartItemCard
            key={item.productId || idx}
            cartItem={item}
            incrementHandler={incrementHandler}
            decrementHandler={decrementHandler}
            removeHandler={removeHandler}
          />
        ))}
      </main>
      <div className="flex justify-center items-center">
        <CheckoutSummary
          subTotal={subTotal}
          shippingCharges={shippingCharges}
          tax={tax}
          discount={discount}
          total={total}
          cartItems={cartItems}
          isValidCouponCode={isValidCouponCode}
          couponCode={couponCode}
          handleCouponChange={handleCouponChange}
        />
      </div>
    </div>
  );
};

export default Cart;

/* ========================
   SUBCOMPONENTS
======================== */

/**
 * PriceDetail: Renders a single row of price information.
 */
const PriceDetail = ({
  label,
  value,
  isDiscount = false,
}: {
  label: string;
  value: number;
  isDiscount?: boolean;
}) => (
  <div className="flex justify-between items-center text-sm sm:text-base">
    <span className={isDiscount ? "text-red-500 font-medium" : "text-gray-700"}>
      {label}
    </span>
    <span className={isDiscount ? "text-red-500 font-semibold" : "font-medium"}>
      ₹{value.toFixed(2)}
    </span>
  </div>
);

/**
 * CouponInput: Renders the input for coupon code and displays
 * feedback regarding its validity.
 */
interface CouponInputProps {
  couponCode: string;
  handleCouponChange: (value: string) => void;
  isValidCouponCode: boolean;
  discount: number;
}
const CouponInput = ({
  couponCode,
  handleCouponChange,
  isValidCouponCode,
  discount,
}: CouponInputProps) => (
  <div className="mt-4">
    <input
      type="text"
      placeholder="Enter Coupon Code"
      value={couponCode.toLocaleUpperCase()}
      onChange={(e) => handleCouponChange(e.target.value)}
      className="w-full p-2 border rounded-md dark:bg-slate-900 text-black dark:text-gray-200"
    />
    {couponCode && (
      <div
        className={`mt-2 text-sm flex items-center ${
          isValidCouponCode ? "text-green-500" : "text-red-500"
        }`}
        aria-live="polite"
      >
        {isValidCouponCode ? (
          <Badge
            variant={discount > 0 ? "outline" : "destructive"}
            className={discount > 0 ? "bg-green-500 text-black" : ""}
          >
            ₹{discount} off with{" "}
            <span className="ml-1 font-semibold">{couponCode}</span>
          </Badge>
        ) : (
          <>
            Invalid Coupon Code <VscError className="ml-1" />
          </>
        )}
      </div>
    )}
  </div>
);

/**
 * CheckoutSummary: Displays the order summary along with coupon input
 * and a button to proceed to checkout.
 */
interface CheckoutSummaryProps {
  subTotal: number;
  shippingCharges: number;
  tax: number;
  discount: number;
  total: number;
  cartItems: any[];
  isValidCouponCode: boolean;
  couponCode: string;
  handleCouponChange: (value: string) => void;
}

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
    <Card className=" shadow-lg rounded-lg p-4 m-4 w-full">
      <h2 className="text-lg font-semibold  mb-4">Order Summary</h2>
      <PriceDetail label="Subtotal" value={subTotal} />
      <PriceDetail label="Shipping Charges" value={shippingCharges} />
      <PriceDetail label="Tax" value={tax} />
      <PriceDetail label="Discount" value={discount} isDiscount />
      <hr className="my-3 " />
      <PriceDetail label="Total" value={total} />
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
