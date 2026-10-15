import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { getRouter } from "./router";
import { BackgroundMusic } from "./components/portfolio/BackgroundMusic";

const router = getRouter();

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <BackgroundMusic />
      <RouterProvider router={router} />
    </StrictMode>,
  );
}
