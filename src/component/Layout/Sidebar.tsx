import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../redux/store";
import NavItem from "./NavItem";
import { ModeToggle } from "../ModeToggle";
import { IoIosAnalytics, IoIosFingerPrint } from "react-icons/io";
// import UserAvatar from "./UseAvatar";
import {
  AntennaIcon,
  ListOrderedIcon,
  LucideLayoutDashboard,
  LucideShoppingBasket,
  Search,
  UserCheck,
  UserCheck2Icon,
} from "lucide-react";
import { GoHomeFill, GoHome } from "react-icons/go";
import { MdOutlineSpaceDashboard, MdSpaceDashboard } from "react-icons/md";
import { RiShoppingBag4Fill, RiShoppingBag4Line } from "react-icons/ri";
import { IoGift, IoGiftOutline } from "react-icons/io5";
import { BiLogoProductHunt } from "react-icons/bi";
import { Separator } from "../../components/ui/separator";
import { User } from "../../types/types";
import UserAvatar from "../UserAvatar";

interface PropsType {
  user: User | null;
}

const Sidebar = ({ user }: PropsType) => {
  const navigate = useNavigate();
  const { cartItems } = useSelector((state: RootState) => state.cartReducer);

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-0 px-2 sm:py-5 space-y-5">
        <NavItem
          to="/"
          iconActive={<GoHomeFill className="size-8" />}
          iconInactive={<GoHome className="size-8" />}
        />
        <NavItem
          to="/search"
          iconActive={
            <Search strokeWidth={3} absoluteStrokeWidth className="size-8" />
          }
          iconInactive={<Search className="size-8" />}
        />
        <NavItem
          to="/cart"
          iconActive={<RiShoppingBag4Fill className="size-8" />}
          iconInactive={<RiShoppingBag4Line className="size-8" />}
          badgeCount={cartItems.length}
        />
        <NavItem
          to="/orders"
          iconActive={<IoGift className="size-8" />}
          iconInactive={<IoGiftOutline className="size-8" />}
        />
        {user && user.role === "admin" && (
          <>
            <Separator />
            <NavItem
              to="/admin/dashboard"
              iconActive={<MdSpaceDashboard className="size-8" />}
              iconInactive={<MdOutlineSpaceDashboard className="size-8" />}
            />
            <NavItem
              to="/admin/orders"
              iconActive={<ListOrderedIcon className="size-8" />}
              iconInactive={<LucideShoppingBasket className="size-8" />}
            />
            <NavItem
              to="/admin/products"
              iconActive={<BiLogoProductHunt className="size-8" />}
              iconInactive={<LucideLayoutDashboard className="size-8" />}
            />
            <NavItem
              to="/admin/customers"
              iconActive={<UserCheck2Icon className="size-8" />}
              iconInactive={<UserCheck className="size-8" />}
            />
            <NavItem
              to="/admin/analytics"
              iconActive={<AntennaIcon className="size-8" />}
              iconInactive={<IoIosAnalytics className="size-8" />}
            />
          </>
        )}
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <ModeToggle />
        {!user?._id ? (
          <button onClick={() => navigate("/login")}>
            <IoIosFingerPrint className="h-10 w-10 cursor-pointer" />
          </button>
        ) : (
          <UserAvatar user={user} />
          // <UserAvatar user={user} />
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
