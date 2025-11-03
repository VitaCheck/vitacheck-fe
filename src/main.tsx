// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import "./index.css";
// import App from "./App.tsx";

// createRoot(document.getElementById("root")!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>
// );

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // 1. BrowserRouter import
import ReactGA from "react-ga4"; // 2. ReactGA import
import "./index.css";
import App from "./App.tsx";

// 3. GA 초기화 (G-DHPM3PN810는 본인 측정 ID 확인)
// (운영 환경에서만 실행하는 것을 권장합니다)
if (process.env.NODE_ENV === "production") {
  ReactGA.initialize("G-DHPM3PN810");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
