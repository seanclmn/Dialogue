
interface InputError {
  message: string;
}

export const InputError = ({ message }: InputError) => {
  return (
    <p className="text-red-500 text-sm text-left w-full">*{message}</p>
  )
}