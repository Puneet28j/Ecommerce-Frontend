import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppContent from "./AppContent";
import ScrollToTop from "./lib/utils";

const App = () => (
  <Router>
    <ScrollToTop />
    <AppContent />
    <Toaster position="top-center" />
  </Router>
);

export default App;
