// import { signOut } from "firebase/auth";
// import React from "react";
// import toast from "react-hot-toast";
// import { Button } from "../../components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "../../components/ui/dropdown-menu";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "../../components/ui/tooltip";
// import { auth } from "../../firebase";
// import { User } from "../../types/types";

// interface UserAvatarProps {
//   user: User;
// }

// const UserAvatar: React.FC<UserAvatarProps> = ({ user }) => {
//   const logoutHandler = async () => {
//     try {
//       await signOut(auth);
//       toast.success("Sign Out Successfully");
//     } catch (error) {
//       toast.error("Sign Out Failed");
//     }
//   };

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button
//           size="icon"
//           className="overflow-hidden rounded-full border-4 border-black dark:border-white"
//         >
//           <TooltipProvider>
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <UserAvatar user={user} />
//               </TooltipTrigger>
//               <TooltipContent side="right">Profile</TooltipContent>
//             </Tooltip>
//           </TooltipProvider>
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end">
//         <DropdownMenuLabel>My Account</DropdownMenuLabel>
//         <DropdownMenuSeparator />
//         <DropdownMenuItem>{user?.name}</DropdownMenuItem>
//         <DropdownMenuItem>{user?.email}</DropdownMenuItem>
//         <DropdownMenuItem>Support</DropdownMenuItem>
//         <DropdownMenuSeparator />
//         <DropdownMenuItem onClick={logoutHandler}>Logout</DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// };

// export default UserAvatar;
