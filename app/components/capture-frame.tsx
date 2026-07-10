"use client";

import { forwardRef } from "react";
import type { RefObject } from "react";
import { CodeCard } from "./code-card";
import { TableSnippet } from "./table-snippet";
import type { Mode, TableData } from "../lib/types";

interface CaptureFrameProps {
  mode: Mode;
  background: string;
  padding: number;
  code: string;
  onCodeChange: (v: string) => void;
  language: string;
  theme: string;
  fileName: string;
  onFileNameChange: (v: string) => void;
  showWindowControls: boolean;
  table: TableData;
  codeWidth: number | "auto";
  fontSize: number;
  watermark: boolean;
  codeCardRef: RefObject<HTMLDivElement | null>;
  codeTextareaRef: RefObject<HTMLTextAreaElement | null>;
  tableScrollRef: RefObject<HTMLDivElement | null>;
  onCodeKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onCodeResizeStart: (e: React.MouseEvent) => void;
  onCodeReady?: () => void;
  setTable: (t: TableData) => void;
}

export const CaptureFrame = forwardRef<HTMLDivElement, CaptureFrameProps>(
  function CaptureFrame(props, ref) {
    const {
      mode, background, padding, code, onCodeChange, language, theme,
      fileName, onFileNameChange, showWindowControls, table,
      codeWidth, fontSize, watermark,
      codeCardRef, codeTextareaRef, tableScrollRef,
      onCodeKeyDown, onCodeResizeStart, onCodeReady, setTable,
    } = props;

    return (
      <div
        ref={ref}
        style={{ background, padding: `${padding}px` }}
        className="relative inline-flex transition-[padding] duration-200"
      >
        {mode === "code" ? (
          <CodeCard
            code={code}
            onCodeChange={onCodeChange}
            language={language}
            theme={theme}
            fileName={fileName}
            onFileNameChange={onFileNameChange}
            showWindowControls={showWindowControls}
            width={codeWidth}
            fontSize={fontSize}
            cardRef={codeCardRef}
            textareaRef={codeTextareaRef}
            onKeyDown={onCodeKeyDown}
            onResizeStart={onCodeResizeStart}
            onReady={onCodeReady}
          />
        ) : (
          <TableSnippet table={table} setTable={setTable} scrollRef={tableScrollRef} />
        )}

        {watermark && (
          <span className="absolute bottom-2 right-3 text-[10px] font-mono text-white/30 pointer-events-none select-none">
            Made with Tabli
          </span>
        )}
      </div>
    );
  },
);