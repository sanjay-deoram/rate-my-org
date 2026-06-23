"use client";

import { useRef, useEffect, useState, useCallback } from "react";

const COLLAPSED_HEIGHT = 208;

export function useExpandable() {
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);
  // `number` while animating, "none" once open so content can grow freely
  // (prevents a stale measured height from clipping the panel).
  const [maxHeight, setMaxHeight] = useState<number | "none">(COLLAPSED_HEIGHT);
  const bodyRef = useRef<HTMLDivElement>(null);

  const measure = useCallback(() => {
    const el = bodyRef.current;
    if (el) setOverflows(el.scrollHeight > COLLAPSED_HEIGHT);
  }, []);

  // Recompute overflow on mount and whenever the viewport changes (the
  // pros/cons grid stacks on mobile, changing content height).
  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    if (expanded) {
      // Animate from collapsed to the current full height.
      setMaxHeight(el.scrollHeight);
    } else if (maxHeight === "none") {
      // Pin to the current height before collapsing so the transition has a
      // numeric start value to animate from.
      setMaxHeight(el.scrollHeight);
      requestAnimationFrame(() => setMaxHeight(COLLAPSED_HEIGHT));
    } else {
      setMaxHeight(COLLAPSED_HEIGHT);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded]);

  // Once the open animation finishes, drop the height cap so reflowed content
  // (late fonts, responsive stacking) is never clipped.
  const onTransitionEnd = useCallback(() => {
    if (expanded) setMaxHeight("none");
  }, [expanded]);

  return {
    expanded,
    setExpanded,
    overflows,
    maxHeight,
    bodyRef,
    onTransitionEnd,
    COLLAPSED_HEIGHT,
  };
}
