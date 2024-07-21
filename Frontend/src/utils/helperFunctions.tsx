export const avtarNameHandler = (username?: string) => {
  if (!username) return "";
  const parts = username.toUpperCase().split(" ");
  if (parts.length === 1) {
    return `${parts[0][0]}${parts[0][1] ? parts[0][1] : ""}`;
  } else if (parts.length > 1) {
    return `${parts[0][0]}${parts[1][0]}`;
  }
};

export const formatDate = (dateString:string) => {
  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${day}-${month}-${year}, ${hours}:${minutes}:${seconds}`;
};