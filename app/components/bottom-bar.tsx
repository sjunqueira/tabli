"use client";

import { useState, type RefObject } from "react";
import { BACKGROUND_PRESETS, LANGUAGE_OPTIONS, THEME_OPTIONS, PADDING_PRESETS } from "../lib/constants";
import { ExportControls } from "./export-controls";
import type { ExportFormat, Mode, PaddingPreset } from "../lib/types";

interface BottomBarProps {
  mode: Mode;
  setMode: (m: Mode) => void;
  language: string;
  setLanguage: (v: string) => void;
  theme: string;
  setTheme: (v: string) => void;
  showWindowControls: boolean;
  setShowWindowControls: (v: boolean) => void;
  showLineNumbers: boolean;
  setShowLineNumbers: (v: boolean) => void;
  background: string;
  setBackground: (v: string) => void;
  padding: PaddingPreset;
  setPadding: (v: PaddingPreset) => void;
  targetRef: RefObject<HTMLDivElement | null>;
  fileName: string;
  exportFormat: ExportFormat;
}

export function BottomBar(props: BottomBarProps) {
  const {
    mode, setMode, language, setLanguage, theme, setTheme,
    showWindowControls, setShowWindowControls,
    showLineNumbers, setShowLineNumbers,
    background, setBackground, padding, setPadding,
    targetRef, fileName, exportFormat,
  } = props;

  const [isBgOpen, setIsBgOpen] = useState(false);
  const [isPaddingOpen, setIsPaddingOpen] = useState(false);

  const activePadding = PADDING_PRESETS.find((p) => p.id === padding) || PADDING_PRESETS[2];

  return (
    <div className="bottom-bar flex items-center">
      <div className="flex gap-1 bg-black/40 p-1 rounded-lg w-fit">
        <button
          onClick={() => setMode("code")}
          className={`whitespace-nowrap text-xs font-bold px-3 py-1.5 rounded-md transition-colors ${
            mode === "code" ? "bg-white text-black" : "text-[#8b8b8b] hover:text-white"
          }`}
        >
          Código
        </button>
        <button
          onClick={() => setMode("table")}
          className={`whitespace-nowrap text-xs font-bold px-3 py-1.5 rounded-md transition-colors ${
            mode === "table" ? "bg-white text-black" : "text-[#8b8b8b] hover:text-white"
          }`}
        >
          Tabela
        </button>
      </div>

      <div className="bottom-bar-divider ml-2" />

      <div
        className={`flex items-center overflow-hidden transition-all duration-300 ease-in-out ${
          mode === "code" ? "max-w-[460px] opacity-100" : "max-w-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center whitespace-nowrap">
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className="bottom-bar-select">
            {LANGUAGE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          <select value={theme} onChange={(e) => setTheme(e.target.value)} className="bottom-bar-select ml-2">
            {THEME_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          <label className="flex items-center gap-1.5 text-xs text-[#8b8b8b] cursor-pointer px-3">
            <input
              type="checkbox"
              checked={showWindowControls}
              onChange={(e) => setShowWindowControls(e.target.checked)}
            />
            Janela
          </label>

          <label className="flex items-center gap-1.5 text-xs text-[#8b8b8b] cursor-pointer pr-3">
            <input
              type="checkbox"
              checked={showLineNumbers}
              onChange={(e) => setShowLineNumbers(e.target.checked)}
            />
            Linhas
          </label>

          <div className="bottom-bar-divider mr-2" />
        </div>
      </div>

      <div className="relative">
        {(() => {
          const activeBg = BACKGROUND_PRESETS.find((p) => p.value === background) || BACKGROUND_PRESETS[0];

          return (
            <button
              type="button"
              onClick={() => setIsBgOpen(!isBgOpen)}
              className="flex items-center w-[120px] justify-between gap-1.5 bg-transparent hover:bg-black/20 rounded-md px-1.5 py-1.5 transition-colors focus:outline-none"
            >
              <div className="flex flex-1 items-center gap-1.5 min-w-0">
                <div
                  className="w-4 h-4 rounded-full border border-[#333] shrink-0"
                  style={{
                    background: activeBg?.value === "transparent"
                      ? "repeating-conic-gradient(#333 0% 25%, #1a1a1a 0% 50%) 50% / 8px 8px"
                      : activeBg?.value,
                  }}
                />
                <span className="text-xs text-[#8b8b8b] hover:text-white transition-colors truncate text-left w-full">
                  {activeBg?.name}
                </span>
              </div>

              <svg
                className={`w-3.5 h-3.5 shrink-0 text-[#8b8b8b] transition-transform duration-200 ${isBgOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
          );
        })()}

        {isBgOpen && (
          <div className="absolute bottom-full left-0 mb-1 w-40 bg-[#0a0a0a] border border-[#222] rounded-lg shadow-xl z-50 flex flex-col py-1 overflow-hidden">
            {BACKGROUND_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => {
                  setBackground(preset.value);
                  setIsBgOpen(false);
                }}
                className={`flex items-center gap-2 px-3 py-2 text-xs text-left transition-colors hover:bg-[#1a1a1a] ${
                  background === preset.value ? "text-white bg-[#111]" : "text-[#8b8b8b]"
                }`}
              >
                <div
                  className="w-4 h-4 rounded-full border border-[#333] shrink-0"
                  style={{
                    background: preset.value === "transparent"
                      ? "repeating-conic-gradient(#333 0% 25%, #1a1a1a 0% 50%) 50% / 8px 8px"
                      : preset.value,
                  }}
                />
                <span className="truncate">{preset.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="bottom-bar-divider mx-2" />

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsPaddingOpen(!isPaddingOpen)}
          className="flex items-center gap-1.5 bg-transparent hover:bg-black/20 rounded-md px-2 py-1.5 transition-colors focus:outline-none"
        >
          <span className="text-xs text-[#8b8b8b] hover:text-white transition-colors">
            {activePadding.label}
          </span>
          <svg
            className={`w-3.5 h-3.5 shrink-0 text-[#8b8b8b] transition-transform duration-200 ${isPaddingOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>

        {isPaddingOpen && (
          <div className="absolute bottom-full left-0 mb-1 w-32 bg-[#0a0a0a] border border-[#222] rounded-lg shadow-xl z-50 flex flex-col py-1 overflow-hidden">
            {PADDING_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  setPadding(preset.id);
                  setIsPaddingOpen(false);
                }}
                className={`px-3 py-2 text-xs text-left transition-colors hover:bg-[#1a1a1a] ${
                  padding === preset.id ? "text-white bg-[#111]" : "text-[#8b8b8b]"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="bottom-bar-divider mx-2" />

      <ExportControls
        targetRef={targetRef}
        fileName={fileName.split(".")[0] || "snippet"}
        format={exportFormat}
        compact
      />
    </div>
  );
}