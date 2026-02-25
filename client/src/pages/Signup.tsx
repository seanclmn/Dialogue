import { useState } from "react";
import { Button } from "../components/shared/Buttons/GenericButton";
import { Input } from "../components/shared/Inputs/GenericInput";
import { graphql } from "relay-runtime";
import { useMutation } from "react-relay";
import { useCookies } from "react-cookie";
import { Link, Navigate } from "react-router";
import toast from "react-hot-toast";
import {
  SignupMutation,
  SignupMutation$data,
} from "@generated/SignupMutation.graphql";
import logo from "../assets/logo.png";

const mutation = graphql`
  mutation SignupMutation($username: String!, $password: String!) {
    signup(createUserInput: { username: $username, password: $password }) {
      user {
        username
      }
      accessToken
    }
  }
`;

export const Signup = () => {
  const [creds, setCreds] = useState({ username: "", password: "" });
  const [cookies, setCookie] = useCookies(["accessToken"]);
  const [commitMutation] = useMutation<SignupMutation>(mutation);

  if (cookies["accessToken"]) return <Navigate to="/" />;
  return (
    <div className="min-h-screen bg-bgd-color text-txt-color">
      <form
        className="flex flex-col items-center max-w-60 mx-auto pt-32"
        onSubmit={(e) => {
          e.preventDefault();
          commitMutation({
            variables: {
              username: creds.username,
              password: creds.password,
            },
            onCompleted: (data: SignupMutation$data) => {
              setCookie("accessToken", data.signup.accessToken, { path: "/" });
              toast.success("Account created successfully!");
            },
            onError: (e: any) => {
              const message = e.source?.errors?.[0]?.message || e.message || "User already exists";
              toast.error(message);
            },
          });
        }}
      >
        <p className="text-5xl my-4 cedarville-cursive-regular">Dialogue</p>
        <Input
          styles="mb-2 text-sm py-[5px]"
          title="Username"
          onChange={(e) =>
            setCreds({ ...creds, username: e.currentTarget.value })
          }
        />
        <Input
          styles="mb-2 text-sm py-[5px]"
          title="Password"
          onChange={(e) =>
            setCreds({ ...creds, password: e.currentTarget.value })
          }
        />
        <Button title="Sign up" type="submit" styles="text-sm py-[5px]" />
        <Link to="/login">
          <p className="my-2">Log in here</p>
        </Link>
      </form>
    </div>
  );
};
