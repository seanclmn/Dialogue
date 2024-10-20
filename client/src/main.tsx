import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./pages/404.tsx";
import { Login } from "./pages/Login.tsx";
import { CookiesProvider } from "react-cookie";
import { Signup } from "./pages/Signup.tsx";
import { RelayProvider } from "./RelayProvider.tsx";
// import { Loader } from "@components/shared/loaders/Loader.tsx";
console.log("wonton")

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CookiesProvider>
      <RelayProvider>
        {/* <Suspens/e fallback={<></>}> */}
        <App />
        {/* </Suspe/</CookiesProvider>nse> */}
      </RelayProvider>
    </CookiesProvider>
  </React.StrictMode>

);
