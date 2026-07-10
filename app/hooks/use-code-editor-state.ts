"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MAX_CODE_CARD_HEIGHT } from "../lib/constants";

export function useCodeEditorState(code: string, onCodeChange: (v: string) => void) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const [customWidth, setCustomWidth] = useState<number | "auto">("auto");
  const [isResizing, setIsResizing] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isOverflowingHeight, setIsOverflowingHeight] = useState(false);

  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key !== "Tab") return;
      e.preventDefault();

      const el = e.currentTarget;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const newCode = code.substring(0, start) + "  " + code.substring(end);
      onCodeChange(newCode);

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    },
    [code, onCodeChange],
  );

  const formatCode = useCallback(() => {
    const lines = code.split("\n");
    const nonEmptyLines = lines.filter((line) => line.trim().length > 0);
    if (nonEmptyLines.length === 0) return;

    const minIndent = Math.min(
      ...nonEmptyLines.map((line) => line.match(/^\s*/)?.[0].length ?? 0),
    );

    const formatted = lines
      .map((line) => (line.trim().length === 0 ? "" : line.slice(minIndent)))
      .join("\n");

    onCodeChange(formatted);
  }, [code, onCodeChange]);

  // auto-grow vertical da textarea (altura acompanha o conteúdo, sem cap —
  // quem limita visualmente é o wrapper com max-h + overflow no CodeCard)
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [code]);

  // detecção de overflow horizontal E vertical via ResizeObserver — reage a
  // qualquer mudança real de layout (digitação, resize manual, ou o card
  // assentando de tamanho depois que o Shiki termina de colorir o código),
  // em vez de depender só de quando `code` muda (causava falso positivo no load)
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    const checkOverflow = () => {
      setIsOverflowing(el.scrollWidth > el.clientWidth + 5);
      // el.scrollHeight aqui é a altura NATURAL da textarea (ela cresce livre,
      // quem corta visualmente é o pai com max-h), então compara contra a
      // mesma constante usada no max-h do CodeCard
      setIsOverflowingHeight(el.scrollHeight > MAX_CODE_CARD_HEIGHT);
    };

    checkOverflow();

    const observer = new ResizeObserver(checkOverflow);
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  // drag-to-resize
  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = e.clientX - startXRef.current;
      const newWidth = Math.max(420, Math.min(900, startWidthRef.current + delta * 2));
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

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    startXRef.current = e.clientX;
    startWidthRef.current = cardRef.current?.offsetWidth || 420;
  }, []);

  const resetWidth = useCallback(() => setCustomWidth("auto"), []);

  return {
    textareaRef,
    cardRef,
    customWidth,
    isOverflowing,
    isOverflowingHeight,
    handleKeyDown,
    formatCode,
    handleResizeStart,
    resetWidth,
  };
}