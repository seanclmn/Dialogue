import { useState } from "react";
import { Button } from "../components/shared/Buttons/GenericButton";
import { Input } from "../components/shared/Inputs/GenericInput";
import { graphql } from "relay-runtime";
import { useMutation } from "react-relay";
import { useCookies } from "react-cookie";
import { Navigate } from "react-router";
import { LoginMutation, LoginMutation$data } from "@generated/LoginMutation.graphql";


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
  const [cookies, setCookie,] = useCookies(['accessToken']);
  const [commitMutation,] = useMutation<LoginMutation>(mutation);

  return (
    <form
      className="flex flex-col items-center max-w-60 my-auto mx-auto"
      onSubmit={(e) => {
        console.log('submit')
        e.preventDefault();
        commitMutation({
          variables: {
            username: creds.username, password: creds.password
          },
          onCompleted: (data: LoginMutation$data) => {
            setCookie('accessToken', data.login.accessToken)
            console.log('completed')
          },
          onError: (e) => {
            console.log(e)
          }
        })
      }}
    >
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
    </form>
  );
};
