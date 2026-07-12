import { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App.tsx";
import "./index.css";
import { CookiesProvider } from "react-cookie";
import { RelayProvider } from "./RelayProvider.tsx";
import { SplashLogo } from "@components/shared/loaders/SplashLogo.tsx";
import { UserProvider } from "./contexts/UserContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <CookiesProvider>
    <RelayProvider>
      <Suspense fallback={<SplashLogo />}>
        <UserProvider>
          <App />
        </UserProvider>
      </Suspense>
    </RelayProvider>
  </CookiesProvider>,
  // </React.StrictMode>
);
