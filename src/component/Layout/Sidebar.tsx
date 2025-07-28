import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../redux/store";
import NavItem from "./NavItem";
import { ModeToggle } from "../ModeToggle";
import { motion } from "framer-motion";
import { Separator } from "../../components/ui/separator";
import { User } from "../../types/types";
import UserAvatar from "../UserAvatar";

// Icon Imports
import {
  HomeIcon,
  SearchIcon,
  ShoppingBagIcon,
  LayoutDashboardIcon,
  PackageIcon,
  ShoppingCartIcon,
  UsersIcon,
  BarChart3Icon,
  TagsIcon,
  PackageOpenIcon,
} from "lucide-react";
import { IoIosFingerPrint } from "react-icons/io";

interface PropsType {
  user: User | null;
  loading: boolean;
}

const Sidebar = ({ user, loading }: PropsType) => {
  const navigate = useNavigate();
  const { cartItems } = useSelector((state: RootState) => state.cartReducer);

  // Define common navigation items
  const commonNavItems = [
    {
      path: "/",
      activeIcon: <HomeIcon strokeWidth={2.5} className="w-6 h-6" />,
      inactiveIcon: <HomeIcon strokeWidth={1.5} className="w-6 h-6" />,
    },
    {
      path: "/search",
      activeIcon: <SearchIcon strokeWidth={2.5} className="w-6 h-6" />,
      inactiveIcon: <SearchIcon strokeWidth={1.5} className="w-6 h-6" />,
    },
    {
      path: "/cart",
      activeIcon: <ShoppingBagIcon strokeWidth={2.5} className="w-6 h-6" />,
      inactiveIcon: <ShoppingBagIcon strokeWidth={1.5} className="w-6 h-6" />,
      badgeCount: cartItems.length,
    },
    {
      path: "/orders",
      activeIcon: <PackageOpenIcon strokeWidth={2.5} className="w-6 h-6" />,
      inactiveIcon: <PackageOpenIcon strokeWidth={1.5} className="w-6 h-6" />,
    },
  ];

  // Define admin navigation items
  const adminNavItems = [
    {
      path: "/admin/dashboard",
      activeIcon: <LayoutDashboardIcon strokeWidth={2.5} className="w-6 h-6" />,
      inactiveIcon: (
        <LayoutDashboardIcon strokeWidth={1.5} className="w-6 h-6" />
      ),
    },
    {
      path: "/admin/orders",
      activeIcon: <PackageIcon strokeWidth={2.5} className="w-6 h-6" />,
      inactiveIcon: <PackageIcon strokeWidth={1.5} className="w-6 h-6" />,
    },
    {
      path: "/admin/products",
      activeIcon: <ShoppingCartIcon strokeWidth={2.5} className="w-6 h-6" />,
      inactiveIcon: <ShoppingCartIcon strokeWidth={1.5} className="w-6 h-6" />,
    },
    {
      path: "/admin/customers",
      activeIcon: <UsersIcon strokeWidth={2.5} className="w-6 h-6" />,
      inactiveIcon: <UsersIcon strokeWidth={1.5} className="w-6 h-6" />,
    },
    {
      path: "/admin/analytics",
      activeIcon: <BarChart3Icon strokeWidth={2.5} className="w-6 h-6" />,
      inactiveIcon: <BarChart3Icon strokeWidth={1.5} className="w-6 h-6" />,
    },
    {
      path: "/admin/coupon",
      activeIcon: <TagsIcon strokeWidth={2.5} className="w-6 h-6" />,
      inactiveIcon: <TagsIcon strokeWidth={1.5} className="w-6 h-6" />,
    },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-0 px-2 sm:py-5 space-y-5">
        {commonNavItems.map(
          ({ path, activeIcon, inactiveIcon, badgeCount }) => (
            <NavItem
              key={path}
              to={path}
              iconActive={activeIcon}
              iconInactive={inactiveIcon}
              badgeCount={badgeCount}
            />
          )
        )}

        {/* Render admin nav items only for admin users */}
        {user?.role === "admin" && (
          <>
            <Separator />
            {adminNavItems.map(({ path, activeIcon, inactiveIcon }) => (
              <NavItem
                key={path}
                to={path}
                iconActive={activeIcon}
                iconInactive={inactiveIcon}
              />
            ))}
          </>
        )}
      </nav>

      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <ModeToggle />

        {/* Add a wrapper div with fixed height */}
        <div className="h-10 w-10">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full w-full rounded-full bg-gray-700 animate-pulse"
            />
          ) : !user?._id ? (
            <button
              onClick={() => navigate("/login")}
              className="h-full w-full flex items-center justify-center"
            >
              <IoIosFingerPrint className="h-full w-full cursor-pointer text-gray-400 hover:text-gray-300 transition-all" />
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="h-full w-full"
            >
              <UserAvatar
                moreInfo
                email={user.email}
                name={user.name}
                photo={user.photo}
              />
            </motion.div>
          )}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
