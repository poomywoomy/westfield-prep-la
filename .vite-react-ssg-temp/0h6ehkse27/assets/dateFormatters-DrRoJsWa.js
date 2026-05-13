import { parseISO, format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
const PACIFIC_TZ = "America/Los_Angeles";
function formatDatePT(date) {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return formatInTimeZone(dateObj, PACIFIC_TZ, "MMM dd, yyyy");
}
function formatDateTimePT(date) {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return formatInTimeZone(dateObj, PACIFIC_TZ, "MMM dd, yyyy h:mm a");
}
function formatDateRange(startDate, endDate) {
  if (!startDate || !endDate) return null;
  const [startYear, startMonth, startDay] = startDate.split("-").map(Number);
  const [endYear, endMonth, endDay] = endDate.split("-").map(Number);
  const start = new Date(startYear, startMonth - 1, startDay);
  const end = new Date(endYear, endMonth - 1, endDay);
  return `${format(start, "MMM dd, yyyy")} - ${format(end, "MMM dd, yyyy")}`;
}
export {
  formatDateRange as a,
  formatDatePT as b,
  formatDateTimePT as f
};
