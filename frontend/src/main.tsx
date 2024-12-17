import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import Times from "./pages/Times";
import Torcedores from "./pages/Torcedores";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/times" element={<Times />} />
          <Route path="/torcedores" element={<Torcedores />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  </StrictMode>
);