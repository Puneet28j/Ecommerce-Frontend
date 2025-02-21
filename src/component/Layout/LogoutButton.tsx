import React from "react";
import { signOut } from "firebase/auth";
import toast from "react-hot-toast";
import { auth } from "../../firebase";
import { Button } from "../../components/ui/button";

const LogoutButton: React.FC = () => {
  const logoutHandler = async () => {
    try {
      await signOut(auth);
      toast.success("Sign Out Successfully");
    } catch (error) {
      toast.error("Sign Out Failed");
    }
  };

  return <Button onClick={logoutHandler}>Logout</Button>;
};

export default LogoutButton;
