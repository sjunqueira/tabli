"use client";

import { useCallback, useState, RefObject } from "react";
import html2canvas from "html2canvas-pro";

type ExportStatus = "idle" | "rendering" | "success" | "error" | "fallback";

export function useImageExport(targetRef: RefObject<HTMLDivElement>) {
  const [status, setStatus] = useState<ExportStatus>("idle");
  const [fallbackUrl, setFallbackUrl] = useState<string | null>(null);

  const renderCanvas = useCallback(async () => {
    if (!targetRef.current) throw new Error("Nada para capturar.");
    await new Promise((r) => setTimeout(r, 50)); // dá tempo do highlight assentar
    return html2canvas(targetRef.current, {
      scale: 2,
      backgroundColor: null,
      logging: false,
      useCORS: true,
    });
  }, [targetRef]);

  const copyImage = useCallback(async () => {
    setStatus("rendering");
    try {
      const canvas = await renderCanvas();
      canvas.toBlob(async (blob) => {
        if (!blob) return setStatus("error");
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob }),
          ]);
          setStatus("success");
          setTimeout(() => setStatus("idle"), 2000);
        } catch {
          setFallbackUrl(canvas.toDataURL("image/png"));
          setStatus("fallback");
        }
      }, "image/png");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }, [renderCanvas]);

  const downloadImage = useCallback(
    async (filename = "snippet.png") => {
      setStatus("rendering");
      try {
        const canvas = await renderCanvas();
        const link = document.createElement("a");
        link.download = filename;
        link.href = canvas.toDataURL("image/png");
        link.click();
        setStatus("success");
        setTimeout(() => setStatus("idle"), 2000);
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    },
    [renderCanvas]
  );

  return { status, copyImage, downloadImage, fallbackUrl, setFallbackUrl };
}