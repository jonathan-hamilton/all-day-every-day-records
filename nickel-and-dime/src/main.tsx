import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider, CssBaseline } from "@mui/material";
import "./styles/global.css";
import theme from "./styles/theme.ts";
import { ReleaseProvider } from "./context/ReleaseContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ReleaseProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ReleaseProvider>
    </ThemeProvider>
  </StrictMode>
);
