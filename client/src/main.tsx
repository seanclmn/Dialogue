import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App.tsx";
import "./index.css";
import { CookiesProvider } from "react-cookie";
import { RelayProvider } from "./RelayProvider.tsx";
import { Loader } from "@components/shared/loaders/Loader.tsx";
import { UserProvider } from "./UserContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CookiesProvider>
      <RelayProvider>
        <Suspense fallback={<Loader />}>
          <UserProvider>
            <App />
          </UserProvider>
        </Suspense>
      </RelayProvider>
    </CookiesProvider>
  </React.StrictMode>

);
