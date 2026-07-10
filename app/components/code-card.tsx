"use client";

import { useEffect, useState } from "react";
import type { RefObject } from "react";
import { codeToHtml } from "shiki";
import { MAX_CODE_CARD_HEIGHT } from "../lib/constants";

interface CodeCardProps {
  code: string;
  onCodeChange: (v: string) => void;
  language: string;
  theme: string;
  fileName: string;
  onFileNameChange: (v: string) => void;
  showWindowControls: boolean;
  width: number | "auto";
  fontSize: number;
  cardRef: RefObject<HTMLDivElement | null>;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onResizeStart: (e: React.MouseEvent) => void;
  onReady?: () => void;
}

export function CodeCard({
  code,
  onCodeChange,
  language,
  theme,
  fileName,
  onFileNameChange,
  showWindowControls,
  width,
  fontSize,
  cardRef,
  textareaRef,
  onKeyDown,
  onResizeStart,
  onReady,
}: CodeCardProps) {
  const [html, setHtml] = useState("");

  useEffect(() => {
    let cancelled = false;
    codeToHtml(code || " ", { lang: language, theme })
      .then((out) => {
        if (cancelled) return;
        setHtml(out);
        onReady?.();
      })
      .catch(() => {
        codeToHtml(code || " ", { lang: "plaintext", theme }).then((out) => {
          if (cancelled) return;
          setHtml(out);
          onReady?.();
        });
      });
    return () => {
      cancelled = true;
    };
  }, [code, language, theme, onReady]);

  const sharedEditorStyles = "p-6 leading-[1.5] font-mono whitespace-pre break-normal";

  return (
    <div
      ref={cardRef}
      style={{ width: width === "auto" ? "fit-content" : `${width}px` }}
      className="snippet-card relative min-w-[420px] max-w-[900px] bg-[#0a0a0a] rounded-xl border border-[#222] shadow-2xl overflow-hidden flex flex-col"
    >
      {showWindowControls && (
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-black/20 flex-shrink-0">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>
          <input
            value={fileName}
            onChange={(e) => onFileNameChange(e.target.value)}
            placeholder="Untitled-1"
            className="flex-1 bg-transparent text-center text-xs text-[#8b8b8b] font-mono truncate pr-14 outline-none"
          />
        </div>
      )}

      <div
        className="relative w-full overflow-y-auto"
        style={{ tabSize: 4, maxHeight: `${MAX_CODE_CARD_HEIGHT}px`, fontSize: `${fontSize}px` }}
      >
        <div
          className={`pointer-events-none [&>pre]:!bg-transparent [&>pre]:!p-0 [&>pre]:!m-0 ${sharedEditorStyles}`}
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          onKeyDown={onKeyDown}
          spellCheck={false}
          data-ignore-in-export
          className={`absolute inset-0 w-full h-full resize-none outline-none bg-transparent text-transparent caret-white selection:bg-blue-500/30 overflow-hidden ${sharedEditorStyles}`}
        />
      </div>

      <div
        onMouseDown={onResizeStart}
        data-ignore-in-export
        className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize z-30"
      />
    </div>
  );
}