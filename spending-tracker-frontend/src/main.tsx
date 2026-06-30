import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import 'bootstrap/dist/js/bootstrap.js'
import 'bootstrap/dist/css/bootstrap.css'
import { CursorTrail } from "./components/Cursor.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Login } from "./pages/Login.tsx";
import { AuthProvider } from "./Services/AuthProvider.tsx";
import { ProtectedRoute } from "./Services/ProtectedRoute.tsx";
import { Register } from "./pages/Register.tsx";
import { GenericErrorPage } from "./pages/GenericErrorPage.tsx";
import { AboutPage } from "./pages/AboutPage.tsx";

// Handle navigation to login and register pages
const handleRegisterClick = () => {
  // Navigate to the register page
  window.location.href = "/register";
};
const handleLoginClick = () => {
  // Navigate to the login page
  window.location.href = "/login";
}

// Check if the user is authenticated by verifying the presence of a token in localStorage.
const isAuthenticated = !!localStorage.getItem("token");

const router = createBrowserRouter([
  {
    path: "/home",
    element: <ProtectedRoute />,
    children: [
      { path: "/home", element: <App /> }
    ],
    errorElement: <GenericErrorPage />
  },
  { path: "/", element: <AboutPage /> },
  { path: "/register", element: <Register onLoginClick={handleLoginClick} /> },
  { path: "/login", element: <Login onRegisterClick={handleRegisterClick} /> },
  { path: "*", element: <GenericErrorPage /> }
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CursorTrail />
    <AuthProvider isSighnedIn={isAuthenticated}>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
