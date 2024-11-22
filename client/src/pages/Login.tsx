import { useState } from "react";
import { Button } from "../components/shared/Buttons/GenericButton";
import { Input } from "../components/shared/Inputs/GenericInput";
import { graphql } from "relay-runtime";
import { useMutation } from "react-relay";
import { useCookies } from "react-cookie";
import { Navigate } from "react-router";
import { LoginMutation, LoginMutation$data } from "@generated/LoginMutation.graphql";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png"
const mutation = graphql`
  mutation LoginMutation($username: String!, $password: String!){
    login(loginUserInput: {username: $username, password: $password}){
      user{
        username
      }
      accessToken
    }
  }
`

export const Login = () => {
  const [creds, setCreds] = useState({ username: "", password: "" });
  const [cookies, setCookie] = useCookies(['accessToken']);
  const [commitMutation,] = useMutation<LoginMutation>(mutation);

  if (cookies["accessToken"]) return <Navigate to="/" />

  return (
    <form
      className="flex flex-col items-center max-w-60 mx-auto pt-32"
      onSubmit={(e) => {
        e.preventDefault();
        commitMutation({
          variables: {
            username: creds.username, password: creds.password
          },
          onCompleted: (data: LoginMutation$data) => {
            setCookie('accessToken', data.login.accessToken)
          },
          onError: (e) => {
            console.log(e)
          }
        })
      }}
    >
      <img src={logo} className="h-16 my-2" />
      <Input
        styles="mb-2 text-sm py-[5px]"
        title="Username"
        onChange={(e) => setCreds({ ...creds, username: e.currentTarget.value })}
      />
      <Input
        styles="mb-2 text-sm py-[5px]"
        title="Password"
        onChange={(e) =>
          setCreds({ ...creds, password: e.currentTarget.value })
        }
      />
      <Button title="Log in" type="submit" styles="text-sm py-[5px]" />

      <Link to="/signup"><p className="my-2">Sign up here</p></Link>
    </form>
  );
};
