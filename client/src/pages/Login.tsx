import { useState } from "react";
import { Button } from "../components/shared/buttons/GenericButton";
import { Input } from "../components/shared/Inputs/GenericInput";

export const Login = () => {
  const [creds, setCreds] = useState({ email: "", password: "" });
  return (
    <form
      className="flex flex-col items-center max-w-60 my-auto mx-auto"
      onSubmit={(e) => {
        e.preventDefault();
        console.log(creds);
      }}
    >
      <Input
        styles="mb-2 text-sm py-[5px]"
        title="Email"
        onChange={(e) => setCreds({ ...creds, email: e.currentTarget.value })}
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
