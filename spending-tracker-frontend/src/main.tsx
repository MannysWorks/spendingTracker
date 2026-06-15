import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import 'bootstrap/dist/js/bootstrap.js'
import 'bootstrap/dist/css/bootstrap.css'
import { CursorTrail } from "./components/Cursor.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Login } from "./pages/Login.tsx";
import { NotFoundPage } from "./pages/NotfoundPage.tsx";
import { AuthProvider } from "./Services/AuthProvider.tsx";
import { ProtectedRoute } from "./Services/ProtectedRoute.tsx";
import { Register } from "./pages/Register.tsx";


const handleRegisterClick = () => {
  // Navigate to the register page
  window.location.href = "/register";
};
const handleLoginClick = () => {
  // Navigate to the login page
  window.location.href = "/login";
}
const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      { path: "/", element: <App /> }
    ],
    errorElement: <Login onRegisterClick={handleRegisterClick} />
  },
  { path: "/register", element: <Register onLoginClick={handleLoginClick} /> },
  { path: "/login", element: <Login onRegisterClick={handleRegisterClick} /> },
  { path: "*", element: <NotFoundPage /> }
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CursorTrail />
    <AuthProvider isSighnedIn={false}>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
