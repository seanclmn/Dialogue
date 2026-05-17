import { ReactElement } from "react";
import { Link } from "react-router";
import { UserIcon } from "@heroicons/react/24/solid";

interface AvatarProps extends Omit<React.AllHTMLAttributes<HTMLImageElement>, "src"> {
  src?: string | null;
  containerStyle?: string;
  editable?: boolean;
  link?: string;
}

export const Avatar = ({
  src,
  containerStyle = "",
  editable,
  link,
  ...imgRest
}: AvatarProps): ReactElement => {
  const photoUrl = (src ?? "").trim();
  const showImage = photoUrl.length > 0;

  const body = showImage ? (
    <img
      {...imgRest}
      src={photoUrl}
      alt=""
      className={`${containerStyle} rounded-full object-cover`.trim()}
    />
  ) : (
    <div
      className={`${containerStyle} rounded-full flex aspect-square shrink-0 items-center justify-center overflow-hidden bg-secondary text-txt-color/55`.trim()}
      aria-hidden
    >
      <UserIcon className="h-2/3 fill-current" />
      
    </div>
  );

  if (editable) {
    return (
      <div className="relative inline-block">
        {body}
        <Link to={link ?? ""}>
          <div className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-100">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-6" fill="white">
              <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
            </svg>
          </div>
        </Link>
      </div>
    );
  }

  return <>{body}</>;
};
