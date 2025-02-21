import React, { useState, useEffect, useCallback, useMemo } from "react";
import { debounce } from "lodash";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { GoHomeFill, GoHome } from "react-icons/go";
import { MdOutlineSpaceDashboard, MdSpaceDashboard } from "react-icons/md";
import { FaCircleUser, FaRegCircleUser } from "react-icons/fa6";
import { RiShoppingBag4Fill, RiShoppingBag4Line } from "react-icons/ri";
import { IoGift, IoGiftOutline } from "react-icons/io5";
import NavItem from "./NavItem";

export interface NavItemConfig {
  to: string;
  iconActive: JSX.Element;
  iconInactive: JSX.Element;
  showBadge?: boolean;
}

const navConfig: NavItemConfig[] = [
  {
    to: "/",
    iconActive: <GoHomeFill className="size-7" />,
    iconInactive: <GoHome className="size-7" />,
  },
  {
    to: "/admin/products",
    iconActive: <MdSpaceDashboard className="size-7" />,
    iconInactive: <MdOutlineSpaceDashboard className="size-7" />,
  },
  {
    to: "/admin/dashboard",
    iconActive: <MdSpaceDashboard className="size-7" />,
    iconInactive: <MdOutlineSpaceDashboard className="size-7" />,
  },
  {
    to: "/admin/customers",
    iconActive: <FaCircleUser className="size-7" />,
    iconInactive: <FaRegCircleUser className="size-7" />,
  },
  {
    to: "/cart",
    iconActive: <RiShoppingBag4Fill className="size-7" />,
    iconInactive: <RiShoppingBag4Line className="size-7" />,
    showBadge: true,
  },
  {
    to: "/orders",
    iconActive: <IoGift className="size-7" />,
    iconInactive: <IoGiftOutline className="size-7" />,
  },
];

const BottomNavbar: React.FC = () => {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [lastTouchY, setLastTouchY] = useState(0);

  // Get cart items from Redux
  const cartItems = useSelector(
    (state: RootState) => state.cartReducer.cartItems
  );

  // Memoize cart length to avoid unnecessary re-renders
  const cartItemCount = useMemo(() => cartItems.length, [cartItems]);

  // Memoized scroll handler using debounce
  const controlNavbar = useCallback(
    debounce(() => {
      setShow(window.scrollY < lastScrollY);
      setLastScrollY(window.scrollY);
    }, 100),
    [lastScrollY]
  );

  // Memoized touch event handlers
  const handleTouchStart = useCallback((e: TouchEvent) => {
    setLastTouchY(e.touches[0].clientY);
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      setShow(e.touches[0].clientY > lastTouchY);
      setLastTouchY(e.touches[0].clientY);
    },
    [lastTouchY]
  );

  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);
    document.body.addEventListener("touchstart", handleTouchStart);
    document.body.addEventListener("touchmove", handleTouchMove);

    return () => {
      window.removeEventListener("scroll", controlNavbar);
      document.body.removeEventListener("touchstart", handleTouchStart);
      document.body.removeEventListener("touchmove", handleTouchMove);
    };
  }, [controlNavbar, handleTouchStart, handleTouchMove]);

  return (
    <div
      className={`fixed z-50 bottom-0 w-full dark:bg-black bg-white dark:text-white text-black transition-transform duration-300 ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <nav className="flex justify-around py-3">
        {navConfig.map(({ to, iconActive, iconInactive, showBadge }, index) => (
          <NavItem
            key={index}
            to={to}
            iconActive={iconActive}
            iconInactive={iconInactive}
            badgeCount={showBadge ? cartItemCount : undefined}
          />
        ))}
      </nav>
    </div>
  );
};

export default BottomNavbar;
