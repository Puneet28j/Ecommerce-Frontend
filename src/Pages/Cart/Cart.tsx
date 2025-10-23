import axios from "axios";
import { ShoppingCartIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import CouponSection from "@/component/Coupon/CouponSection";
import { couponApi } from "@/redux/api/couponAPI";
import { UserReducerInitialState } from "@/types/reducer-types";
import CartItemCard from "../../component/CartItem";
import { Button } from "../../components/ui/button";
import {
  addToCart,
  calculatePrice,
  clearCart,
  discountapplied,
  removeCartItem,
  resetCart,
  saveCoupon,
} from "../../redux/reducer/cartReducer";
import { RootState, server } from "../../redux/store";
import { CartItem } from "../../types/types";
import CheckoutSummary from "./CheckoutSummary";

const Cart = () => {
  const { cartItems, subTotal, tax, total, shippingCharges, discount } =
    useSelector((state: RootState) => state.cartReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer
  );

  const { data: CouponData, isLoading: couponLoading } =
    couponApi.useGetCouponsQuery(user?._id || "");

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
    setCouponCode("");
    setIsValidCouponCode(false);
  };

  // --- RE-CALCULATE PRICES ON CART CHANGE ---
  useEffect(() => {
    dispatch(calculatePrice());
  }, [cartItems, dispatch]);

  // --- COUPON CODE VALIDATION (Debounced) ---
  useEffect(() => {
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
          if (axios.isCancel(error)) return;

          if (error.response && error.response.status === 400) {
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

  // --- COUPON CHANGE HANDLER ---
  const handleCouponChange = (value: string) => {
    setCouponCode(value);
    dispatch(discountapplied(0));
    setIsValidCouponCode(false);
  };

  // --- APPLY COUPON FROM CARD ---
  const applyCouponFromCard = (code: string) => {
    setCouponCode(code);
    // Scroll to checkout summary
    setTimeout(() => {
      const checkoutElement = document.getElementById("checkout-summary");
      checkoutElement?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  // --- EMPTY CART STATE ---
  if (cartItems.length === 0) {
    return (
      <div className="font-primary font-extralight flex flex-col justify-center items-center h-[90vh] w-full gap-4">
        <ShoppingCartIcon className="w-20 h-20 text-gray-300" />
        <p className="text-xl text-gray-500">Your cart is empty</p>
        <Button onClick={() => navigate("/search")} variant="outline">
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="font-primary max-w-7xl mx-auto pb-8">
      {/* Reset Cart Button */}
      <div className="px-4 pt-4 w-full">
        <Button
          onClick={resetCartFully}
          variant="destructive"
          className="w-full sm:w-auto"
        >
          Reset Cart
        </Button>
      </div>

      {/* Cart Items */}
      <main className="mb-6">
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
      {couponLoading ? (
        <div className="text-center text-gray-500">Loading coupons...</div>
      ) : (
        CouponData &&
        CouponData.coupons.length > 0 && (
          <CouponSection
            couponCode={couponCode}
            isValidCouponCode={isValidCouponCode}
            applyCouponFromCard={applyCouponFromCard}
            CouponData={CouponData}
          />
        )
      )}

      {/* Checkout Summary */}
      <div className="flex justify-center items-center" id="checkout-summary">
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
