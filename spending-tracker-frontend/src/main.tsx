import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import 'bootstrap/dist/js/bootstrap.js'
import 'bootstrap/dist/css/bootstrap.css'
import { CursorTrail } from "./components/Cursor.tsx";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CursorTrail />
    <App />
  </StrictMode>,
);
