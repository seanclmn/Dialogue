import { Button } from "../components/shared/Buttons/GenericButton";
import { Input } from "../components/shared/Inputs/GenericInput";
import { graphql } from "relay-runtime";
import { useMutation } from "react-relay";
import { useCookies } from "react-cookie";
import { Navigate } from "react-router";
import {
  LoginMutation,
  LoginMutation$data,
} from "@generated/LoginMutation.graphql";
import { Link } from "react-router";
import logo from "../assets/logo.png";
import { InputError } from "@components/error/InputError";
import { Controller, useForm } from "react-hook-form";
const mutation = graphql`
  mutation LoginMutation($username: String!, $password: String!) {
    login(loginUserInput: { username: $username, password: $password }) {
      user {
        username
      }
      accessToken
    }
  }
`;

type Inputs = {
  username: string;
  password: string;
};

export const Login = () => {
  const [cookies, setCookie] = useCookies(["accessToken"]);
  const [commitMutation, isMutationInFlight] =
    useMutation<LoginMutation>(mutation);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Inputs>();

  if (cookies["accessToken"]) return <Navigate to="/" />;

  const onSubmit = (creds: Inputs) => {
    commitMutation({
      variables: {
        username: creds.username,
        password: creds.password,
      },
      onCompleted: (data: LoginMutation$data) => {
        setCookie("accessToken", data.login.accessToken);
      },
      onError: (e) => {
        console.log(e);
        // setErrors("Username or password was invalid")
      },
    });
  };

  const loginAs = (username: string) => {
    commitMutation({
      variables: {
        username,
        password: "password123",
      },
      onCompleted: (data: LoginMutation$data) => {
        setCookie("accessToken", data.login.accessToken);
      },
    });
  };

  return (
    <div className="flex flex-col items-center max-w-60 mx-auto pt-32 min-h-screen bg-bgd-color text-txt-color transition-colors duration-200">
      <form className="flex flex-col items-center w-full" onSubmit={handleSubmit(onSubmit)}>
        <p className="text-5xl my-4 cedarville-cursive-regular">Dialogue</p>
        <Controller
          control={control}
          render={({ field }) => (
            <Input styles="my-1 text-sm" title="Username" {...field} />
          )}
          name="username"
          rules={{ required: true }}
        />
        {errors.username?.type === "required" && (
          <InputError message={"Username is required"} />
        )}
        <Controller
          control={control}
          render={({ field }) => (
            <Input styles="my-1 text-sm" title="Password" {...field} />
          )}
          name="password"
          rules={{ required: true }}
        />
        {errors.password?.type === "required" && (
          <InputError message={"Password is required"} />
        )}
        <Button
          title="Log in"
          type="submit"
          styles="text-sm my-2"
          loading={isMutationInFlight}
          disabled={isMutationInFlight}
        />
      </form>

      <div className="flex flex-col w-full gap-2 mt-4">
        <p className="text-xs text-gray-500 text-center">Quick Login (Dev)</p>
        <div className="flex gap-2">
          {["alice", "bob", "charlie"].map((user) => (
            <Button
              key={user}
              title={user}
              type="button"
              styles="text-[10px] py-1 bg-gray-100 !text-gray-600 border-gray-200"
              onClick={() => loginAs(user)}
              disabled={isMutationInFlight}
            />
          ))}
        </div>
      </div>

      <Link to="/signup">
        <p className="my-2 text-sm">Sign up here</p>
      </Link>
    </div>
  );
};
