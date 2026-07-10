"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import { CARD_HARD_MAX_WIDTH, CARD_MIN_WIDTH } from "../lib/constants";

// o card fica centralizado no layout (justify-center), então arrastar
// QUALQUER borda cresce/encolhe o card "dos dois lados" ao mesmo tempo —
// por isso o delta*2 (independente de qual borda foi arrastada) e o sinal
// invertido pra borda esquerda (arrastar pra esquerda deve crescer o card)
export function useCardResize(cardRef: RefObject<HTMLElement | null>) {
  const [customWidth, setCustomWidth] = useState<number | "auto">("auto");
  const [isResizing, setIsResizing] = useState(false);

  const startXRef = useRef(0);
  const startWidthRef = useRef(0);
  const directionRef = useRef<1 | -1>(1);

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = (e.clientX - startXRef.current) * directionRef.current;
      const newWidth = Math.max(CARD_MIN_WIDTH, Math.min(CARD_HARD_MAX_WIDTH, startWidthRef.current + delta * 2));
      setCustomWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = "default";
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    document.body.style.cursor = "col-resize";

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  const handleResizeStart = useCallback(
    (direction: 1 | -1) => (e: React.MouseEvent) => {
      e.preventDefault();
      directionRef.current = direction;
      setIsResizing(true);
      startXRef.current = e.clientX;
      startWidthRef.current = cardRef.current?.offsetWidth || CARD_MIN_WIDTH;
      setCustomWidth(startWidthRef.current);
    },
    [cardRef],
  );

  const resetWidth = useCallback(() => setCustomWidth("auto"), []);

  return { customWidth, isResizing, handleResizeStart, resetWidth };
}
