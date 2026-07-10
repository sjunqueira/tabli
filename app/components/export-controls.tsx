"use client";

import { useEffect, type RefObject } from "react";
import { useImageExport } from "../hooks/use-image-export";
import { useTranslations } from "../lib/i18n";
import type { ExportFormat, ExportScale } from "../lib/types";

interface ExportControlsProps {
  targetRef: RefObject<HTMLDivElement | null>;
  fileName?: string;
  format: ExportFormat;
  scale: ExportScale;
  compact?: boolean;
  onExportSuccess?: () => void;
}

function isEditableTarget(el: Element | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  return el.tagName === "TEXTAREA" || el.tagName === "INPUT" || el.isContentEditable;
}

export function ExportControls({ targetRef, fileName, format, scale, compact, onExportSuccess }: ExportControlsProps) {
  const { t } = useTranslations();
  const { status, copyImage, downloadImage, fallbackUrl, setFallbackUrl } = useImageExport(
    targetRef,
    format,
    scale,
    onExportSuccess,
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isModifier = e.metaKey || e.ctrlKey;
      if (!isModifier || e.altKey) return;
      if (isEditableTarget(document.activeElement)) return;

      const key = e.key.toLowerCase();
      if (key === "c") {
        e.preventDefault();
        copyImage();
      } else if (key === "s") {
        e.preventDefault();
        downloadImage(fileName || "snippet");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [copyImage, downloadImage, fileName]);

  return (
    <div className={compact ? "flex items-center gap-2" : "p-6 border-t border-[#222] flex flex-col gap-2"}>
      <button
        onClick={copyImage}
        disabled={status === "rendering"}
        className={
          compact
            ? "bg-[#f3f4f6] text-[#050505] px-4 py-1.5 rounded-md text-xs font-bold hover:bg-white transition-colors disabled:opacity-60"
            : "bg-[#f3f4f6] text-[#050505] w-full py-3 rounded-lg font-bold hover:bg-white transition-colors disabled:opacity-60"
        }
      >
        {status === "rendering" ? (
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        ) : status === "success" ? (
          t.exportControls.copied
        ) : (
          t.exportControls.copy
        )}
      </button>
      <button
        onClick={() => downloadImage(fileName || "snippet")}
        disabled={status === "rendering"}
        className={
          compact
            ? "border border-[#333] text-[#d4d4d8] px-4 py-1.5 rounded-md text-xs hover:border-white hover:text-white transition-colors disabled:opacity-60"
            : "border border-[#333] text-[#d4d4d8] w-full py-2.5 rounded-lg text-sm hover:border-white hover:text-white transition-colors disabled:opacity-60"
        }
      >
        {t.exportControls.download}
      </button>

      {status === "fallback" && fallbackUrl && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-8 bg-black/90">
          <div className="bg-[#111] p-6 rounded-xl border border-[#333] shadow-2xl max-w-4xl w-full flex flex-col items-center">
            <h2 className="text-white font-bold mb-2">{t.exportControls.imageReady}</h2>
            <p className="text-[#8b8b8b] text-sm mb-6 text-center">
              {t.exportControls.clipboardBlocked}
              <br />
              {t.exportControls.rightClickHint}
            </p>
            <div className="max-h-[60vh] overflow-auto rounded border border-[#222] bg-black p-2 mb-6">
              <img src={fallbackUrl} alt={t.exportControls.snippetAlt} className="max-w-full" />
            </div>
            <button
              onClick={() => setFallbackUrl(null)}
              className="px-6 py-2 bg-white text-black font-bold rounded-lg hover:bg-gray-200"
            >
              {t.exportControls.close}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}