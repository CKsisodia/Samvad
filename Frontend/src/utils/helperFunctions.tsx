export const avtarNameHandler = (username?: string) => {
  if (!username) return "";
  const parts = username.toUpperCase().split(" ");
  if (parts.length === 1) {
    return `${parts[0][0]}${parts[0][1] ? parts[0][1] : ""}`;
  } else if (parts.length > 1) {
    return `${parts[0][0]}${parts[1][0]}`;
  }
};
