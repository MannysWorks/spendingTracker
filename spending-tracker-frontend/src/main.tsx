import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import "bootstrap/dist/js/bootstrap.js";
import "bootstrap/dist/css/bootstrap.css";

import App, {
  ActivityPage,
  HomePage,
} from "./App.tsx";
import EntriesPage from "./pages/EntriesPage.tsx";
import { Login } from "./pages/Login.tsx";
import { Register } from "./pages/Register.tsx";
import { AboutPage } from "./pages/AboutPage.tsx";
import { GenericErrorPage } from "./pages/GenericErrorPage.tsx";

import { AuthProvider } from "./Services/AuthProvider.tsx";
import { ProtectedRoute } from "./Services/ProtectedRoute.tsx";

const handleRegisterClick = (): void => {
  window.location.assign("/register");
};

const handleLoginClick = (): void => {
  window.location.assign("/login");
};

const isAuthenticated = Boolean(
  localStorage.getItem("token"),
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <AboutPage />,
    errorElement: <GenericErrorPage />,
  },
  {
    path: "/register",
    element: (
      <Register onLoginClick={handleLoginClick} />
    ),
  },
  {
    path: "/login",
    element: (
      <Login
        onRegisterClick={handleRegisterClick}
      />
    ),
  },
  {
    element: <ProtectedRoute />,
    errorElement: <GenericErrorPage />,
    children: [
      {
        element: <App />,
        children: [
          {
            path: "/home",
            element: <HomePage />,
          },
          {
            path: "/table",
            element: <EntriesPage />,
          },
          {
            path: "/entries",
            element: (
              <Navigate
                to="/table"
                replace
              />
            ),
          },
          {
            path: "/activity",
            element: <ActivityPage />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <GenericErrorPage />,
  },
]);

createRoot(
  document.getElementById("root")!,
).render(
  <StrictMode>
    <AuthProvider
      isSighnedIn={isAuthenticated}
    >
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);
