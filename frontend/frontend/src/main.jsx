
import { createRoot } from "react-dom/client";
import App from "./app/App.jsx";
import "./styles/index.css";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <App />
    <Toaster position="top-right" richColors />
  </AuthProvider>
);
