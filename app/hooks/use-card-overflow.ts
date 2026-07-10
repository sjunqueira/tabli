"use client";

import { useEffect, useRef, useState } from "react";
import { MAX_CARD_HEIGHT } from "../lib/constants";

export function useCardOverflow<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [isOverflowingWidth, setIsOverflowingWidth] = useState(false);
  const [isOverflowingHeight, setIsOverflowingHeight] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const check = () => {
      setIsOverflowingWidth(el.scrollWidth > el.clientWidth + 5);
      setIsOverflowingHeight(el.scrollHeight > MAX_CARD_HEIGHT);
    };

    check();
    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, isOverflowingWidth, isOverflowingHeight };
}