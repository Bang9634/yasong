
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";

  // 개발 환경에서만 SEO 테스트 도구 로드
  if (import.meta.env.DEV) {
    import('./utils/seo-test');
  }

  createRoot(document.getElementById("root")!).render(<App />);
  