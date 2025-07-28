import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { getUser, userAPI } from "../redux/api/userAPI";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import toast from "react-hot-toast";
import { userExist, userNotExist } from "../redux/reducer/userReducer";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { MessageResponse } from "../types/api-types";
import { Loader2 } from "lucide-react";
import { auth } from "../firebase";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { FaGoogle } from "react-icons/fa";

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [login] = userAPI.useLoginMutation();

  const loginHandler = useCallback(async () => {
    try {
      setIsLoading(true);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });

      const result = await signInWithPopup(auth, provider);
      const { displayName, email, photoURL, uid } = result.user;

      if (!email) {
        toast.error("Email is required for registration");
        return;
      }

      const res = await login({
        name: displayName || "No Name",
        email,
        photo: photoURL || "",
        role: "user",
        _id: uid,
      });

      if ("data" in res) {
        const userData = await getUser(uid);
        if (userData?.user) {
          dispatch(userExist(userData.user));
          toast.success("Welcome back! 👋");
        }
      } else {
        const error = res.error as FetchBaseQueryError;
        const message =
          (error.data as MessageResponse)?.message || "Login failed";
        toast.error(message);
        dispatch(userNotExist());
      }
    } catch (error) {
      toast.error("Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [login, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-3 text-center pb-6">
          <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
          <p className="text-gray-500">Sign in with your Google account</p>
        </CardHeader>

        <CardContent className="space-y-4 pb-6">
          <Button
            onClick={loginHandler}
            disabled={isLoading}
            className="w-full h-12 text-lg flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <FaGoogle className="w-5 h-5" />
                <span>Continue with Google</span>
              </>
            )}
          </Button>
        </CardContent>

        <CardFooter className="flex justify-center text-sm text-gray-500 pt-2">
          By signing in, you agree to our Terms and Privacy Policy
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
