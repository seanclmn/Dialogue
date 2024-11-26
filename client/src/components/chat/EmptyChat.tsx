import { Button } from "@components/shared/Buttons/GenericButton"

export const EmptyChat = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <p>Send a message to start a dialogue.</p>
      <Button title={"Send Message"} />
    </div>
  )
}