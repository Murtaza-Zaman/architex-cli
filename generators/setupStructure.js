const fs = require("fs");
const path = require("path");

function setupStructure(projectPath) {
  console.log("📁 Creating architecture with files...");

  // ── Helpers ──────────────────────────────────────────────────
  const createFile = (filePath, content) => {
    const fullPath = path.join(projectPath, filePath);
    const dirPath = path.dirname(fullPath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(fullPath, content);
  };

  const deleteFile = (filePath) => {
    const fullPath = path.join(projectPath, filePath);
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
  };

  // Delete default Vite App.css
  deleteFile("src/App.css");

  // ─────────────────────────────────────────────────────────────
  // 📁 ENTRY POINT
  // Chain: src/pages/index.js → AppRoutes → main.jsx
  // ─────────────────────────────────────────────────────────────
  createFile(
    "src/main.jsx",
    `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./services/interceptors";
import { AuthProvider } from "./features/auth/context/AuthContext.jsx";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppRoutes from "./routes/AppRoutes";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <StrictMode>
      <AuthProvider>
        <AppRoutes />
        <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      </AuthProvider>
    </StrictMode>
  </QueryClientProvider>
);`
  );

  // ─────────────────────────────────────────────────────────────
  // 📁 ROUTE CONSTANTS
  // ─────────────────────────────────────────────────────────────
  createFile(
    "src/constraints/routes.js",
    `// Central route path constants — import this everywhere, never use raw strings.
export const routes = {
  // ── Public Pages ────────────────────────────────────────────
  HOME: "/",
  PRODUCTS: "/products",
  PRODUCT_DETAILS: "/product/:id",
  ABOUT_US: "/about-us",
  CONTACT_US: "/contact-us",
  FAQ: "/faq",
  BLOG: "/blog",
  BLOG_DETAILS: "/blog/:id",
  TERMS: "/terms-and-conditions",
  PRIVACY: "/privacy-policy",

  // ── Authentication ───────────────────────────────────────────
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/sent-otp",
  RESET_PASSWORD: "/reset-password",
  VERIFY_OTP: "/verify-otp",
  SET_NEW_PASSWORD: "/set-new-password",

  // ── User Account / Profile ───────────────────────────────────
  PROFILE: "/profile",
  EDIT_PROFILE: "/profile/edit",
  CHANGE_PASSWORD: "/profile/change-password",
  ORDER_HISTORY: "/orders",
  ORDER_DETAILS: "/orders/:id",
  WISHLIST: "/wishlist",
  CART: "/cart",
  CHECKOUT: "/checkout",
  PAYMENT_SUCCESS: "/payment-success",
  PAYMENT_FAILED: "/payment-failed",

  // ── Admin Panel ──────────────────────────────────────────────
  ADMIN_DASHBOARD: "/admin-dashboard",
  ADMIN_PRODUCTS: "/admin-products",
  ADMIN_ADD_PRODUCT: "/admin-products/add",
  ADMIN_EDIT_PRODUCT: "/admin-products/edit/:id",
  ADMIN_ORDERS: "/admin-orders",
  ADMIN_USERS: "/admin-users",
  ADMIN_CATEGORIES: "/admin-categories",
  ADMIN_ADD_CATEGORY: "/admin-categories/add",
  ADMIN_EDIT_CATEGORY: "/admin-categories/edit/:id",
  ADMIN_REVIEWS: "/admin-reviews",
  ADMIN_SETTINGS: "/admin-settings",

  // ── Category & Search ────────────────────────────────────────
  CATEGORY: "/category/:slug",
  SEARCH: "/search",

  // ── Error / Not Found ────────────────────────────────────────
  NOT_FOUND: "/404",
};`
  );

  // ═══════════════════════════════════════════════════════════════
  // 📁 FEATURES / AUTH
  //
  // Structure:
  //   src/features/auth/
  //     ├── components/   ← reusable UI pieces (forms, inputs…)
  //     │     └── index.js
  //     ├── context/      ← AuthContext + AuthProvider
  //     │     └── index.js
  //     ├── hooks/        ← useAuth
  //     │     └── index.js
  //     ├── schema/       ← Zod validation schemas
  //     │     └── index.js
  //     ├── pages/        ← full page components (LoginPage, etc.)
  //     │     └── index.js
  //     └── index.js      ← re-exports from ALL sub-folder barrels
  // ═══════════════════════════════════════════════════════════════

  // ── auth / context ───────────────────────────────────────────
  createFile(
    "src/features/auth/context/AuthContext.jsx",
    `import { createContext, useContext, useState } from "react";

// TODO: Replace this stub with your real auth context implementation.
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem("role") === "admin");

  return (
    <AuthContext.Provider value={{ token, setToken, isAdmin, setIsAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}`
  );

  createFile(
    "src/features/auth/context/index.js",
    `export { AuthProvider, useAuthContext } from "./AuthContext";`
  );

  // ── auth / hooks ─────────────────────────────────────────────
  createFile(
    "src/features/auth/hooks/useAuth.jsx",
    `// TODO: Replace with your real auth implementation.
// AdminProtectedRoute expects { token, isAdmin, loading }.
import { useState, useEffect } from "react";

export default function useAuth() {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole  = localStorage.getItem("role");
    setToken(storedToken || null);
    setIsAdmin(storedRole === "admin");
    setLoading(false);
  }, []);

  return { token, isAdmin, loading };
}`
  );

  createFile(
    "src/features/auth/hooks/index.js",
    `export { default as useAuth } from "./useAuth";`
  );

  // ── auth / schema ────────────────────────────────────────────
  createFile(
    "src/features/auth/schema/authSchema.js",
    `// TODO: Add your Zod validation schemas here.
// import { z } from "zod";

// export const loginSchema = z.object({
//   email: z.string().email("Invalid email address"),
//   password: z.string().min(6, "Password must be at least 6 characters"),
// });

// export const registerSchema = z.object({
//   name: z.string().min(2, "Name must be at least 2 characters"),
//   email: z.string().email("Invalid email address"),
//   password: z.string().min(6, "Password must be at least 6 characters"),
// });`
  );

  createFile(
    "src/features/auth/schema/index.js",
    `export * from "./authSchema";`
  );

  // ── auth / components ────────────────────────────────────────
  // (reusable UI pieces — forms, inputs, etc.)
  createFile(
    "src/features/auth/components/index.js",
    `// Export reusable auth UI components here.
// Example:
// export { default as AuthInput } from "./AuthInput";`
  );

  // ── auth / pages ─────────────────────────────────────────────
  const authPageFiles = [
    ["LoginPage",         "Login Page"],
    ["RegisterPage",      "Register Page"],
    ["ForgotPasswordPage","Forgot Password Page"],
    ["VerifyOTPPage",     "Verify OTP Page"],
    ["SetNewPasswordPage","Set New Password Page"],
  ];

  authPageFiles.forEach(([name, title]) => {
    createFile(
      `src/features/auth/pages/${name}.jsx`,
      `export default function ${name}() {
  return <div><h1>${title}</h1></div>;
}`
    );
  });

  createFile(
    "src/features/auth/pages/index.js",
    `export { default as LoginPage }          from "./LoginPage";
export { default as RegisterPage }       from "./RegisterPage";
export { default as ForgotPasswordPage } from "./ForgotPasswordPage";
export { default as VerifyOTPPage }      from "./VerifyOTPPage";
export { default as SetNewPasswordPage } from "./SetNewPasswordPage";`
  );

  // ── auth / index.js  (main auth barrel) ──────────────────────
  createFile(
    "src/features/auth/index.js",
    `// ── Auth feature barrel ────────────────────────────────────────
// Everything from auth is re-exported here so the rest of the app
// only needs to import from "features/auth", never from deep paths.

export * from "./context/index";
export * from "./hooks/index";
export * from "./schema/index";
export * from "./components/index";
export * from "./pages/index";`
  );

  // ═══════════════════════════════════════════════════════════════
  // 📁 SRC / PAGES
  //
  // Public & admin page stubs live in their own sub-folders.
  // src/pages/index.js is the central barrel that re-exports
  // pages from every feature barrel + the local public/admin pages.
  // ═══════════════════════════════════════════════════════════════

  // ── Public pages ─────────────────────────────────────────────
  createFile(
    "src/pages/PublicPages/HomePage.jsx",
    `export default function HomePage() {
  return <div><h1>Home Page</h1></div>;
}`
  );

  createFile(
    "src/pages/PublicPages/ProductsPage.jsx",
    `export default function ProductsPage() {
  return <div><h1>Products Page</h1></div>;
}`
  );

  createFile(
    "src/pages/PublicPages/ProductDetailsPage.jsx",
    `export default function ProductDetailsPage() {
  return <div><h1>Product Details Page</h1></div>;
}`
  );

  createFile(
    "src/pages/PublicPages/NotFoundPage.jsx",
    `export default function NotFoundPage() {
  return (
    <div style={{ textAlign: "center", marginTop: "4rem" }}>
      <h1>404 — Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </div>
  );
}`
  );

  // ── Admin pages ──────────────────────────────────────────────
  const adminPageFiles = [
    ["dashboardPages/AdminDashboardPage",     "AdminDashboardPage",    "Dashboard"],
    ["productsPages/AdminProductsPage",       "AdminProductsPage",     "Products"],
    ["productsPages/AdminAddProductPage",     "AdminAddProductPage",   "Add Product"],
    ["productsPages/AdminEditProductPage",    "AdminEditProductPage",  "Edit Product"],
    ["ordersPage/AdminOrdersPage",            "AdminOrdersPage",       "Orders"],
    ["usersPage/AdminUsersPage",              "AdminUsersPage",        "Users"],
    ["categoriesPages/AdminCategoryPage",     "AdminCategoryPage",     "Categories"],
    ["categoriesPages/AdminAddCategoryPage",  "AdminAddCategoryPage",  "Add Category"],
    ["categoriesPages/AdminEditCategoryPage", "AdminEditCategoryPage", "Edit Category"],
    ["reviewsPage/AdminReviewsPage",          "AdminReviewsPage",      "Reviews"],
    ["settingsPage/AdminSettingsPage",        "AdminSettingsPage",     "Settings"],
  ];

  adminPageFiles.forEach(([filePath, componentName, title]) => {
    createFile(
      `src/pages/AdminPages/${filePath}.jsx`,
      `export default function ${componentName}() {
  return <div><h1>Admin — ${title}</h1></div>;
}`
    );
  });

  // ── src/pages/index.js  (central pages barrel) ───────────────
  createFile(
    "src/pages/index.js",
    `// ── Central pages barrel ────────────────────────────────────────
// Import all pages from feature barrels and local page folders.
// AppRoutes (and anywhere else) should import pages from here.

// ── From features ───────────────────────────────────────────────
export {
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  VerifyOTPPage,
  SetNewPasswordPage,
} from "../features/auth";

// ── Public pages ────────────────────────────────────────────────
export { default as HomePage }          from "./PublicPages/HomePage";
export { default as ProductsPage }      from "./PublicPages/ProductsPage";
export { default as ProductDetailsPage } from "./PublicPages/ProductDetailsPage";
export { default as NotFoundPage }      from "./PublicPages/NotFoundPage";

// ── Admin pages ─────────────────────────────────────────────────
export { default as AdminDashboardPage }    from "./AdminPages/dashboardPages/AdminDashboardPage";
export { default as AdminProductsPage }     from "./AdminPages/productsPages/AdminProductsPage";
export { default as AdminAddProductPage }   from "./AdminPages/productsPages/AdminAddProductPage";
export { default as AdminEditProductPage }  from "./AdminPages/productsPages/AdminEditProductPage";
export { default as AdminOrdersPage }       from "./AdminPages/ordersPage/AdminOrdersPage";
export { default as AdminUsersPage }        from "./AdminPages/usersPage/AdminUsersPage";
export { default as AdminCategoryPage }     from "./AdminPages/categoriesPages/AdminCategoryPage";
export { default as AdminAddCategoryPage }  from "./AdminPages/categoriesPages/AdminAddCategoryPage";
export { default as AdminEditCategoryPage } from "./AdminPages/categoriesPages/AdminEditCategoryPage";
export { default as AdminReviewsPage }      from "./AdminPages/reviewsPage/AdminReviewsPage";
export { default as AdminSettingsPage }     from "./AdminPages/settingsPage/AdminSettingsPage";`
  );

  // ─────────────────────────────────────────────────────────────
  // 📁 ROUTES
  // ─────────────────────────────────────────────────────────────
  createFile(
    "src/routes/AdminProtectedRoute.jsx",
    `import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { routes } from "../constraints/routes";
import { useAuth } from "../features/auth";

const AdminProtectedRoute = () => {
  const { token, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <span className="loading-spinner" />
      </div>
    );
  }

  if (!token)   return <Navigate to={routes.LOGIN} replace />;
  if (!isAdmin) return <Navigate to={routes.HOME}  replace />;

  return <Outlet />;
};

export default AdminProtectedRoute;`
  );

  createFile(
    "src/routes/AppRoutes.jsx",
    `import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { routes } from "../constraints/routes";

// ── Layouts ────────────────────────────────────────────────────
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";

// ── All pages from the central barrel ─────────────────────────
import {
  // Public
  HomePage,
  ProductsPage,
  ProductDetailsPage,
  NotFoundPage,
  // Auth
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  VerifyOTPPage,
  SetNewPasswordPage,
  // Admin
  AdminDashboardPage,
  AdminProductsPage,
  AdminAddProductPage,
  AdminEditProductPage,
  AdminOrdersPage,
  AdminUsersPage,
  AdminCategoryPage,
  AdminAddCategoryPage,
  AdminEditCategoryPage,
  AdminReviewsPage,
  AdminSettingsPage,
} from "../pages";

// ── Route guard ────────────────────────────────────────────────
import AdminProtectedRoute from "./AdminProtectedRoute";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>

        {/* ════════════════ PUBLIC WEBSITE ════════════════ */}
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path={routes.PRODUCTS} element={<ProductsPage />} />
          <Route path={routes.PRODUCT_DETAILS} element={<ProductDetailsPage />} />
        </Route>

        {/* ════════════════ AUTH ══════════════════════════ */}
        <Route path={routes.LOGIN}            element={<LoginPage />} />
        <Route path={routes.REGISTER}         element={<RegisterPage />} />
        <Route path={routes.FORGOT_PASSWORD}  element={<ForgotPasswordPage />} />
        <Route path={routes.VERIFY_OTP}       element={<VerifyOTPPage />} />
        <Route path={routes.SET_NEW_PASSWORD} element={<SetNewPasswordPage />} />

        {/* ════════════════ ADMIN (PROTECTED) ═════════════ */}
        <Route element={<AdminProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path={routes.ADMIN_DASHBOARD}    element={<AdminDashboardPage />} />
            <Route path={routes.ADMIN_PRODUCTS}     element={<AdminProductsPage />} />
            <Route path={routes.ADMIN_ADD_PRODUCT}  element={<AdminAddProductPage />} />
            <Route path={routes.ADMIN_EDIT_PRODUCT} element={<AdminEditProductPage />} />
            <Route path={routes.ADMIN_ORDERS}       element={<AdminOrdersPage />} />
            <Route path={routes.ADMIN_USERS}        element={<AdminUsersPage />} />
            <Route path={routes.ADMIN_CATEGORIES}   element={<AdminCategoryPage />} />
            <Route path={routes.ADMIN_ADD_CATEGORY}  element={<AdminAddCategoryPage />} />
            <Route path={routes.ADMIN_EDIT_CATEGORY} element={<AdminEditCategoryPage />} />
            <Route path={routes.ADMIN_REVIEWS}      element={<AdminReviewsPage />} />
            <Route path={routes.ADMIN_SETTINGS}     element={<AdminSettingsPage />} />
          </Route>
        </Route>

        {/* ════════════════ FALLBACK ═══════════════════════ */}
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </Router>
  );
};

export default AppRoutes;`
  );

  // ─────────────────────────────────────────────────────────────
  // 📁 LAYOUTS
  // ─────────────────────────────────────────────────────────────

  // ── Main (public) layout ─────────────────────────────────────
  createFile(
    "src/layouts/MainLayout.jsx",
    `import { Outlet } from "react-router-dom";
import Navbar from "../components/ui/Navbar";
import Footer from "../components/ui/Footer";

export default function MainLayout() {
  return (
    <div className="main-layout">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}`
  );

  // ── Admin / Dashboard layout ──────────────────────────────────
  createFile(
    "src/layouts/AdminLayout.jsx",
    `import { Outlet } from "react-router-dom";
import DashboardHeader from "../components/admin/DashboardHeader";
import Sidebar from "../components/admin/Sidebar";

export default function AdminLayout() {
  return (
    <>
      <DashboardHeader />
      <div className="admin-body">
        <Sidebar />
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </>
  );
}`
  );

  // ─────────────────────────────────────────────────────────────
  // 📁 UI COMPONENTS (used by layouts)
  // ─────────────────────────────────────────────────────────────
  createFile(
    "src/components/ui/Navbar.jsx",
    `// TODO: Build out the public Navbar.
export default function Navbar() {
  return <nav className="navbar">Navbar</nav>;
}`
  );

  createFile(
    "src/components/ui/Footer.jsx",
    `// TODO: Build out the Footer.
export default function Footer() {
  return <footer className="footer">Footer</footer>;
}`
  );

  createFile(
    "src/components/admin/DashboardHeader.jsx",
    `// TODO: Build out the admin dashboard header / topbar.
export default function DashboardHeader() {
  return <header className="dashboard-header">Dashboard Header</header>;
}`
  );

  createFile(
    "src/components/admin/Sidebar.jsx",
    `// TODO: Build out the admin sidebar navigation.
export default function Sidebar() {
  return <aside className="sidebar">Sidebar</aside>;
}`
  );


  // ─────────────────────────────────────────────────────────────
  // 📁 SERVICES
  // ─────────────────────────────────────────────────────────────
  createFile(
    "src/services/api.js",
    `import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://api.example.com",
});

export default api;`
  );

  createFile(
    "src/services/interceptors.js",
    `// Imported in main.jsx — runs before anything else.
// TODO: Customise request/response interceptors as needed.
import api from "./api";

// Request — attach Bearer token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = \`Bearer \${token}\`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response — handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);`
  );

  // ─────────────────────────────────────────────────────────────
  // 📁 UTILS
  // ─────────────────────────────────────────────────────────────
  createFile(
    "src/utils/helpers.js",
    `export const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};`
  );

  // ─────────────────────────────────────────────────────────────
  // 📁 HOOKS  (src/hooks)  — global / shared hooks
  // Feature-specific hooks live inside their feature folder.
  // ─────────────────────────────────────────────────────────────
  createFile(
    "src/hooks/useDebounce.js",
    `import { useState, useEffect } from "react";

// Generic debounce hook — useful for search inputs, etc.
export default function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}`
  );

  createFile(
    "src/hooks/useLocalStorage.js",
    `import { useState } from "react";

// Persist state to localStorage automatically.
export default function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}`
  );

  createFile(
    "src/hooks/index.js",
    `// Global shared hooks barrel.
// Feature-specific hooks are exported from their own feature barrel.
export { default as useDebounce }     from "./useDebounce";
export { default as useLocalStorage } from "./useLocalStorage";`
  );

  // ─────────────────────────────────────────────────────────────
  // 📁 COMPONENTS  (src/components)  — shared / global components
  // ui/      → public-facing UI atoms (Navbar, Footer, Button…)
  // admin/   → admin-specific atoms (Sidebar, DashboardHeader…)
  // ─────────────────────────────────────────────────────────────
  createFile(
    "src/components/index.js",
    `// Global shared components barrel.
// Import from here instead of deep paths.

// ── UI (public) ─────────────────────────────────────────────────
export { default as Navbar } from "./ui/Navbar";
export { default as Footer } from "./ui/Footer";

// ── Admin ────────────────────────────────────────────────────────
export { default as DashboardHeader } from "./admin/DashboardHeader";
export { default as Sidebar }         from "./admin/Sidebar";`
  );

  // ─────────────────────────────────────────────────────────────
  // 📁 ENV FILES
  // Vite exposes variables prefixed with VITE_ via import.meta.env.
  // Never commit .env — commit only .env.example.
  // ─────────────────────────────────────────────────────────────
  createFile(
    ".env",
    `# ── App ────────────────────────────────────────────────────────
VITE_APP_NAME=MyApp

# ── API ─────────────────────────────────────────────────────────
VITE_API_BASE_URL=http://localhost:5000/api

# ── Auth (optional) ─────────────────────────────────────────────
# VITE_GOOGLE_CLIENT_ID=your-google-client-id`
  );

  createFile(
    ".env.example",
    `# Copy this file to .env and fill in your values.
# Vite only exposes variables prefixed with VITE_ to the browser.

VITE_APP_NAME=
VITE_API_BASE_URL=
# VITE_GOOGLE_CLIENT_ID=`
  );

  // ─────────────────────────────────────────────────────────────
  // 📁 STYLES
  // ─────────────────────────────────────────────────────────────
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
  min-width: 320px;
  min-height: 100vh;
  background: radial-gradient(circle at top right, rgba(99, 102, 241, 0.15), transparent 40%),
              radial-gradient(circle at bottom left, rgba(244, 63, 94, 0.1), transparent 40%),
              #0f172a;
}

#root {
  width: 100%;
  min-height: 100vh;
}

/* ── Layouts ─────────────────────────────────────────────────── */
.main-layout,
.admin-layout {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
}

.main-content {
  flex: 1;
}

.footer {
  margin-top: auto;
}

/* ── Loading screen ──────────────────────────────────────────── */
.loading-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.loading-spinner {
  display: block;
  width: 40px;
  height: 40px;
  border: 3px solid rgba(99, 102, 241, 0.2);
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
`
  );

  console.log("✅ Architecture created successfully");
}

module.exports = { setupStructure };