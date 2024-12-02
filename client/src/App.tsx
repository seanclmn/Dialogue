import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./pages/404";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import Page from "./Page";
import { useCookies } from "react-cookie";
import { ChatContainer } from "@components/chat/ChatContainer";
import { EditProfile } from "./pages/EditProfile";
import { Chats } from "./pages/Chats";

export const RouterParent = () => {

  const [cookies,] = useCookies(['accessToken']);

  const router = createBrowserRouter([

    {
      path: "/",
      element: !cookies['accessToken'] ? <Login /> : <Page />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "chats",
          element: <Chats />,
          children: [
            {
              path: ":id",
              element: <ChatContainer />,
            },
          ]
        },
        {
          path: "editprofile",
          element: <EditProfile />,
          errorElement: <ErrorPage />,
        },
      ]
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
    }
  ]);
  return (
    <RouterProvider router={router} />
  )
}

export const App = () => {

  return (
    <RouterParent />
  )
}
