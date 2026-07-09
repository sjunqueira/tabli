"use client";

import type { RefObject } from "react";
import { useImageExport } from "../hooks/use-image-export";

interface ExportControlsProps {
  targetRef: RefObject<HTMLDivElement>;
  fileName?: string;
}

const LABELS: Record<string, string> = {
  idle: "Copiar imagem",
  rendering: "Renderizando...",
  success: "Copiado!",
  error: "Erro, tente de novo",
  fallback: "Veja abaixo",
};

export function ExportControls({ targetRef, fileName }: ExportControlsProps) {
  const { status, copyImage, downloadImage, fallbackUrl, setFallbackUrl } =
    useImageExport(targetRef);

  return (
    <div className="p-6 border-t border-[#222] flex flex-col gap-2">
      <button
        onClick={copyImage}
        disabled={status === "rendering"}
        className="bg-[#f3f4f6] text-[#050505] w-full py-3 rounded-lg font-bold hover:bg-white transition-colors disabled:opacity-60"
      >
        {LABELS[status]}
      </button>
      <button
        onClick={() => downloadImage(`${fileName || "snippet"}.png`)}
        disabled={status === "rendering"}
        className="border border-[#333] text-[#d4d4d8] w-full py-2.5 rounded-lg text-sm hover:border-white hover:text-white transition-colors disabled:opacity-60"
      >
        Baixar PNG
      </button>

      {status === "fallback" && fallbackUrl && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-8 bg-black/90">
          <div className="bg-[#111] p-6 rounded-xl border border-[#333] shadow-2xl max-w-4xl w-full flex flex-col items-center">
            <h2 className="text-white font-bold mb-2">Sua imagem está pronta!</h2>
            <p className="text-[#8b8b8b] text-sm mb-6 text-center">
              O navegador bloqueou a cópia automática.
              <br />
              Clique com o botão direito na imagem e selecione &quot;Copiar imagem&quot;.
            </p>
            <div className="max-h-[60vh] overflow-auto rounded border border-[#222] bg-black p-2 mb-6">
              <img src={fallbackUrl} alt="Snippet gerado" className="max-w-full" />
            </div>
            <button
              onClick={() => setFallbackUrl(null)}
              className="px-6 py-2 bg-white text-black font-bold rounded-lg hover:bg-gray-200"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}