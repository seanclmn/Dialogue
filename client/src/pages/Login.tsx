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
    formState: { errors },
  } = useForm<Inputs>();

  if (cookies["accessToken"]) return <Navigate to="/" />;

  return (
    <form
      className="flex flex-col items-center max-w-60 mx-auto pt-32"
      onSubmit={(e) => {
        e.preventDefault();
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
      }}
    >
      <img src={logo} className="h-16 my-2" />
      <Input
        styles="my-1 text-sm py-[5px]"
        title="Username"
        {...register("username", { required: true })}
        onChange={(e) =>
          setCreds({ ...creds, username: e.currentTarget.value })
        }
      />
      {errors.username ? <InputError message={"wonton"} /> : null}

      <Input
        styles="my-1 text-sm py-[5px]"
        title="Password"
        {...register("password", { required: true })}
        onChange={(e) =>
          setCreds({ ...creds, password: e.currentTarget.value })
        }
      />
      {errors.password ? <InputError message={"wonton"} /> : null}

      <Button
        title="Log in"
        type="submit"
        styles="text-sm py-[5px] my-2"
        loading={isMutationInFlight}
        disabled={isMutationInFlight}
      />

      <Link to="/signup">
        <p className="my-2">Sign up here</p>
      </Link>
    </form>
  );
};
