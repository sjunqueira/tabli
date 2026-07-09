"use client";

import type { RefObject } from "react";
import { BACKGROUND_PRESETS, LANGUAGE_OPTIONS, THEME_OPTIONS } from "../lib/constants";
import { ExportControls } from "./export-controls";
import { Mode } from "../lib/types";

interface BottomBarProps {
  mode: Mode;
  setMode: (m: Mode) => void;
  language: string;
  setLanguage: (v: string) => void;
  theme: string;
  setTheme: (v: string) => void;
  showWindowControls: boolean;
  setShowWindowControls: (v: boolean) => void;
  background: string;
  setBackground: (v: string) => void;
  padding: number;
  setPadding: (v: number) => void;
  targetRef: RefObject<HTMLDivElement>;
  fileName: string;
}

export function BottomBar(props: BottomBarProps) {
  const {
    mode, setMode, language, setLanguage, theme, setTheme,
    showWindowControls, setShowWindowControls,
    background, setBackground, padding, setPadding,
    targetRef, fileName,
  } = props;

  return (
    <div className="bottom-bar">
      <div className="grid grid-cols-2 gap-1 bg-black/40 p-1 rounded-lg">
        <button
          onClick={() => setMode("code")}
          className={`text-xs font-bold px-3 py-1.5 rounded-md transition-colors ${
            mode === "code" ? "bg-white text-black" : "text-[#8b8b8b] hover:text-white"
          }`}
        >
          Código
        </button>
        <button
          onClick={() => setMode("table")}
          className={`text-xs font-bold px-3 py-1.5 rounded-md transition-colors ${
            mode === "table" ? "bg-white text-black" : "text-[#8b8b8b] hover:text-white"
          }`}
        >
          Tabela
        </button>
      </div>

      <div className="bottom-bar-divider" />

      {mode === "code" && (
        <>
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className="bottom-bar-select">
            {LANGUAGE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <select value={theme} onChange={(e) => setTheme(e.target.value)} className="bottom-bar-select">
            {THEME_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <label className="flex items-center gap-1.5 text-xs text-[#8b8b8b] cursor-pointer px-1">
            <input
              type="checkbox"
              checked={showWindowControls}
              onChange={(e) => setShowWindowControls(e.target.checked)}
            />
            Janela
          </label>
          <div className="bottom-bar-divider" />
        </>
      )}

      <div className="flex gap-1.5">
        {BACKGROUND_PRESETS.map((preset) => (
          <button
            key={preset.name}
            title={preset.name}
            onClick={() => setBackground(preset.value)}
            className={`w-5 h-5 rounded-full border ${
              background === preset.value ? "border-white" : "border-[#333]"
            }`}
            style={{
              background:
                preset.value === "transparent"
                  ? "repeating-conic-gradient(#333 0% 25%, #1a1a1a 0% 50%) 50% / 8px 8px"
                  : preset.value,
            }}
          />
        ))}
      </div>

      <div className="bottom-bar-divider" />

      <div className="flex items-center gap-2">
        <button onClick={() => setPadding(Math.max(0, padding - 16))} className="bottom-bar-step">−</button>
        <span className="text-xs text-[#8b8b8b] w-8 text-center">{padding}px</span>
        <button onClick={() => setPadding(Math.min(128, padding + 16))} className="bottom-bar-step">+</button>
      </div>

      <div className="bottom-bar-divider" />

      <ExportControls targetRef={targetRef} fileName={fileName.split(".")[0] || "snippet"} compact />
    </div>
  );
}