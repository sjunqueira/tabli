"use client";

import Image from "next/image";
import { useState } from "react";
import type { ExportFormat } from "../lib/types";
import { FONT_SIZES } from "../lib/constants";
import Link from "next/link";

interface HeaderProps {
  fontSize: number;
  onFontSizeChange: (v: number) => void;
  exportFormat: ExportFormat;
  onExportFormatChange: (v: ExportFormat) => void;
  watermark: boolean;
  onWatermarkChange: (v: boolean) => void;
}

export function Header({
  fontSize,
  onFontSizeChange,
  exportFormat,
  onExportFormatChange,
  watermark,
  onWatermarkChange,
}: HeaderProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const cycleFontSize = () => {
    const currentIndex = FONT_SIZES.indexOf(fontSize);
    const nextIndex = (currentIndex + 1) % FONT_SIZES.length;
    onFontSizeChange(FONT_SIZES[nextIndex]);
  };

  const cycleExportFormat = () => {
    onExportFormatChange(exportFormat === "png" ? "jpeg" : "png");
  };

  return (
    <header className="w-full flex items-center justify-between p-4 px-6 select-none relative z-50">
      <div className="flex items-center gap-3">
        <h1 className="text-white text-sm font-bold tracking-widest flex items-center gap-2">
          Tabli
          <span className="px-1.5 py-0.5 rounded-md bg-[#1a1a1a] border border-[#333] text-[9px] text-[#8b8b8b] tracking-normal normal-case font-medium">
            beta
          </span>
        </h1>
      </div>

      <nav className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-4 mr-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-[#8b8b8b] font-medium uppercase tracking-wider">
              Copiar
            </span>
            <kbd className="text-[10px] text-[#555] font-mono bg-[#111] px-1.5 py-0.5 rounded-sm border border-[#333]">
              ⌘ C
            </kbd>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-[#8b8b8b] font-medium uppercase tracking-wider">
              Salvar
            </span>
            <kbd className="text-[10px] text-[#555] font-mono bg-[#111] px-1.5 py-0.5 rounded-sm border border-[#333]">
              ⌘ S
            </kbd>
          </div>
        </div>

        <div className="hidden sm:block w-px h-4 bg-[#333]" />

        <div className="relative">
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            title="Configurações"
            className={`transition-colors p-1.5 rounded hover:bg-[#111] ${
              isSettingsOpen ? "text-white bg-[#111]" : "text-[#8b8b8b]"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
              />
            </svg>
          </button>

          {isSettingsOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-[#0a0a0a] border border-[#222] rounded-lg shadow-xl flex flex-col py-2 overflow-hidden">
              <div className="px-3 py-1.5 border-b border-[#222] mb-1">
                <span className="text-[10px] text-[#555] font-bold uppercase tracking-wider">
                  Preferências
                </span>
              </div>

              <button
                onClick={cycleExportFormat}
                className="flex items-center justify-between px-3 py-2 hover:bg-[#1a1a1a] transition-colors w-full text-left"
              >
                <span className="text-xs text-[#8b8b8b]">Exportar como</span>
                <span className="text-[10px] text-white font-medium bg-[#111] px-1.5 py-0.5 rounded border border-[#333] uppercase">
                  {exportFormat}
                </span>
              </button>

              <button
                onClick={cycleFontSize}
                className="flex items-center justify-between px-3 py-2 hover:bg-[#1a1a1a] transition-colors w-full text-left"
              >
                <span className="text-xs text-[#8b8b8b]">Tamanho da fonte</span>
                <span className="text-xs text-white font-medium">{fontSize}px</span>
              </button>

              <button
                onClick={() => onWatermarkChange(!watermark)}
                className="flex items-center justify-between px-3 py-2 hover:bg-[#1a1a1a] transition-colors w-full text-left group"
              >
                <span className="text-xs text-[#8b8b8b]">Marca d&apos;água</span>
                <div
                  className={`w-6 h-3.5 rounded-full flex items-center px-0.5 border transition-colors ${
                    watermark ? "bg-white/20 border-white/40" : "bg-[#222] border-[#333] group-hover:border-[#555]"
                  }`}
                >
                  <div
                    className={`w-2.5 h-2.5 rounded-full transition-transform ${
                      watermark ? "bg-white translate-x-2.5" : "bg-[#8b8b8b] translate-x-0"
                    }`}
                  />
                </div>
              </button>
            </div>
          )}
        </div>

        <div className="w-px h-4 bg-[#333]" />
        <Link
          href="https://github.com/sjunqueira/tabli"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 px-2 py-1.5 rounded-md transition-all"
        >
          <Image alt="github-logo" src={"github.svg"} width={24} height={24} className="invert" loading="eager" />
          <span className="text-[#8b8b8b] text-xs font-medium group-hover:text-white transition-colors">
            Star on GitHub
          </span>
        </Link>
      </nav>
    </header>
  );
}