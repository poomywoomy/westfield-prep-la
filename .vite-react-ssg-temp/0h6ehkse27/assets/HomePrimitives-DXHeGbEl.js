import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { T as TranslatedText } from "../main.mjs";
const SectionHeading = ({
  eyebrow,
  title,
  accent,
  subtitle,
  align = "center"
}) => /* @__PURE__ */ jsxs("div", { className: `max-w-3xl ${align === "center" ? "mx-auto text-center" : ""} mb-14`, children: [
  eyebrow && /* @__PURE__ */ jsx("span", { className: "inline-block px-3 py-1 rounded-full text-[11px] font-bold tracking-[0.18em] uppercase bg-secondary/10 text-secondary mb-4", children: /* @__PURE__ */ jsx(TranslatedText, { children: eyebrow }) }),
  /* @__PURE__ */ jsxs("h2", { className: "text-3xl md:text-5xl font-bold text-primary leading-[1.1] tracking-tight", children: [
    title,
    accent && /* @__PURE__ */ jsxs(Fragment, { children: [
      " ",
      /* @__PURE__ */ jsxs("span", { className: "relative inline-block", children: [
        /* @__PURE__ */ jsx("span", { className: "text-secondary", children: accent }),
        /* @__PURE__ */ jsx("span", { className: "absolute left-0 -bottom-1 h-[3px] w-full bg-secondary rounded-full" })
      ] })
    ] })
  ] }),
  subtitle && /* @__PURE__ */ jsx("p", { className: "mt-5 text-base md:text-lg text-muted-foreground leading-relaxed", children: subtitle })
] });
const IconBadge = ({
  children,
  size = "md"
}) => {
  const sizes = {
    sm: "w-10 h-10 rounded-lg",
    md: "w-12 h-12 rounded-xl",
    lg: "w-14 h-14 rounded-xl"
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `${sizes[size]} bg-secondary/10 text-secondary flex items-center justify-center ring-1 ring-secondary/20`,
      children
    }
  );
};
const GridBackdrop = ({
  className = "",
  color = "currentColor",
  opacity = 0.08
}) => /* @__PURE__ */ jsxs(
  "svg",
  {
    className: `absolute inset-0 w-full h-full pointer-events-none ${className}`,
    "aria-hidden": "true",
    style: { opacity },
    children: [
      /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsx("pattern", { id: "hp-dots", x: "0", y: "0", width: "32", height: "32", patternUnits: "userSpaceOnUse", children: /* @__PURE__ */ jsx("circle", { cx: "1.5", cy: "1.5", r: "1.2", fill: color }) }) }),
      /* @__PURE__ */ jsx("rect", { width: "100%", height: "100%", fill: "url(#hp-dots)" })
    ]
  }
);
export {
  GridBackdrop as G,
  IconBadge as I,
  SectionHeading as S
};
