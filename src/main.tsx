import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ReactGA from "react-ga4";
import "./index.css";
import App from "./App.tsx";

// GA 초기화 (G-DHPM3PN810는 본인 측정 ID 확인)
// (운영 환경에서만 실행하는 것을 권장합니다)
if (process.env.NODE_ENV === "production") {
  ReactGA.initialize("G-DHPM3PN810");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
