"use client";

import { forwardRef } from "react";
import { CodeSnippet } from "./code-snippet";
import { TableSnippet } from "./table-snippet";
import { Mode } from "../lib/types";

interface CaptureFrameProps {
  mode: Mode;
  background: string;
  padding: number;
  code: string;
  language: string;
  theme: string;
  fileName: string;
  showWindowControls: boolean;
  markdown: string;
}

export const CaptureFrame = forwardRef<HTMLDivElement, CaptureFrameProps>(
  function CaptureFrame(
    { mode, background, padding, code, language, theme, fileName, showWindowControls, markdown },
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
            language={language}
            theme={theme}
            fileName={fileName}
            showWindowControls={showWindowControls}
          />
        ) : (
          <TableSnippet markdown={markdown} />
        )}
      </div>
    );
  }
);