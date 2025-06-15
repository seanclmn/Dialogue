import { ReactElement } from "react";

interface AvatarProps extends React.AllHTMLAttributes<HTMLImageElement> {
  containerStyle?: string;
  editable?: boolean;
}

export const Avatar = ({ src, containerStyle, editable }: AvatarProps): ReactElement => {
  return (
    <>
      {editable ? (
        <div className={"relative border-none" + containerStyle}>
          <img src={src} className={containerStyle + " rounded-full"} />
          <div className={"rounded-full flex items-center justify-center absolute top-0 bg-black/50 cursor-pointer " + containerStyle}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-6" fill="white">
              <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
            </svg>
          </div>
        </div>
      ) :
        <img src={src} className={containerStyle + " rounded-full"} />}
    </>
  )
};