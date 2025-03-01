import { useState } from "react";
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
  const [creds, setCreds] = useState({ username: "", password: "" });
  const [cookies, setCookie] = useCookies(["accessToken"]);
  const [commitMutation, isMutationInFlight] =
    useMutation<LoginMutation>(mutation);

  const {
    register,
    handleSubmit,
    watch,
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
  }

  console.log(errors)

  return (
    <form
      className="flex flex-col items-center max-w-60 mx-auto pt-32"
      onSubmit={handleSubmit(onSubmit)}
    >
      <img src={logo} className="h-16 my-2" />
      <Controller
        control={control}
        render={({ field }) => (
          <Input
            styles="my-1 text-sm"
            title="Username"
            {...field}
          />
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
          <Input
            styles="my-1 text-sm"
            title="Password"
            {...field}
          />
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

      <Link to="/signup">
        <p className="my-2">Sign up here</p>
      </Link>
    </form>
  );
};
