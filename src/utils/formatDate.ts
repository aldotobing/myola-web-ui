/** @format */

// utils/formatDate.ts

export const formatIndoDate = (
  dateString: string | null | undefined,
): string => {
  if (!dateString) return ""; // atau return nilai default

  const date = new Date(dateString);

  const formatter = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);

  const day = parts.find((p) => p.type === "day")?.value;
  const month = parts.find((p) => p.type === "month")?.value;
  const year = parts.find((p) => p.type === "year")?.value;
  const hour = parts.find((p) => p.type === "hour")?.value;
  const minute = parts.find((p) => p.type === "minute")?.value;

  return `${day} ${month} ${year} - ${hour}.${minute}`;
};
