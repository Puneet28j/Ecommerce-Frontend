import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./component/protected-route";
import { useSelector } from "react-redux";
import { UserReducerInitialState } from "./types/reducer-types";
import { ROUTES } from "./constants/routes";
import { AppLayout } from "./component/Layout/AppLayout";
import Search from "./component/Search";

import Shipping from "./Pages/Shipping";
import Analytics from "./Pages/Admin/Analytics";

// Lazy load components
const Login = lazy(() => import("./Pages/Login"));
const NotFound = lazy(() => import("./Pages/NotFound"));
const MyOrder = lazy(() => import("./Pages/UserOrders"));
const Checkout = lazy(() => import("./Pages/Admin/Checkout"));
const Home = lazy(() => import("./Pages/Home"));
const ProductDetails = lazy(() => import("./Pages/ProductDetails"));
const Cart = lazy(() => import("./Pages/Cart"));
const AdminDashboard = lazy(() => import("./Pages/Admin/Dashboard"));
const AdminProducts = lazy(() => import("./Pages/Admin/Products"));
const OrdersTable = lazy(() => import("./component/Table/OrdersTable"));

const AppRoutes = () => {
  const { user, loading } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer
  );

  return (
    <Suspense fallback={null}>
      <Routes>
        {/* Main layout route */}
        <Route
          path={ROUTES.HOME}
          element={<AppLayout loading={loading} user={user} />}
        >
          <Route index element={<Home />} />
          <Route path={ROUTES.PRODUCT_DETAILS} element={<ProductDetails />} />
          <Route path={ROUTES.SEARCH} element={<Search />} />
          <Route element={<ProtectedRoute isAuthenticated={!!user} />}>
            <Route path={ROUTES.CART} element={<Cart />} />
            <Route path={ROUTES.ORDERS} element={<MyOrder />} />
            <Route path={ROUTES.CHECKOUT} element={<Checkout />} />
            <Route path={ROUTES.SHIPPING} element={<Shipping />} />
          </Route>
          <Route
            element={
              <ProtectedRoute
                isAuthenticated={!!user}
                adminOnly
                admin={user?.role === "admin"}
              />
            }
          >
            <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboard />} />
            <Route path={ROUTES.ADMIN_PRODUCTS} element={<AdminProducts />} />
            <Route path={ROUTES.ADMIN_ORDERS} element={<OrdersTable />} />
            <Route path={ROUTES.ADMIN_ANALYTICS} element={<Analytics />} />
          </Route>
        </Route>
        {/* Login route */}
        <Route
          path={ROUTES.LOGIN}
          element={
            <ProtectedRoute isAuthenticated={!user}>
              <Login />
            </ProtectedRoute>
          }
        />
        {/* Not found route */}
        <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};
export default AppRoutes;
