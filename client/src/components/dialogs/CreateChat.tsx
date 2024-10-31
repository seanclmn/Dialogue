import { Dialog } from "@headlessui/react"

interface CreateChatProps {
  open: boolean;
  setIsOpen: (open: boolean) => void
}

export const CreateChat = ({ open, setIsOpen }: CreateChatProps) => {
  return (
    <Dialog open={open} onClose={() => setIsOpen(false)}>
      <p>wonton</p>
    </Dialog>
  )
}