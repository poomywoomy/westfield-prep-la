import { jsx } from "react/jsx-runtime";
import { B as Badge } from "./badge-BbLwm7hH.js";
import { m as cn } from "../main.mjs";
const getStatusConfig = (status) => {
  const normalizedStatus = status.toLowerCase().replace(/[_-]/g, "");
  if (["shipped", "completed", "active", "paid", "fulfilled", "closed"].includes(normalizedStatus)) {
    return { className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" };
  }
  if (["inprogress", "pending", "processing", "receiving", "partial"].includes(normalizedStatus)) {
    return { className: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" };
  }
  if (["open", "draft", "new", "submitted"].includes(normalizedStatus)) {
    return { className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" };
  }
  if (["cancelled", "failed", "issue", "error", "rejected"].includes(normalizedStatus)) {
    return { className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" };
  }
  return { className: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400" };
};
const formatStatus = (status) => {
  return status.replace(/[_-]/g, " ").split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
};
const StatusBadge = ({ status, className }) => {
  const config = getStatusConfig(status);
  return /* @__PURE__ */ jsx(Badge, { className: cn(config.className, "font-medium", className), children: formatStatus(status) });
};
export {
  StatusBadge as S
};
