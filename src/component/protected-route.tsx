import { ReactElement } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface Props {
  children?: ReactElement;
  isAuthenticated: boolean;
  adminOnly?: boolean;
  admin?: boolean;
  redirect?: string;
}

const ProtectedRoute = ({
  children,
  isAuthenticated,
  adminOnly,
  admin,
  redirect = "/",
}: Props) => {
  const { isDemoMode } = useSelector((state: RootState) => state.demo);

  // Allow access if in demo mode for admin routes
  if (adminOnly && isDemoMode) {
    return children ? children : <Outlet />;
  }

  if (!isAuthenticated) return <Navigate to={redirect} />;
  if (adminOnly && !admin) return <Navigate to={redirect} />;

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
