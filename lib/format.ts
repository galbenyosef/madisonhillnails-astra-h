import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
export const TIMEZONE = "America/New_York";
export const money = (cents: number | null) =>
  cents === null
    ? "Price to be confirmed"
    : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: cents % 100 ? 2 : 0,
      }).format(cents / 100);
export const salonDate = (
  date: string | Date,
  pattern = "EEE, MMM d · h:mm a",
) => formatInTimeZone(date, TIMEZONE, pattern);
export const localToUTC = (date: string) =>
  fromZonedTime(date, TIMEZONE).toISOString();
export const today = () => salonDate(new Date(), "yyyy-MM-dd");
