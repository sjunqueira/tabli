"use client";

import { useEffect, useRef, useState } from "react";
import { codeToHtml } from "shiki";

interface CodeSnippetProps {
  code: string;
  onCodeChange: (v: string) => void;
  language: string;
  theme: string;
  fileName: string;
  onFileNameChange: (v: string) => void;
  showWindowControls: boolean;
}

export function CodeSnippet({
  code,
  onCodeChange,
  language,
  theme,
  fileName,
  onFileNameChange,
  showWindowControls,
}: CodeSnippetProps) {
  const [html, setHtml] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    let cancelled = false;
    codeToHtml(code || " ", { lang: language, theme })
      .then((out) => !cancelled && setHtml(out))
      .catch(() => {
        codeToHtml(code || " ", { lang: "plaintext", theme }).then(
          (out) => !cancelled && setHtml(out)
        );
      });
    return () => {
      cancelled = true;
    };
  }, [code, language, theme]);

  // auto-grow da textarea junto com o conteúdo
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [code]);

  return (
    <div className="snippet-card min-w-[420px] max-w-[900px]">
      {showWindowControls && (
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
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

      <div className="code-edit-layer">
        <div
          className="shiki-container"
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          spellCheck={false}
          data-ignore-in-export
          className="code-edit-textarea"
        />
      </div>
    </div>
  );
}