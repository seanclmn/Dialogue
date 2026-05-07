import { useContext, useRef, useState } from "react";
import { UserContext } from "@contexts/UserContext";
import { Avatar } from "@components/shared/users/Avatar";
import img from "../assets/jennie.jpeg";
import { Input } from "@components/shared/Inputs/GenericInput";
import { Controller, useForm } from "react-hook-form";
import { InputError } from "@components/error/InputError";
import { Button } from "@components/shared/Buttons/Button";
import { useUpdateUserMutation } from "@mutations/UpdateUser";
import { TextAreaInput } from "@components/shared/Inputs/TextAreaInput";
import { useNavigate } from "react-router";
import { useCookies } from "react-cookie";
import toast from "react-hot-toast";
import { API_ORIGIN } from "../config";

type Inputs = {
  username: string;
  bio: string;
};

type EditProfileProps = {
  id: string;
  username: string;
  bio?: string;
  avatarUrl?: string | null;
};

const EditProfileForm = ({ username, bio, id, avatarUrl }: EditProfileProps) => {
  const {
    control,
    formState: { errors },
    handleSubmit
  } = useForm<Inputs>({ defaultValues: { username, bio } });

  const { updateUser, isMutationInFlight } = useUpdateUserMutation();
  const { user, setUser } = useContext(UserContext);
  const [cookies] = useCookies(["accessToken"]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const onAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const token = cookies["accessToken"];
    if (!token || token === "undefined" || token === "null") {
      toast.error("You must be logged in to upload a photo.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`${API_ORIGIN}/uploads/avatar`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg =
          typeof body?.message === "string"
            ? body.message
            : Array.isArray(body?.message)
              ? body.message.join(", ")
              : "Upload failed";
        throw new Error(msg);
      }
      setUser({
        ...user,
        id: body.id,
        username: body.username,
        bio: body.bio ?? user.bio,
        avatarUrl: body.avatarUrl ?? null,
      });
      toast.success("Profile photo updated");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    }
  };

  const onSubmit = (data: Inputs) => {
    const input = {
      username: data.username,
      bio: data.bio,
    };
    updateUser({ id, ...input });
    navigate(-1)
  }

  return (
    <div className="w-full flex flex-col items-center py-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={onAvatarFile}
      />
      <Avatar src={avatarUrl || img} containerStyle="w-28 h-28 my-2 object-cover" />
      <Button
        type="button"
        styles="text-sm my-1"
        onClick={() => fileInputRef.current?.click()}
      >
        Change photo
      </Button>
      <form
        className="my-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Controller
          control={control}
          render={({ field }) => (
            <Input styles="my-1 text-sm" title="Username" {...field} />
          )}
          name="username"
          rules={{ required: true }}
          defaultValue={username}
        />
        {errors.username?.type === "required" && (
          <InputError message={"Username is required"} />
        )}
        <Controller
          control={control}
          render={({ field }) => (
            <TextAreaInput title="Bio" styles="my-1 text-sm h-48" {...field} />
          )}
          name="bio"
          rules={{ required: true }}
        />
        <Button
          type="submit"
          styles="text-sm my-2"
          loading={isMutationInFlight}
          disabled={isMutationInFlight}
        >
          Update
        </Button>
      </form>
    </div>
  );
};

export const EditProfile = () => {
  const data = useContext(UserContext);

  if (!data.user.username || !data.user.id) {
    return <div className="text-center bg-bgd-color text-txt-color min-h-full w-full">Loading...</div>;
  }

  return (
    <div className="w-full flex flex-col items-center py-2 bg-bgd-color text-txt-color min-h-full">
      <h1 className="text-2xl font-bold">Edit Profile</h1>
      <EditProfileForm
        username={data.user.username}
        bio={data.user.bio ?? ""}
        id={data.user.id}
        avatarUrl={data.user.avatarUrl}
      />
    </div>
  );
}
