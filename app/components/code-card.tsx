"use client";

import { useEffect, useState } from "react";
import type { RefObject } from "react";
import { codeToHtml } from "shiki";
import { MAX_CARD_HEIGHT } from "../lib/constants";
import { useTranslations } from "../lib/i18n";

interface CodeCardProps {
  code: string;
  onCodeChange: (v: string) => void;
  language: string;
  theme: string;
  fileName: string;
  onFileNameChange: (v: string) => void;
  showWindowControls: boolean;
  showLineNumbers: boolean;
  width: number | "auto";
  fontSize: number;
  cardRef: RefObject<HTMLDivElement | null>;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onPaste?: (e: React.ClipboardEvent<HTMLTextAreaElement>) => void;
  onResizeStart: (direction: 1 | -1) => (e: React.MouseEvent) => void;
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
  showLineNumbers,
  width,
  fontSize,
  cardRef,
  textareaRef,
  onKeyDown,
  onPaste,
  onResizeStart,
  onReady,
}: CodeCardProps) {
  const { t } = useTranslations();
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

  const GUTTER_WIDTH = 40; // px, cabe até 999 linhas confortavelmente
  const BASE_PADDING = 24; // equivalente ao antigo p-6
  const leftPadding = BASE_PADDING + (showLineNumbers ? GUTTER_WIDTH : 0);

  const editorPadding = {
    paddingTop: BASE_PADDING,
    paddingBottom: BASE_PADDING,
    paddingRight: BASE_PADDING,
    paddingLeft: leftPadding,
  };

  const sharedEditorStyles = "leading-[1.5] font-mono whitespace-pre break-normal";

  const lineCount = code.split("\n").length;

  return (
    <div
      ref={cardRef}
      style={{ width: width === "auto" ? "fit-content" : `${width}px` }}
      className="snippet-card relative min-w-[420px] max-w-[1200px] bg-[#0a0a0a] rounded-xl border border-[#222] shadow-2xl flex flex-col"
    >
      {/* overflow-hidden fica aqui, não no card em si — senão clipa as
          bolinhas de resize, que ficam parcialmente fora da borda do card */}
      <div className="overflow-hidden rounded-xl flex flex-col flex-1 min-w-0">
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
              placeholder={t.codeCard.fileNamePlaceholder}
              className="flex-1 bg-transparent text-center text-xs text-[#8b8b8b] font-mono truncate pr-14 outline-none"
            />
          </div>
        )}

        <div
          className="relative w-full overflow-y-auto"
          style={{ tabSize: 4, maxHeight: `${MAX_CARD_HEIGHT}px`, fontSize: `${fontSize}px` }}
        >
          {showLineNumbers && (
            <div
              data-ignore-in-export
              aria-hidden="true"
              className="absolute left-0 top-0 flex flex-col items-end text-[#4b5563] select-none pointer-events-none"
              style={{
                width: `${GUTTER_WIDTH}px`,
                paddingTop: BASE_PADDING,
                paddingRight: 12,
                lineHeight: 1.5,
              }}
            >
              {Array.from({ length: lineCount }, (_, i) => (
                <span key={i}>{i + 1}</span>
              ))}
            </div>
          )}

          <div
            style={editorPadding}
            className={`pointer-events-none [&>pre]:!bg-transparent [&>pre]:!p-0 [&>pre]:!m-0 ${sharedEditorStyles}`}
            aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: html }}
          />
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => onCodeChange(e.target.value)}
            onKeyDown={onKeyDown}
            onPaste={onPaste}
            spellCheck={false}
            data-ignore-in-export
            style={editorPadding}
            className={`absolute inset-0 w-full h-full resize-none outline-none bg-transparent text-transparent caret-white selection:bg-blue-500/30 overflow-hidden ${sharedEditorStyles}`}
          />
        </div>
      </div>

      <div
        onMouseDown={onResizeStart(-1)}
        data-ignore-in-export
        title={t.codeCard.resizeHandle}
        className="group/handle absolute left-0 top-0 bottom-0 w-3 cursor-col-resize z-30 flex items-center justify-start"
      >
        <span className="w-1.5 h-8 rounded-full bg-[#555] opacity-70 group-hover/handle:opacity-100 group-hover/handle:bg-[#c084fc] transition-colors" />
      </div>
      <div
        onMouseDown={onResizeStart(1)}
        data-ignore-in-export
        title={t.codeCard.resizeHandle}
        className="group/handle absolute right-0 top-0 bottom-0 w-3 cursor-col-resize z-30 flex items-center justify-end"
      >
        <span className="w-1.5 h-8 rounded-full bg-[#555] opacity-70 group-hover/handle:opacity-100 group-hover/handle:bg-[#c084fc] transition-colors" />
      </div>
    </div>
  );
}