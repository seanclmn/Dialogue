import {
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/solid";
import { useContext, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import { Avatar } from "@components/shared/users/Avatar";
import { useCreateChat } from "@mutations/CreateChat";
import { getChatDisplayName } from "@utils/chatName";

interface CreateChatProps {
  open: boolean;
  setIsOpen: (open: boolean) => void;
}

export const CreateChat = ({ open, setIsOpen }: CreateChatProps) => {
  const { user } = useContext(UserContext);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [title, setTitle] = useState("");
  const { createChat, isInFlight } = useCreateChat();

  if (!user.username) return null;

  const toggleFriend = (username: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(username)) {
        next.delete(username);
      } else {
        next.add(username);
      }
      return next;
    });
  };

  const handleClose = () => {
    setSelected(new Set());
    setTitle("");
    setIsOpen(false);
  };

  const handleCreate = () => {
    if (!selected.size || isInFlight) return;
    const participants = [user.username!, ...Array.from(selected)];
    const name = title.trim() || null;
    createChat(participants, { name, onCompleted: handleClose });
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
        <DialogPanel className="w-full max-w-md rounded-xl border border-brd-color bg-bgd-color text-txt-color shadow-xl flex flex-col">
          <div className="px-6 pt-6 pb-4 border-b border-brd-color">
            <DialogTitle className="text-lg font-semibold">New message</DialogTitle>
            <p className="text-sm text-gray-400 mt-0.5">Select friends to start a chat with</p>
          </div>

          <div className="px-6 py-3 border-b border-brd-color">
            <label className="block text-xs font-medium text-gray-400 mb-1">
              Chat name <span className="font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
              placeholder={
                selected.size
                  ? getChatDisplayName(null, Array.from(selected), user.username)
                  : "e.g. Weekend plans"
              }
              className="w-full bg-transparent text-sm text-txt-color placeholder-gray-400 border border-brd-color rounded-lg px-3 py-2 outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="overflow-y-auto max-h-72 divide-y divide-brd-color">
            {user.friends.length === 0 ? (
              <p className="px-6 py-8 text-center text-sm text-gray-400">
                You have no friends yet.
              </p>
            ) : (
              user.friends.map((friend) => {
                const isSelected = selected.has(friend.username);
                return (
                  <button
                    key={friend.id}
                    type="button"
                    onClick={() => toggleFriend(friend.username)}
                    className="w-full flex items-center gap-3 px-6 py-3 hover:bg-bgd-highlight transition-colors text-left"
                  >
                    <Avatar src={friend.avatarUrl} containerStyle="h-9 w-9 shrink-0" />
                    <span className="flex-1 text-sm font-medium">{friend.username}</span>
                    <span
                      className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? "bg-primary border-primary"
                          : "border-brd-color"
                      }`}
                    >
                      {isSelected && <CheckIcon className="h-3 w-3 text-white" />}
                    </span>
                  </button>
                );
              })
            )}
          </div>

          <div className="px-6 py-4 border-t border-brd-color flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm rounded-lg border border-brd-color hover:bg-bgd-highlight transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreate}
              disabled={!selected.size || isInFlight}
              className="px-4 py-2 text-sm rounded-lg bg-primary text-white font-medium disabled:opacity-40 hover:opacity-90 transition-opacity"
            >
              {isInFlight ? "Creating…" : "Create"}
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
