
export const getDMAvatar = (
  participants: readonly { id: string; avatarUrl?: string | null | undefined }[],
  currentUserId: string | null | undefined,
): string | null => {
  const others = participants.filter((p) => p.id !== currentUserId);
  if (others.length !== 1) return null;
  return others[0].avatarUrl ?? null;
};

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
