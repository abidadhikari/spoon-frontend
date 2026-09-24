import { format, isValid, parseISO } from "date-fns";

export type DateInput = Date | string | number | null | undefined;

function toDate(value: DateInput) {
  if (value instanceof Date) return value;
  if (typeof value === "string") return parseISO(value);
  if (typeof value === "number") return new Date(value);
  return null;
}

export function isValidDate(value: DateInput) {
  const date = toDate(value);
  return date !== null && isValid(date);
}

export function formatDate(
  value: DateInput,
  pattern = "d MMM yyyy",
  fallback = "-",
) {
  const date = toDate(value);
  return date && isValid(date) ? format(date, pattern) : fallback;
}

export function formatDateTime(
  value: DateInput,
  pattern = "d MMM yyyy, h:mm a",
  fallback = "-",
) {
  return formatDate(value, pattern, fallback);
}

export function getCurrentYear() {
  return format(new Date(), "yyyy");
}
