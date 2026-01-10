import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import toast from "react-hot-toast";
import { FaGoogle } from "react-icons/fa";
import { Loader2 } from "lucide-react";

import { auth } from "../firebase";
import { userAPI, getUser } from "../redux/api/userAPI";
import {
  setToken,
  userExist,
  userNotExist,
} from "../redux/reducer/userReducer";
import { RootState } from "../redux/store";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { MessageResponse } from "../types/api-types";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(true); // 👈 prevent flicker during initial check
  const [login] = userAPI.useLoginMutation();

  const { user, loading } = useSelector(
    (state: RootState) => state.userReducer
  );

  // ✅ Handle already logged-in user immediately
  useEffect(() => {
    if (loading) return;
    if (user) {
      setRedirecting(true);
      if (user.role === "admin")
        navigate("/admin/dashboard", { replace: true });
      else navigate("/", { replace: true });
    } else {
      setRedirecting(false);
    }
  }, [user, loading, navigate]);

  const loginHandler = useCallback(async () => {
    try {
      setIsLoading(true);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });

      const result = await signInWithPopup(auth, provider);
      const { displayName, email, photoURL, uid } = result.user;
      const token = await result.user.getIdToken();

      if (!email) {
        toast.error("Email is required for registration");
        return;
      }

      dispatch(setToken(token));

      const res = await login({
        name: displayName || "No Name",
        email,
        photo: photoURL || "",
        role: "user", // default; server decides actual role
        _id: uid,
        token,
      });

      if ("data" in res) {
        const userData = await getUser(uid);
        if (userData?.user) {
          dispatch(userExist(userData.user));
          toast.success(`Welcome, ${userData.user.name}! 👋`);

          // ✅ Redirect instantly, no home flicker
          if (userData.user.role === "admin")
            navigate("/admin/dashboard", { replace: true });
          else navigate("/", { replace: true });
        }
      } else {
        const error = res.error as FetchBaseQueryError;
        const message =
          (error.data as MessageResponse)?.message || "Login failed";
        toast.error(message);
        dispatch(userNotExist());
      }
    } catch (error) {
      console.error("Login failed", error);
      toast.error("Authentication failed. Please try again.");
      dispatch(userNotExist());
    } finally {
      setIsLoading(false);
    }
  }, [login, dispatch, navigate]);

  // ✅ Block flicker before redirection completes
  if (redirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md shadow-xl border border-gray-200">
        <CardHeader className="space-y-3 text-center pb-6">
          <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
          <p className="text-gray-500">Sign in with your Google account</p>
        </CardHeader>

        <CardContent className="space-y-4 pb-6">
          <Button
            onClick={loginHandler}
            disabled={isLoading}
            className="w-full h-12 text-lg flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 transition-all"
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
