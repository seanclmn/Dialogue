import { useContext } from "react";
import { UserContext } from "@contexts/UserContext";
import { Avatar } from "@components/shared/users/Avatar";
import img from "../assets/jennie.jpeg";
import { Input } from "@components/shared/Inputs/GenericInput";
import { Controller, useForm } from "react-hook-form";
import { InputError } from "@components/error/InputError";
import { Button } from "@components/shared/Buttons/GenericButton";

type Inputs = {
  username: string;
  bio: string;
};

export const EditProfile = () => {
  const data = useContext(UserContext);
  const {
    control,
    formState: { errors },
  } = useForm<Inputs>({ defaultValues: { username: data.user.username ?? "", bio: data.user.bio ?? "" } });

  return (
    <div className="w-full flex flex-col items-center py-2">
      <Avatar src={img} containerStyle="w-28 h-28 my-2 " editable />
      <form
        className="flex flex-col items-center mx-auto mt-4"
      // onSubmit={handleSubmit(onSubmit)}
      >
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
            <Input styles="my-1 text-sm" title="Bio" {...field} />
          )}
          name="bio"
          rules={{ required: true }}
        />
        <Button
          title="Edit"
          type="submit"
          styles="text-sm my-2"
        // loading={isMutationInFlight}
        // disabled={isMutationInFlight}
        />

      </form>
    </div>
  );
};
