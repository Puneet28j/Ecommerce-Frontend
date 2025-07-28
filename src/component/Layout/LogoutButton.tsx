import React from "react";
import { signOut } from "firebase/auth";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { auth } from "../../firebase";
import { Button } from "../../components/ui/button";
import { clearCart, resetCart } from "../../redux/reducer/cartReducer";

const LogoutButton: React.FC = () => {
  const dispatch = useDispatch();

  const logoutHandler = async () => {
    try {
      await signOut(auth);
      dispatch(clearCart());
      dispatch(resetCart());
      toast.success("Sign Out Successfully");
    } catch (error) {
      toast.error("Sign Out Failed");
    }
  };

  return <Button onClick={logoutHandler}>Logout</Button>;
};

export default LogoutButton;
