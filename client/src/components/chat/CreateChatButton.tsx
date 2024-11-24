import { PlusCircleIcon } from "@heroicons/react/24/outline"

interface CreateChatButtonProps {
  onClick: () => void
}

export const CreateChatButton = ({ onClick }: CreateChatButtonProps) => {
  return (
    <button onClick={onClick} className="w-full my-4">
      <PlusCircleIcon className="text-bgd-highlight text-center h-6 w-6 ml-auto mr-auto hover:text-txt-color" />
    </button>
  )
}