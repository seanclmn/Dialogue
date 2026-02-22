import { UserSearch } from "@components/users/UserSearch";

export const SearchUsers = () => {
  return (
    <div className="w-full flex flex-col items-left bg-bgd-color text-txt-color min-h-full">
      <UserSearch />
    </div>
  );
};
