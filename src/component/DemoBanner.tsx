import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../redux/store";
import { exitDemoMode } from "../redux/reducer/demoSlice";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, X } from "lucide-react";

const DemoBanner = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isDemoMode } = useSelector((state: RootState) => state.demo);

  const handleExitDemo = () => {
    dispatch(exitDemoMode());
    navigate("/");
  };

  return (
    <AnimatePresence>
      {isDemoMode && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-0 left-0 right-0 z-50 bg-slate-900 border-b border-white/10 text-white shadow-xl backdrop-blur-md"
        >
          <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full px-3 py-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Demo Environment
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-400">
                <Lock className="w-3 h-3" />
                <span>Security: Displaying Dummy Data</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden md:inline text-xs text-white/90 font-medium">
                Portfolio Demo • Read-Only Mode
              </span>
              <button
                onClick={handleExitDemo}
                className="flex items-center gap-1.5 text-slate-400 hover:text-white hover:bg-white/5 transition-colors px-3 py-1.5 rounded-md text-sm font-medium"
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">Exit Demo</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DemoBanner;
