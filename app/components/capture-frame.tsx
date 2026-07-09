"use client";

import { forwardRef } from "react";
import { CodeSnippet } from "./code-snippet";
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
}

export const CaptureFrame = forwardRef<HTMLDivElement, CaptureFrameProps>(
  function CaptureFrame(
    { mode, background, padding, code, onCodeChange, language, theme, fileName, onFileNameChange, showWindowControls, table },
    ref
  ) {
    return (
      <div
        ref={ref}
        style={{ background, padding: `${padding}px` }}
        className="inline-flex transition-[padding] duration-200"
      >
        {mode === "code" ? (
          <CodeSnippet
            code={code}
            onCodeChange={onCodeChange}
            language={language}
            theme={theme}
            fileName={fileName}
            onFileNameChange={onFileNameChange}
            showWindowControls={showWindowControls}
          />
        ) : (
          <TableSnippet table={table} />
        )}
      </div>
    );
  }
);