import axios from "axios";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiArrowBack } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState, server } from "../redux/store";
import { saveShippingInfo } from "../redux/reducer/cartReducer";

const Shipping = () => {
  const { cartItems, coupon } = useSelector(
    (state: RootState) => state.cartReducer
  );
  const { user } = useSelector((state: RootState) => state.userReducer);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
  });

  const changeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setShippingInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch(saveShippingInfo(shippingInfo));

    try {
      const { data } = await axios.post(
        `${server}/api/v1/payment/create?id=${user?._id}`,
        {
          items: cartItems,
          shippingInfo,
          coupon,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setLoading(true);
      navigate("/pay", {
        state: data.clientSecret,
      });
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    if (cartItems.length <= 0) return navigate("/cart");
  }, [cartItems]);

  return (
    <div className="flex flex-col p-6">
      <button
        className="flex items-center mb-4 text-gray-500 hover:text-gray-700"
        onClick={() => navigate("/cart")}
      >
        <BiArrowBack size={24} />
        <span className="ml-2">Back to Cart</span>
      </button>

      <form onSubmit={submitHandler} className="space-y-4 max-w-md mx-auto">
        <h1 className="text-xl font-semibold text-gray-700">
          Shipping Address
        </h1>

        <input
          required
          type="text"
          placeholder="Address"
          name="address"
          value={shippingInfo.address}
          onChange={changeHandler}
          className="w-full p-2 border border-gray-300 rounded"
        />

        <input
          required
          type="text"
          placeholder="City"
          name="city"
          value={shippingInfo.city}
          onChange={changeHandler}
          className="w-full p-2 border border-gray-300 rounded"
        />

        <input
          required
          type="text"
          placeholder="State"
          name="state"
          value={shippingInfo.state}
          onChange={changeHandler}
          className="w-full p-2 border border-gray-300 rounded"
        />

        <select
          name="country"
          required
          value={shippingInfo.country}
          onChange={changeHandler}
          className="w-full p-2 border text-black rounded"
        >
          <option value="">Choose Country</option>
          <option value="india">India</option>
          <option value="us">United States</option>
          <option value="canada">Canada</option>
          {/* Add more countries as needed */}
        </select>

        <input
          required
          type="text"
          placeholder="Pincode"
          name="pinCode"
          value={shippingInfo.pinCode}
          onChange={changeHandler}
          className="w-full p-2 border border-gray-300 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? "Processing..." : "Proceed to Payment"}
        </button>
      </form>
    </div>
  );
};

export default Shipping;
