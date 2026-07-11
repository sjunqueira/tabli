"use client";

import { forwardRef } from "react";
import type { RefObject } from "react";
import { CodeCard } from "./code-card";
import { TableSnippet } from "./table-snippet";
import { useTranslations } from "../lib/i18n";
import type { Mode, TableData } from "../lib/types";

interface CaptureFrameProps {
  mode: Mode;
  background: string;
  cardBackground: string;
  tableHeaderBg: string;
  tableHeaderText: string;
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
  tableCardRef: RefObject<HTMLDivElement | null>;
  tableWidth: number | "auto";
  onCodeKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onCodePaste?: (e: React.ClipboardEvent<HTMLTextAreaElement>) => void;
  onCodeResizeStart: (direction: 1 | -1) => (e: React.MouseEvent) => void;
  onTableResizeStart: (direction: 1 | -1) => (e: React.MouseEvent) => void;
  onCodeReady?: () => void;
  setTable: (t: TableData) => void;
  showLineNumbers: boolean;
}

export const CaptureFrame = forwardRef<HTMLDivElement, CaptureFrameProps>(
  function CaptureFrame(props, ref) {
    const {
      mode, background, cardBackground, tableHeaderBg, tableHeaderText, padding, code, onCodeChange, language, theme,
      fileName, onFileNameChange, showWindowControls, table,
      codeWidth, fontSize, watermark,
      codeCardRef, codeTextareaRef, tableScrollRef, tableCardRef, tableWidth,
      onCodeKeyDown, onCodePaste, onCodeResizeStart, onTableResizeStart, onCodeReady, setTable, showLineNumbers,
    } = props;
    const { t } = useTranslations();

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
            cardBackground={cardBackground}
            fileName={fileName}
            onFileNameChange={onFileNameChange}
            showWindowControls={showWindowControls}
            width={codeWidth}
            fontSize={fontSize}
            cardRef={codeCardRef}
            textareaRef={codeTextareaRef}
            onKeyDown={onCodeKeyDown}
            onPaste={onCodePaste}
            onResizeStart={onCodeResizeStart}
            onReady={onCodeReady}
            showLineNumbers={showLineNumbers}
          />
        ) : (
          <TableSnippet
            table={table}
            setTable={setTable}
            scrollRef={tableScrollRef}
            cardBackground={cardBackground}
            headerBg={tableHeaderBg}
            headerText={tableHeaderText}
            cardRef={tableCardRef}
            cardWidth={tableWidth}
            onResizeStart={onTableResizeStart}
          />
        )}

        {watermark && (
          <span className="absolute inset-x-0 bottom-0 text-center p-1 text-[10px] font-mono text-white/30 pointer-events-none select-none">
            {t.watermarkText}
          </span>
        )}
      </div>
    );
  },
);