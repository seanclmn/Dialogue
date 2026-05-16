import { ExclamationCircleIcon } from "@heroicons/react/16/solid";

interface InputError {
  message: string;
}

export const InputError = ({ message }: InputError) => {
  return (
    <p className="flex items-center gap-1 text-error text-xs w-full mt-0.5">
      <ExclamationCircleIcon className="w-3.5 h-3.5 shrink-0" />
      {message}
    </p>
  );
};
