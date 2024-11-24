import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { SandwichProvider } from "./context/SandwichProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SandwichProvider>
      <App />
    </SandwichProvider>
  </StrictMode>
);
