"use client";

import { useEffect } from "react";
import { isEditableTarget } from "../lib/dom";
import type { Mode } from "../lib/types";

interface UseKeyboardShortcutsParams {
  mode: Mode;
  onFocusEditor: () => void;
  onCycleTheme: () => void;
  onToggleBackground: () => void;
  onToggleLineNumbers: () => void;
  onCyclePadding: () => void;
  onCycleLanguage: () => void;
  onFormatCode: () => void;
  onToggleWindowControls: () => void;
}

// atalhos ao estilo ray.so: letras soltas (sem modificador) só disparam
// fora de um campo de edição, senão digitar normalmente no editor quebraria
// (ex: "n" enquanto se escreve código não pode alternar linhas)
export function useKeyboardShortcuts({
  mode,
  onFocusEditor,
  onCycleTheme,
  onToggleBackground,
  onToggleLineNumbers,
  onCyclePadding,
  onCycleLanguage,
  onFormatCode,
  onToggleWindowControls,
}: UseKeyboardShortcutsParams) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = document.activeElement;
      const editing = isEditableTarget(target);

      // precisa funcionar com o editor focado, senão não daria pra sair dele
      if (e.key === "Escape" && editing) {
        (target as HTMLElement).blur();
        return;
      }

      // usa modificador, então também precisa funcionar com o editor focado
      if (e.altKey && e.shiftKey && e.key.toLowerCase() === "f") {
        if (mode !== "code") return;
        e.preventDefault();
        onFormatCode();
        return;
      }

      if (editing || e.metaKey || e.ctrlKey || e.altKey) return;

      switch (e.key.toLowerCase()) {
        case "f":
          if (mode !== "code") return;
          e.preventDefault();
          onFocusEditor();
          break;
        case "c":
          onCycleTheme();
          break;
        case "b":
          onToggleBackground();
          break;
        case "n":
          if (mode === "code") onToggleLineNumbers();
          break;
        case "p":
          onCyclePadding();
          break;
        case "l":
          if (mode === "code") onCycleLanguage();
          break;
        case "w":
          if (mode === "code") onToggleWindowControls();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    mode,
    onFocusEditor,
    onCycleTheme,
    onToggleBackground,
    onToggleLineNumbers,
    onCyclePadding,
    onCycleLanguage,
    onFormatCode,
    onToggleWindowControls,
  ]);
}
