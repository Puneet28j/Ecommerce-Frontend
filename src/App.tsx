import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppContent from "./AppContent";

const App = () => (
  <Router>
    <AppContent />
    <Toaster position="top-center" />
  </Router>
);

export default App;
