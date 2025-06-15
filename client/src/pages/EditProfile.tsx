import { useContext } from "react";
import { UserContext } from "@contexts/UserContext";
import { Avatar } from "@components/shared/users/Avatar";
import img from "../assets/jennie.jpeg";

export const EditProfile = () => {
  const data = useContext(UserContext);

  return (
    <div className="w-full flex flex-col items-center py-2">
      <Avatar src={img} containerStyle="w-28 my-2" />
      <p className="my-2">{data.user.username}</p>
      {data.user.bio ? <p>bio {data.user.bio}</p> : null}
    </div>
  );
};
