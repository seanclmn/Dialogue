import { ReactElement } from "react";

interface AvatarProps extends React.AllHTMLAttributes<HTMLImageElement> {}

export const Avatar = ({ src }: AvatarProps): ReactElement => {
  return <img src={src} className="rounded-full h-6 m-1" />;
};
