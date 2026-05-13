import { jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { u as useIntersectionObserver } from "./use-intersection-observer-0IkYX39w.js";
const MetricCounter = ({
  value,
  duration = 2e3,
  prefix = "",
  suffix = "",
  className = ""
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const entry = useIntersectionObserver(ref, { threshold: 0.5 });
  const isVisible = !!entry?.isIntersecting;
  const hasAnimated = useRef(false);
  useEffect(() => {
    if (!isVisible || hasAnimated.current) return;
    hasAnimated.current = true;
    let startTime = null;
    const startValue = 0;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * (value - startValue) + startValue);
      setCount(currentCount);
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };
    requestAnimationFrame(animate);
  }, [isVisible, value, duration]);
  return /* @__PURE__ */ jsxs("span", { ref, className, children: [
    prefix,
    count.toLocaleString(),
    suffix
  ] });
};
export {
  MetricCounter as M
};
