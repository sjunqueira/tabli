"use client";

import type { FormatFeedback } from "../hooks/use-code-editor-state";
import { useTranslations } from "../lib/i18n";

interface CodeToolbarProps {
  isCustomWidth: boolean;
  onResetWidth: () => void;
  onFormat: () => void;
  isOverflowingWidth: boolean;
  isOverflowingWidthHard: boolean;
  isOverflowingHeight: boolean;
  formatFeedback?: FormatFeedback | null;
}

export function CodeToolbar({
  isCustomWidth,
  onResetWidth,
  onFormat,
  isOverflowingWidth,
  isOverflowingWidthHard,
  isOverflowingHeight,
  formatFeedback,
}: CodeToolbarProps) {
  const { t } = useTranslations();
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-4">
        {isCustomWidth && (
          <button
            onClick={onResetWidth}
            className="text-[10px] text-[#555] hover:text-[#8b8b8b] transition-colors uppercase tracking-widest font-bold"
          >
            {t.codeToolbar.resetWidth}
          </button>
        )}
        <button
          onClick={onFormat}
          className="text-[10px] text-[#555] hover:text-[#8b8b8b] transition-colors uppercase tracking-widest font-bold"
        >
          {t.codeToolbar.format}
        </button>
      </div>

      {formatFeedback && (
        <div
          className={`flex items-center gap-2 text-[10px] px-3 py-1.5 rounded-md border max-w-[420px] ${
            formatFeedback.type === "error"
              ? "text-red-400/90 bg-red-500/5 border-red-500/10"
              : "text-yellow-600/80 bg-yellow-500/5 border-yellow-500/10"
          }`}
        >
          {formatFeedback.type === "error" ? (
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )}
          {formatFeedback.message}
        </div>
      )}

      {isOverflowingWidthHard ? (
        <div className="flex items-center gap-2 text-[10px] text-red-400/90 bg-red-500/5 px-3 py-1.5 rounded-md border border-red-500/10">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {t.codeToolbar.overflowWidth}
        </div>
      ) : (
        isOverflowingWidth && (
          <div className="flex items-center gap-2 text-[10px] text-[#8b8b8b] bg-white/[0.03] px-3 py-1.5 rounded-md border border-white/[0.06]">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
            {t.codeToolbar.overflowWidthSoft}
          </div>
        )
      )}

      {isOverflowingHeight && (
        <div className="flex items-center gap-2 text-[10px] text-yellow-600/80 bg-yellow-500/5 px-3 py-1.5 rounded-md border border-yellow-500/10">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {t.codeToolbar.overflowHeight}
        </div>
      )}
    </div>
  );
}