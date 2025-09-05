import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { orderApi } from "../../redux/api/orderAPI";
import { NewOrderRequest } from "../../types/api-types";
import { RootState } from "../../redux/store";
import { resetCart, clearCart } from "../../redux/reducer/cartReducer";
import { responseToast } from "../../utils/features";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state: RootState) => state.userReducer);
  const {
    shippingInfo,
    cartItems,
    subTotal,
    tax,
    discount,
    shippingCharges,
    total,
  } = useSelector((state: RootState) => state.cartReducer);

  const [isProcessing, setIsProcessing] = useState(false);
  const [newOrder] = orderApi.useNewOrderMutation();

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) return;
    setIsProcessing(true);

    const orderData: NewOrderRequest = {
      shippingInfo,
      orderItems: cartItems,
      subTotal,
      tax,
      discount,
      shippingCharges,
      total,
      user: user?._id!,
    };

    const { paymentIntent, error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.origin },
      redirect: "if_required",
    });

    if (error) {
      setIsProcessing(false);
      return toast.error(error.message || "Something went wrong. Try again.");
    }

    if (paymentIntent.status === "succeeded") {
      const res = await newOrder(orderData);
      dispatch(resetCart());
      dispatch(clearCart());
      responseToast(res, navigate, "/orders");
    }

    setIsProcessing(false);
  };

  return (
    <div className="max-w-lg mx-auto bg-white dark:bg-gray-900 shadow-md rounded-xl p-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Complete Your Payment
      </h2>

      {/* Order Summary */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
        <h3 className="text-md font-medium text-gray-700 dark:text-gray-200 mb-2">
          Order Summary
        </h3>
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
          <span>Subtotal</span>
          <span>₹{subTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
          <span>Tax</span>
          <span>₹{tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
          <span>Shipping</span>
          <span>₹{shippingCharges.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm text-red-500 font-medium">
            <span>Discount</span>
            <span>-₹{discount.toFixed(2)}</span>
          </div>
        )}
        <hr className="my-2 border-gray-300 dark:border-gray-700" />
        <div className="flex justify-between font-semibold text-gray-800 dark:text-gray-100">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </div>

      {/* Stripe Payment Element */}
      <form onSubmit={submitHandler} className="space-y-4">
        <PaymentElement />

        <button
          type="submit"
          disabled={isProcessing || !stripe || !elements}
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all"
        >
          {isProcessing ? "Processing..." : `Pay ₹${total.toFixed(2)}`}
        </button>
      </form>
    </div>
  );
};

const Checkout = () => {
  const location = useLocation();
  const clientSecret: string | undefined = location.state;

  if (!clientSecret) return <Navigate to={"/cart"} />;

  return (
    <Elements options={{ clientSecret }} stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default Checkout;
