import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { getUser, userAPI } from "../redux/api/userAPI";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import toast from "react-hot-toast";
import { userExist, userNotExist } from "../redux/reducer/userReducer";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { MessageResponse } from "../types/api-types";
import { AtSignIcon } from "lucide-react";
import { auth } from "../firebase";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";

const Login = () => {
  const dispatch = useDispatch();
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");

  const [login] = userAPI.useLoginMutation();

  const loginHandler = useCallback(async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const { displayName, email, photoURL, uid } = result.user;

      const res = await login({
        name: displayName || "No Name",
        email: email || "",
        photo: photoURL || "",
        gender,
        role: "user",
        dob,
        _id: uid,
      });

      if ("data" in res) {
        toast.success(res.data.message);
        const userData = await getUser(uid);
        if (userData?.user) {
          dispatch(userExist(userData.user));

          // ✅ Store the user in localStorage for persistence
          localStorage.setItem("user", JSON.stringify(userData.user));
        }
      } else {
        const error = res.error as FetchBaseQueryError;
        const message =
          ((error.data as MessageResponse)?.message as string) ||
          "Login failed";
        toast.error(message);
        dispatch(userNotExist());
      }
    } catch (error) {
      toast.error("Sign In Failed");
    }
  }, [gender, dob, login, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-64 md:w-80 p-4 shadow-lg bg-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold">Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select onValueChange={setGender}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>

          <div>
            <Label className="block mb-1">Date of Birth</Label>
            <Input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-center mt-4">
          <AtSignIcon
            onClick={loginHandler}
            className="cursor-pointer text-2xl text-blue-500 hover:text-blue-700"
          />
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
