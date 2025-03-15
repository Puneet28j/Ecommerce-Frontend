import { UserIcon } from "lucide-react";
import React, { useState } from "react";
import { signOut } from "firebase/auth";
import toast from "react-hot-toast";
import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";
import { auth } from "../firebase";
import { useDispatch } from "react-redux";
import { userNotExist } from "../redux/reducer/userReducer";

// User Avatar component props
interface UserAvatarProps {
  photo?: string;
  name: string;
  email?: string;
  className?: string;
  moreInfo?: boolean;
}

// Avatar image fallback
const AvatarImage = React.forwardRef<
  HTMLImageElement | SVGSVGElement,
  { src?: string; alt: string; className?: string }
>(({ src, alt, className }, ref) => {
  const [imageError, setImageError] = useState(false);

  return !imageError && src ? (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={`w-10 h-10 rounded-full object-cover ${className || ""}`}
      onError={() => setImageError(true)}
      ref={ref as React.MutableRefObject<HTMLImageElement>}
    />
  ) : (
    <UserIcon
      className={`w-10 h-10 p-2 bg-gray-800 rounded-full text-gray-400 ${
        className || ""
      }`}
      ref={ref as React.MutableRefObject<SVGSVGElement>}
    />
  );
});

// Main UserAvatar component
const UserAvatar = React.forwardRef<HTMLDivElement, UserAvatarProps>(
  ({ photo, name, email, className, moreInfo }, ref) => {
    const dispatch = useDispatch();
    const logoutHandler = async () => {
      try {
        await signOut(auth);
        dispatch(userNotExist());
        toast.success("Signed Out Successfully");
      } catch (error) {
        toast.error("Sign Out Failed");
        console.error("Error signing out:", error);
      }
    };

    if (!moreInfo) {
      return <AvatarImage src={photo} alt={name} className={className} />;
    }

    if (!name || !email) {
      throw new Error("Name and email are required when moreInfo is true");
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            className="overflow-hidden rounded-full border-2 border-black dark:border-white"
            ref={ref as unknown as React.MutableRefObject<HTMLButtonElement>}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AvatarImage src={photo} alt={name} />
                </TooltipTrigger>
                <TooltipContent side="right">Profile</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>{name}</DropdownMenuItem>
          <DropdownMenuItem>{email}</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logoutHandler}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
);

export default UserAvatar;
