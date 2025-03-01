interface InputError {
  message: string;
}

export const InputError = ({ message }: InputError) => {
  return <p className="text-error text-sm text-left w-full">*{message}</p>;
};
