import { useRouteError } from "react-router-dom";
import img from "../assets/rimowa.png";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="flex flex-col items-center">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
      <img src={img} alt="rosé" />
    </div>
  );
}
