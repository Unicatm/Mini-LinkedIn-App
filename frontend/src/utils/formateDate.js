export const formatDate = (timestamp) => {
  if (!timestamp) return "";
  const date = timestamp._seconds
    ? new Date(timestamp._seconds * 1000)
    : new Date(timestamp);
  return date.toLocaleDateString("ro-RO", {
    month: "short",
    day: "numeric",
  });
};
