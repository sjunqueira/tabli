"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CARD_HARD_MAX_WIDTH, CARD_SOFT_MAX_WIDTH, MAX_CODE_CARD_HEIGHT } from "../lib/constants";
import {
  PRETTIER_LANGUAGES,
  formatPrettierError,
  formatWithPrettier,
  normalizeIndentation,
} from "../lib/format-code";
import { detectLanguage } from "../lib/detect-language";
import { useCardResize } from "./use-card-resize";
import type { TranslationStrings } from "../lib/i18n";

export interface FormatFeedback {
  type: "error" | "warning";
  message: string;
}

export function useCodeEditorState(
  code: string,
  onCodeChange: (v: string) => void,
  language: string,
  t: TranslationStrings["codeToolbar"],
  onLanguageChange?: (lang: string) => void,
) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const { customWidth, isResizing, handleResizeStart, resetWidth } = useCardResize(cardRef);
  const [isOverflowingWidth, setIsOverflowingWidth] = useState(false);
  const [isOverflowingWidthHard, setIsOverflowingWidthHard] = useState(false);
  const [isOverflowingHeight, setIsOverflowingHeight] = useState(false);
  const [formatFeedback, setFormatFeedback] = useState<FormatFeedback | null>(null);
  const formatFeedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // true depois que o usuário escolhe a linguagem manualmente — enquanto
  // "pinada", a detecção automática (colar ou o timer periódico) não pode
  // sobrescrever a escolha. Um novo "colar" reabre a detecção, já que
  // sinaliza conteúdo novo que o usuário provavelmente quer identificar.
  const manualOverrideRef = useRef(false);

  const pinLanguage = useCallback(() => {
    manualOverrideRef.current = true;
  }, []);

  const showFormatFeedback = useCallback((feedback: FormatFeedback, durationMs: number) => {
    if (formatFeedbackTimeoutRef.current) clearTimeout(formatFeedbackTimeoutRef.current);
    setFormatFeedback(feedback);
    formatFeedbackTimeoutRef.current = setTimeout(() => setFormatFeedback(null), durationMs);
  }, []);

  useEffect(() => {
    return () => {
      if (formatFeedbackTimeoutRef.current) clearTimeout(formatFeedbackTimeoutRef.current);
    };
  }, []);

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

  // detecta a linguagem a partir do texto colado (não do conteúdo inteiro,
  // que pode já ter outro código) — um paste sempre reabre a detecção
  // automática, mesmo que a linguagem estivesse pinada por escolha manual
  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
      if (!onLanguageChange) return;
      const pasted = e.clipboardData?.getData("text");
      if (!pasted) return;

      manualOverrideRef.current = false;
      detectLanguage(pasted).then((detected) => {
        if (manualOverrideRef.current) return;
        if (detected && detected !== language) onLanguageChange(detected);
      });
    },
    [language, onLanguageChange],
  );

  // detecção periódica enquanto o usuário digita: reavalia o código inteiro
  // ~1.5s depois da última tecla. Some enquanto a linguagem está pinada por
  // escolha manual, pra não brigar com o usuário.
  useEffect(() => {
    if (!onLanguageChange || manualOverrideRef.current) return;

    const timeout = setTimeout(() => {
      detectLanguage(code).then((detected) => {
        if (manualOverrideRef.current) return;
        if (detected && detected !== language) onLanguageChange(detected);
      });
    }, 1500);

    return () => clearTimeout(timeout);
  }, [code, language, onLanguageChange]);

  const formatCode = useCallback(async () => {
    if (!PRETTIER_LANGUAGES.has(language)) {
      onCodeChange(normalizeIndentation(code));
      showFormatFeedback({ type: "warning", message: t.unsupportedLanguageWarning }, 4000);
      return;
    }

    try {
      const formatted = await formatWithPrettier(code, language);
      onCodeChange(formatted);
      if (formatFeedbackTimeoutRef.current) clearTimeout(formatFeedbackTimeoutRef.current);
      setFormatFeedback(null);
    } catch (err) {
      console.error(err);
      showFormatFeedback({ type: "error", message: t.formatError(formatPrettierError(err)) }, 6000);
    }
  }, [code, language, onCodeChange, showFormatFeedback, t]);

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
  //
  // scrollWidth reflete a largura natural do conteúdo mesmo quando ele ainda
  // cabe (o card cresce até o limite pra acomodá-lo), então comparamos contra
  // limiares fixos (soft/hard) em vez de contra o clientWidth do próprio
  // elemento — que fica preso no limite e só acusaria overflow bem tarde
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    const checkOverflow = () => {
      setIsOverflowingWidth(el.scrollWidth >= CARD_SOFT_MAX_WIDTH);
      setIsOverflowingWidthHard(el.scrollWidth >= CARD_HARD_MAX_WIDTH);
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

  return {
    textareaRef,
    cardRef,
    customWidth,
    isResizing,
    isOverflowingWidth,
    isOverflowingWidthHard,
    isOverflowingHeight,
    formatFeedback,
    handleKeyDown,
    handlePaste,
    pinLanguage,
    formatCode,
    handleResizeStart,
    resetWidth,
  };
}