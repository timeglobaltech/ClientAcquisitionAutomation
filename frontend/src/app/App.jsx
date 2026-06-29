
import { useState } from "react";
import LandingPage from "../pages/landing/LandingPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import { useAuth } from "../contexts/AuthContext";

function App() {
  const { user, loading } = useAuth();
  const [authView, setAuthView] = useState(null); // 'login' or 'register'

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0E27] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Check user FIRST! If logged in, show dashboard immediately
  if (user) {
    return <DashboardPage />;
  }

  // Then check for auth views
  if (authView === "login") {
    return (
      <LoginPage
        onBack={() => setAuthView(null)}
        onSwitchToRegister={() => setAuthView("register")}
      />
    );
  }

  if (authView === "register") {
    return (
      <RegisterPage
        onBack={() => setAuthView(null)}
        onSwitchToLogin={() => setAuthView("login")}
      />
    );
  }

  // Otherwise show landing page
  return (
    <LandingPage
      onEnterApp={() => setAuthView("login")}
      onSignIn={() => setAuthView("login")}
      onSignUp={() => setAuthView("register")}
    />
  );
}

export default App;
