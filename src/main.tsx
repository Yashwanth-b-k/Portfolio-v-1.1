import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { installTextures } from "./mc/textures";
import { cursor } from "./mc/sprites";
import "./index.css";

// Paint the block textures and the pickaxe cursor before the first render.
installTextures();
document.documentElement.style.setProperty("--cur", cursor(false));
document.documentElement.style.setProperty("--cur-hot", cursor(true));

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
