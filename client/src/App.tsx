import { lazy, Suspense, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import { useCookies } from "react-cookie";
import { ToastProvider } from "./components/common/ToastProvider";
import { SplashLogo } from "@components/shared/loaders/SplashLogo";

const ErrorPage = lazy(() => import("./pages/404"));
const Login = lazy(() => import("./pages/Login").then((m) => ({ default: m.Login })));
const Signup = lazy(() => import("./pages/Signup").then((m) => ({ default: m.Signup })));
const Page = lazy(() => import("./Page"));
const ChatContainer = lazy(() => import("@components/chat/ChatContainer").then((m) => ({ default: m.ChatContainer })));
const EditProfile = lazy(() => import("./pages/EditProfile").then((m) => ({ default: m.EditProfile })));
const Chats = lazy(() => import("./pages/Chats").then((m) => ({ default: m.Chats })));
const SearchUsers = lazy(() => import("./pages/SearchUsers").then((m) => ({ default: m.SearchUsers })));
const UserProfile = lazy(() => import("./pages/UserProfile").then((m) => ({ default: m.UserProfile })));
const Notifications = lazy(() => import("./pages/Notifications").then((m) => ({ default: m.Notifications })));

export const RouterParent = () => {
  const [cookies, setCookies] = useCookies(["accessToken", "theme"]);
  useEffect(() => {
    if (!cookies["theme"]) {
      setCookies("theme", "light");
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.setAttribute("data-theme", cookies["theme"]);
    }
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: !cookies["accessToken"] ? <Login /> : <Page />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/",
          element: <Chats />,
          children: [
            {
              path: "chats/:id",
              element: <ChatContainer />,
            },
          ],
        },
        {
          path: "/chats",
          element: <Chats />,
        },
        {
          path: "editprofile",
          element: <EditProfile />,
          errorElement: <ErrorPage />,
        },
        {
          path: "friends",
          element: <EditProfile />,
          errorElement: <ErrorPage />,
        },
        {
          path: "search",
          element: <SearchUsers />,
          errorElement: <ErrorPage />,
        },
        {
          path: "/u/:username",
          element: <UserProfile />,
        },
        {
          path: "/notifications",
          element: <Notifications />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/signup",
      element: <Signup />,
      errorElement: <ErrorPage />,
    },
  ]);
  
  return (
    <Suspense fallback={<SplashLogo />}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

export const App = () => {
  return (
    <>
      <ToastProvider />
      <RouterParent />
    </>
  );
};
