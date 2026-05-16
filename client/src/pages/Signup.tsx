import { Button } from "../components/shared/Buttons/Button";
import { Input } from "../components/shared/Inputs/GenericInput";
import { graphql } from "relay-runtime";
import { useMutation } from "react-relay";
import { useCookies } from "react-cookie";
import { Link, Navigate } from "react-router";
import toast from "react-hot-toast";
import { Controller, useForm } from "react-hook-form";
import { InputError } from "@components/error/InputError";
import {
  SignupMutation,
  SignupMutation$data,
} from "@generated/SignupMutation.graphql";

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

type Inputs = {
  username: string;
  password: string;
  confirmPassword: string;
};

export const Signup = () => {
  const [cookies, setCookie] = useCookies(["accessToken"]);
  const [commitMutation, isMutationInFlight] =
    useMutation<SignupMutation>(mutation);

  const {
    handleSubmit,
    control,
    setError,
    watch,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: { username: "", password: "", confirmPassword: "" },
  });

  if (cookies["accessToken"]) return <Navigate to="/" />;

  const onSubmit = (data: Inputs) => {
    commitMutation({
      variables: {
        username: data.username,
        password: data.password,
      },
      onCompleted: (res: SignupMutation$data) => {
        setCookie("accessToken", res.signup.accessToken, { path: "/" });
        toast.success("Account created successfully!");
      },
      onError: (e: any) => {
        const message =
          e.source?.errors?.[0]?.message || e.message || "Sign up failed";
        if (message === "User already exists") {
          setError("username", {
            type: "server",
            message: "Username is already taken",
          });
        } else {
          setError("root", { type: "server", message });
        }
      },
    });
  };

  return (
    <div className="w-full flex flex-col items-center pt-32 min-h-screen bg-bgd-color text-txt-color">
      <form
        className="flex flex-col items-center w-60"
        onSubmit={(e) => { e.preventDefault(); handleSubmit(onSubmit)(e); }}
      >
        <p className="text-5xl my-4 cedarville-cursive-regular">Dialogue</p>
        <Controller
          control={control}
          render={({ field }) => (
            <Input styles="my-1 text-sm" title="Username" {...field} />
          )}
          name="username"
          rules={{
            required: "Username is required",
            minLength: {
              value: 3,
              message: "Username must be at least 3 characters",
            },
            maxLength: {
              value: 20,
              message: "Username must be at most 20 characters",
            },
            pattern: {
              value: /^[a-zA-Z0-9_]+$/,
              message: "Only letters, numbers, and underscores allowed",
            },
          }}
        />
        {errors.username && (
          <InputError message={errors.username.message!} />
        )}
        <Controller
          control={control}
          render={({ field }) => (
            <Input
              styles="my-1 text-sm"
              title="Password"
              type="password"
              {...field}
            />
          )}
          name="password"
          rules={{
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          }}
        />
        {errors.password && (
          <InputError message={errors.password.message!} />
        )}
        <Controller
          control={control}
          render={({ field }) => (
            <Input
              styles="my-1 text-sm"
              title="Confirm password"
              type="password"
              {...field}
            />
          )}
          name="confirmPassword"
          rules={{
            required: "Please confirm your password",
            validate: (value) =>
              value === watch("password") || "Passwords do not match",
          }}
        />
        {errors.confirmPassword && (
          <InputError message={errors.confirmPassword.message!} />
        )}
        {errors.root && <InputError message={errors.root.message!} />}
        <Button
          type="submit"
          styles="w-full text-sm my-2"
          loading={isMutationInFlight}
          disabled={isMutationInFlight}
        >
          Sign up
        </Button>
        <Link to="/login">
          <p className="my-2 text-sm">Log in here</p>
        </Link>
      </form>
    </div>
  );
};
