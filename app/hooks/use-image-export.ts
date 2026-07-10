"use client";

import { useCallback, useState, RefObject } from "react";
import html2canvas from "html2canvas-pro";
import type { ExportFormat } from "../lib/types";

type ExportStatus = "idle" | "rendering" | "success" | "error" | "fallback";

export function useImageExport(targetRef: RefObject<HTMLDivElement | null>, format: ExportFormat) {
  const [status, setStatus] = useState<ExportStatus>("idle");
  const [fallbackUrl, setFallbackUrl] = useState<string | null>(null);

  const mimeType = format === "jpeg" ? "image/jpeg" : "image/png";

  const renderCanvas = useCallback(async () => {
    if (!targetRef.current) throw new Error("Nada para capturar.");
    await new Promise((r) => setTimeout(r, 50));
    return html2canvas(targetRef.current, {
      scale: 2,
      backgroundColor: format === "jpeg" ? "#000000" : null,
      logging: false,
      useCORS: true,
      ignoreElements: (el) => el.hasAttribute("data-ignore-in-export"),
    });
  }, [targetRef, format]);

  const copyImage = useCallback(async () => {
    setStatus("rendering");
    try {
      const canvas = await renderCanvas();
      canvas.toBlob(async (blob) => {
        if (!blob) return setStatus("error");
        try {
          await navigator.clipboard.write([new ClipboardItem({ [mimeType]: blob })]);
          setStatus("success");
          setTimeout(() => setStatus("idle"), 2000);
        } catch {
          setFallbackUrl(canvas.toDataURL(mimeType));
          setStatus("fallback");
        }
      }, mimeType);
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }, [renderCanvas, mimeType]);

  const downloadImage = useCallback(
    async (filename = "snippet") => {
      setStatus("rendering");
      try {
        const canvas = await renderCanvas();
        const ext = format === "jpeg" ? "jpg" : "png";
        const link = document.createElement("a");
        link.download = `${filename}.${ext}`;
        link.href = canvas.toDataURL(mimeType);
        link.click();
        setStatus("success");
        setTimeout(() => setStatus("idle"), 2000);
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    },
    [renderCanvas, mimeType, format],
  );

  return { status, copyImage, downloadImage, fallbackUrl, setFallbackUrl };
}