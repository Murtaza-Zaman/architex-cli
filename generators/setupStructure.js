const fs = require("fs"); // for working with file system (like creating files and folders)
const path = require("path"); // for working with file paths (like joining paths)

function setupStructure(projectPath) {
  console.log("📁 Creating architecture with files...");

  // Helper function
  const createFile = (filePath, content) => {
    // create the full path to the file
    const fullPath = path.join(projectPath, filePath);
    // get the directory path of the file
    const dirPath = path.dirname(fullPath);
    // if the directory path doesn't exist, create it
    if (!fs.existsSync(dirPath)) {
      // recursive: true creates parent directories as needed
      fs.mkdirSync(dirPath, { recursive: true });
    }
    // write the content to the file
    fs.writeFileSync(fullPath, content);
  };

  // Helper function to delete file
  const deleteFile = (filePath) => {
    const fullPath = path.join(projectPath, filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  };

  // Delete default Vite App.css
  deleteFile("src/App.css");

  // 📁 MAIN ROUTER & ENTRY POINTS
  createFile(
    "src/main.jsx",
    `import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./i18n";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`
  );

  createFile(
    "src/App.jsx",
    `import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppRoutes from "./routes/AppRoutes";
import MainLayout from "./layouts/MainLayout";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <MainLayout>
          <AppRoutes />
        </MainLayout>
      </BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </QueryClientProvider>
  );
}`
  );

  // 📁 LOCALIZATION (react-i18next)
  createFile(
    "src/i18n.js",
    `import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      welcome: "Welcome to Architex",
      login: "Login",
      email: "Email",
      password: "Password",
      signingIn: "Signing in...",
      loginSuccess: "Successfully logged in!",
      loginError: "Invalid credentials",
      dashboard: "Dashboard",
      logout: "Logout",
    },
  },
  es: {
    translation: {
      welcome: "Bienvenido a Architex",
      login: "Iniciar Sesión",
      email: "Correo Electrónico",
      password: "Contraseña",
      signingIn: "Iniciando sesión...",
      loginSuccess: "¡Inicio de sesión exitoso!",
      loginError: "Credenciales inválidas",
      dashboard: "Tablero",
      logout: "Cerrar Sesión",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;`
  );

  // 📁 FEATURES
  createFile(
    "src/features/auth/Login.jsx",
    `import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Mail, Lock, LogIn, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Login() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (data.email === "admin@example.com" && data.password === "password123") {
        toast.success(t("loginSuccess"));
        navigate("/dashboard");
      } else {
        toast.error(t("loginError"));
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const toggleLanguage = () => {
    const nextLang = i18n.language === "en" ? "es" : "en";
    i18n.changeLanguage(nextLang);
  };

  return (
    <div className="auth-container">
      <div className="language-selector">
        <button onClick={toggleLanguage} className="lang-btn">
          <Globe size={16} />
          <span>{i18n.language.toUpperCase()}</span>
        </button>
      </div>

      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon-wrapper">
            <LogIn className="auth-icon" size={32} />
          </div>
          <h2>{t("welcome")}</h2>
          <p>Sign in to your account</p>
          <div className="credentials-hint">
            Hint: admin@example.com / password123
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div className="form-group">
            <label>{t("email")}</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={18} />
              <input
                type="email"
                placeholder="admin@example.com"
                {...register("email")}
                className={errors.email ? "input-error" : ""}
              />
            </div>
            {errors.email && <span className="error-text">{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label>{t("password")}</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input
                type="password"
                placeholder="••••••••"
                {...register("password")}
                className={errors.password ? "input-error" : ""}
              />
            </div>
            {errors.password && <span className="error-text">{errors.password.message}</span>}
          </div>

          <button type="submit" disabled={isSubmitting} className="submit-btn">
            {isSubmitting ? t("signingIn") : t("login")}
          </button>
        </form>
      </div>
    </div>
  );
}`
  );

  createFile(
    "src/features/dashboard/Dashboard.jsx",
    `import { useTranslation } from "react-i18next";
import { LogOut, LayoutDashboard, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = () => {
    toast.info("Logged out successfully");
    navigate("/");
  };

  const toggleLanguage = () => {
    const nextLang = i18n.language === "en" ? "es" : "en";
    i18n.changeLanguage(nextLang);
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="nav-logo">
          <LayoutDashboard size={24} />
          <span>Architex Panel</span>
        </div>
        <div className="nav-actions">
          <button onClick={toggleLanguage} className="lang-btn">
            <Globe size={16} />
            <span>{i18n.language.toUpperCase()}</span>
          </button>
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={16} />
            <span>{t("logout")}</span>
          </button>
        </div>
      </nav>

      <main className="dashboard-content">
        <div className="welcome-card">
          <h1>{t("dashboard")}</h1>
          <p>Welcome to your enterprise administration panel.</p>
        </div>
      </main>
    </div>
  );}`
  );

  // 📁 COMPONENTS
  createFile(
    "src/components/Button.jsx",
    `export default function Button({ children, ...props }) {
  return <button {...props}>{children}</button>;
}`
  );

  // 📁 HOOKS
  createFile(
    "src/hooks/useAuth.js",
    `export default function useAuth() {
  return { user: null };
}`
  );

  // 📁 SERVICES
  createFile(
    "src/services/api.js",
    `import axios from "axios";

const api = axios.create({
  baseURL: "https://api.example.com",
});

export default api;`
  );

  // 📁 CONTEXT
  createFile(
    "src/context/AuthContext.jsx",
    `import { createContext } from "react";

export const AuthContext = createContext();`
  );

  // 📁 UTILS
  createFile(
    "src/utils/helpers.js",
    `export const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};`
  );

  // 📁 ROUTES
  createFile(
    "src/routes/AppRoutes.jsx",
    `import { Routes, Route } from "react-router-dom";
import Login from "../features/auth/Login";
import Dashboard from "../features/dashboard/Dashboard";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}`
  );

  // 📁 LAYOUTS
  createFile(
    "src/layouts/MainLayout.jsx",
    `export default function MainLayout({ children }) {
  return <div className="app-layout">{children}</div>;
}`
  );

  // 📁 STYLES
  createFile(
    "src/index.css",
    `@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

:root {
  font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: dark light;
  color: #f8fafc;
  background-color: #090d16;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0;
  display: flex;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;
  background: radial-gradient(circle at top right, rgba(99, 102, 241, 0.15), transparent 40%),
              radial-gradient(circle at bottom left, rgba(244, 63, 94, 0.1), transparent 40%),
              #0f172a;
}

#root {
  width: 100%;
}

/* Auth Container & Layout */
.auth-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  position: relative;
  box-sizing: border-box;
}

.language-selector {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
}

.lang-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.lang-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.auth-card {
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 3rem 2.5rem;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.3);
  box-sizing: border-box;
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: white;
  border-radius: 16px;
  margin-bottom: 1.5rem;
  box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.3);
}

.auth-header h2 {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  color: white;
}

.auth-header p {
  margin: 0.5rem 0 0 0;
  color: #94a3b8;
  font-size: 0.95rem;
}

.credentials-hint {
  margin-top: 1rem;
  font-size: 0.8rem;
  color: #6366f1;
  background: rgba(99, 102, 241, 0.1);
  padding: 0.5rem;
  border-radius: 8px;
  border: 1px solid rgba(99, 102, 241, 0.2);
  display: inline-block;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: left;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #cbd5e1;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  color: #64748b;
  pointer-events: none;
}

.input-wrapper input {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 2.75rem;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: white;
  font-family: inherit;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.input-wrapper input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
  background: rgba(15, 23, 42, 0.8);
}

.input-wrapper input.input-error {
  border-color: #ef4444;
}

.input-wrapper input.input-error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
}

.error-text {
  font-size: 0.8rem;
  color: #f87171;
  font-weight: 500;
}

.submit-btn {
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: white;
  border: none;
  padding: 0.875rem;
  border-radius: 12px;
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.2);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.3);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Dashboard Style */
.dashboard-container {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.dashboard-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 2rem;
  background: rgba(15, 23, 42, 0.8);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 700;
  font-size: 1.25rem;
  color: white;
}

.nav-logo svg {
  color: #6366f1;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #f87171;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.logout-btn:hover {
  background: #ef4444;
  border-color: #ef4444;
  color: white;
}

.dashboard-content {
  flex: 1;
  padding: 3rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

.welcome-card {
  background: rgba(30, 41, 59, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 4rem;
  text-align: center;
  backdrop-filter: blur(8px);
}

.welcome-card h1 {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #fff, #94a3b8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.welcome-card p {
  color: #94a3b8;
  font-size: 1.1rem;
  margin-top: 1rem;
  margin-bottom: 0;
}
`
  );

  console.log("📁 Dummy files created successfully");
}

module.exports = { setupStructure };