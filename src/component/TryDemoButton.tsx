import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { enterDemoMode } from "../redux/reducer/demoSlice";
import { motion } from "framer-motion";
import { LayoutDashboard } from "lucide-react";
import { RootState } from "../redux/store";

const TryDemoButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.userReducer);

  // Don't show button if user is not logged in or is already an admin
  if (!user || user.role === "admin") {
    return null;
  }

  const handleTryDemo = () => {
    dispatch(enterDemoMode());
    navigate("/admin/dashboard");
  };

  return (
    <motion.button
      onClick={handleTryDemo}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className="group relative inline-flex items-center gap-2 sm:gap-3 overflow-hidden rounded-full bg-blue-600 hover:bg-blue-700 px-5 py-2.5 sm:px-7 sm:py-3.5 text-white font-medium shadow-lg shadow-blue-500/25 ring-1 ring-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0"
    >
      {/* Subtle shine effect on hover */}
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
      
      {/* Icon */}
      <span className="relative flex items-center gap-2">
        <LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110 duration-300" />
      </span>
      
      {/* Text */}
      <span className="relative text-sm sm:text-base tracking-wide">
        Try Admin Demo
      </span>
      
      {/* Badge */}
      <span className="relative hidden xs:inline-flex items-center justify-center bg-white/20 px-2 py-0.5 rounded text-[10px] sm:text-xs font-semibold tracking-wider">
        FREE
      </span>
    </motion.button>
  );
};

export default TryDemoButton;
