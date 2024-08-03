import { Avatar } from "../shared/users/Avatar";
import img from "../../assets/jennie.jpeg";

export const ChatGroup = () => {
  return (
    <div className="mt-10 flex flex-row items-center justify-start border-y-[1px] p-2">
      <Avatar src={img} />
      <p className="">Jennie</p>
    </div>
  );
};
