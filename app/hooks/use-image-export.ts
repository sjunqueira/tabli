"use client";

import { useCallback, useState, RefObject } from "react";
import html2canvas from "html2canvas-pro";
import type { ExportFormat } from "../lib/types";

type ExportStatus = "idle" | "rendering" | "success" | "error" | "fallback";

export function useImageExport(
  targetRef: RefObject<HTMLDivElement | null>,
  format: ExportFormat,
  scale: number,
  onSuccess?: () => void,
) {
  const [status, setStatus] = useState<ExportStatus>("idle");
  const [fallbackUrl, setFallbackUrl] = useState<string | null>(null);

  const mimeType = format === "jpeg" ? "image/jpeg" : "image/png";
  // qualidade explícita pro JPEG — o padrão do navegador (~0.92) gera
  // artefatos visíveis em texto fino sobre fundo escuro
  const jpegQuality = 0.98;

  const renderCanvas = useCallback(async () => {
    if (!targetRef.current) throw new Error("Nada para capturar.");
    await new Promise((r) => setTimeout(r, 50));
    return html2canvas(targetRef.current, {
      scale,
      backgroundColor: format === "jpeg" ? "#000000" : null,
      logging: false,
      useCORS: true,
      ignoreElements: (el) => el.hasAttribute("data-ignore-in-export"),
      // html2canvas desenha o texto de <input> deslocado verticalmente
      // (aparece cortado na imagem final), então troca cada input do clone
      // por um <div> estático com o mesmo texto e visual — o clone é
      // descartado depois da captura, o DOM real não é tocado
      onclone: (clonedDoc, clonedEl) => {
        const originals = Array.from(targetRef.current?.querySelectorAll("input") ?? []);
        clonedEl.querySelectorAll("input").forEach((cloneInput, i) => {
          const original = originals[i];
          if (!original) return;
          const cs = window.getComputedStyle(original);
          const replacement = clonedDoc.createElement("div");
          replacement.textContent = original.value || original.placeholder || "";
          replacement.style.fontFamily = cs.fontFamily;
          replacement.style.fontSize = cs.fontSize;
          replacement.style.fontWeight = cs.fontWeight;
          replacement.style.fontStyle = cs.fontStyle;
          replacement.style.letterSpacing = cs.letterSpacing;
          replacement.style.color = cs.color;
          replacement.style.textAlign = cs.textAlign;
          replacement.style.padding = cs.padding;
          replacement.style.boxSizing = "border-box";
          replacement.style.width = cs.width;
          replacement.style.height = cs.height;
          // line-height = altura do input centraliza o texto verticalmente,
          // reproduzindo como o navegador renderiza inputs de linha única
          replacement.style.lineHeight = cs.height;
          replacement.style.whiteSpace = "nowrap";
          replacement.style.overflow = "hidden";
          replacement.style.textOverflow = cs.textOverflow;
          cloneInput.replaceWith(replacement);
        });
      },
    });
  }, [targetRef, format, scale]);

  const copyImage = useCallback(async () => {
    setStatus("rendering");
    try {
      const canvas = await renderCanvas();
      // clipboard sempre em PNG: o Chrome só aceita image/png no clipboard —
      // copiar como JPEG caía SEMPRE no modal de fallback (com compressão
      // padrão por cima). O formato escolhido continua valendo pro download.
      canvas.toBlob(async (blob) => {
        if (!blob) return setStatus("error");
        try {
          await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
          setStatus("success");
          onSuccess?.();
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
  }, [renderCanvas, onSuccess]);

  const downloadImage = useCallback(
    async (filename = "snippet") => {
      setStatus("rendering");
      try {
        const canvas = await renderCanvas();
        const ext = format === "jpeg" ? "jpg" : "png";
        const link = document.createElement("a");
        link.download = `${filename}.${ext}`;
        link.href = canvas.toDataURL(mimeType, format === "jpeg" ? jpegQuality : undefined);
        link.click();
        setStatus("success");
        onSuccess?.();
        setTimeout(() => setStatus("idle"), 2000);
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    },
    [renderCanvas, mimeType, format, onSuccess],
  );

  return { status, copyImage, downloadImage, fallbackUrl, setFallbackUrl };
}