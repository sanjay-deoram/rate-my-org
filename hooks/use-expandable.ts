"use client";

import { useRef, useEffect, useState } from "react";

const COLLAPSED_HEIGHT = 208;

export function useExpandable() {
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const [scrollHeight, setScrollHeight] = useState(0);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    setScrollHeight(el.scrollHeight);
    setOverflows(el.scrollHeight > COLLAPSED_HEIGHT);
  }, []);

  return { expanded, setExpanded, overflows, scrollHeight, bodyRef, COLLAPSED_HEIGHT };
}
