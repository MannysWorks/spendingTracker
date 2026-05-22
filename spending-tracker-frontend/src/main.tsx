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

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      { path: "/", element: <App /> }
    ]
  },
  { path: "/login", element: <Login /> },
  { path: "*", element: <NotFoundPage /> }
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CursorTrail />
    <AuthProvider isSighnedIn={true}>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
