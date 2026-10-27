import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import GameApp from "../app/page";
import "../app/globals.css";
import "../app/usability.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <GameApp />,
    children: [
      { index: true, element: null },
      { path: "profile", element: null },
      { path: "help", element: null },
      { path: "ranking", element: null },
      { path: "mode", element: null },
      { path: "categories", element: null },
      { path: "game/question", element: null },
      { path: "game/feedback", element: null },
      { path: "result", element: null },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
