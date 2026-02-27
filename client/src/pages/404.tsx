import { Navigate, useRouteError } from "react-router";
import img from "../assets/rimowa.png";

export default function ErrorPage() {
  const error = useRouteError() as any;
  if (error?.message === "Unauthorized") return <Navigate to="/login" />;

  return (
    <div className="flex flex-col items-center">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error?.data || error?.message}</i>
      </p>
      <img src={img} alt="rosé" />
    </div>
  );
}
