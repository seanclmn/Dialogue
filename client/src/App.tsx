import { createBrowserRouter, RouterProvider } from "react-router";
import ErrorPage from "./pages/404";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import Page from "./Page";
import { useCookies } from "react-cookie";
import { ChatContainer } from "@components/chat/ChatContainer";
import { EditProfile } from "./pages/EditProfile";
import { Chats } from "./pages/Chats";
import { SearchUsers } from "./pages/SearchUsers";
import { UserProfile } from "./pages/UserProfile";

export const RouterParent = () => {

  const [cookies,] = useCookies(['accessToken']);

  const router = createBrowserRouter([

    {
      path: "/",
      element: !cookies['accessToken'] ? <Login /> : <Page />,
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
          ]
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
          element: <UserProfile />
        }
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
