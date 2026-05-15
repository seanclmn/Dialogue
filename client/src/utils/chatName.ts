/**
 * Returns a display name for a chat. If the chat has an explicit name, use it.
 * Otherwise build one from the other participants' usernames (alphabetical order,
 * Oxford-comma list), excluding the current user.
 */
export const getChatDisplayName = (
  name: string | null | undefined,
  participantUsernames: string[],
  currentUsername: string | null | undefined
): string => {
  if (name) return name;

  const others = participantUsernames
    .filter((u) => u !== currentUsername)
    .sort((a, b) => a.localeCompare(b));

  if (others.length === 1) return others[0];
  if (others.length === 2) return `${others[0]} and ${others[1]}`;
  return `${others.slice(0, -1).join(", ")}, and ${others[others.length - 1]}`;
};
