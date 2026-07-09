"use client";

import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";

interface CodeSnippetProps {
  code: string;
  language: string;
  theme: string;
  fileName: string;
  showWindowControls: boolean;
}

export function CodeSnippet({
  code,
  language,
  theme,
  fileName,
  showWindowControls,
}: CodeSnippetProps) {
  const [html, setHtml] = useState("");

  useEffect(() => {
    let cancelled = false;

    codeToHtml(code || " ", { lang: language, theme })
      .then((out) => !cancelled && setHtml(out))
      .catch(() => {
        // linguagem inválida/ainda não suportada -> cai pro plaintext
        codeToHtml(code || " ", { lang: "plaintext", theme }).then(
          (out) => !cancelled && setHtml(out)
        );
      });

    return () => {
      cancelled = true;
    };
  }, [code, language, theme]);

  return (
    <div className="snippet-card min-w-[420px] max-w-[900px]">
      {showWindowControls && (
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>
          {fileName && (
            <span className="flex-1 text-center text-xs text-[#8b8b8b] font-mono truncate pr-14">
              {fileName}
            </span>
          )}
        </div>
      )}
      <div
        className="shiki-container"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}