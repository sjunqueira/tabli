"use client";

import { useState, type RefObject } from "react";
import { EDITOR_THEMES, LANGUAGE_OPTIONS, PADDING_PRESETS } from "../lib/constants";
import { ExportControls } from "./export-controls";
import { LanguageIcon } from "../lib/language-icons";
import { useTranslations } from "../lib/i18n";
import type { EditorThemeId, ExportFormat, ExportScale, Mode, PaddingPreset } from "../lib/types";

interface BottomBarProps {
  mode: Mode;
  setMode: (m: Mode) => void;
  language: string;
  setLanguage: (v: string) => void;
  themeId: EditorThemeId;
  setThemeId: (v: EditorThemeId) => void;
  showBackground: boolean;
  setShowBackground: (v: boolean) => void;
  showWindowControls: boolean;
  setShowWindowControls: (v: boolean) => void;
  showLineNumbers: boolean;
  setShowLineNumbers: (v: boolean) => void;
  padding: PaddingPreset;
  setPadding: (v: PaddingPreset) => void;
  targetRef: RefObject<HTMLDivElement | null>;
  fileName: string;
  exportFormat: ExportFormat;
  exportScale: ExportScale;
  onExportSuccess?: () => void;
}

interface SwitchToggleProps {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

function SwitchToggle({ label, checked, onChange }: SwitchToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="group flex items-center gap-1.5 whitespace-nowrap px-1.5 py-1.5 rounded-md hover:bg-black/20 transition-colors"
    >
      <span className="text-xs text-[#8b8b8b] group-hover:text-white transition-colors">{label}</span>
      <div
        className={`w-6 h-3.5 rounded-full flex items-center px-0.5 border transition-colors shrink-0 ${
          checked ? "bg-white/20 border-white/40" : "bg-[#222] border-[#333] group-hover:border-[#555]"
        }`}
      >
        <div
          className={`w-2.5 h-2.5 rounded-full transition-transform ${
            checked ? "bg-white translate-x-2.5" : "bg-[#8b8b8b] translate-x-0"
          }`}
        />
      </div>
    </button>
  );
}

export function BottomBar(props: BottomBarProps) {
  const {
    mode, setMode, language, setLanguage, themeId, setThemeId,
    showBackground, setShowBackground,
    showWindowControls, setShowWindowControls,
    showLineNumbers, setShowLineNumbers,
    padding, setPadding,
    targetRef, fileName, exportFormat, exportScale, onExportSuccess,
  } = props;

  const { t } = useTranslations();
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isPaddingOpen, setIsPaddingOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  const activePadding = PADDING_PRESETS.find((p) => p.id === padding) || PADDING_PRESETS[2];
  const activeLanguage = LANGUAGE_OPTIONS.find((l) => l.value === language) || LANGUAGE_OPTIONS[0];

  return (
    <div className="bottom-bar flex items-center">
      <div className="flex gap-1 bg-black/40 p-1 rounded-lg w-fit">
        <button
          onClick={() => setMode("code")}
          className={`whitespace-nowrap text-xs font-bold px-3 py-1.5 rounded-md transition-colors ${
            mode === "code" ? "bg-white text-black" : "text-[#8b8b8b] hover:text-white"
          }`}
        >
          {t.common.code}
        </button>
        <button
          onClick={() => setMode("table")}
          className={`whitespace-nowrap text-xs font-bold px-3 py-1.5 rounded-md transition-colors ${
            mode === "table" ? "bg-white text-black" : "text-[#8b8b8b] hover:text-white"
          }`}
        >
          {t.common.table}
        </button>
      </div>

      <div className="bottom-bar-divider ml-2" />

      {mode === "code" && (
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsLanguageOpen(!isLanguageOpen)}
            className="flex items-center gap-1.5 bg-transparent hover:bg-black/20 rounded-md px-2 py-1.5 transition-colors focus:outline-none"
          >
            <LanguageIcon language={activeLanguage.value} className="w-3.5 h-3.5 shrink-0" />
            <span className="text-xs text-[#8b8b8b] hover:text-white transition-colors whitespace-nowrap">
              {activeLanguage.label}
            </span>
            <svg
              className={`w-3.5 h-3.5 shrink-0 text-[#8b8b8b] transition-transform duration-200 ${isLanguageOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>

          {isLanguageOpen && (
            <div className="absolute bottom-full left-0 mb-1 w-44 max-h-72 overflow-y-auto bg-[#0a0a0a] border border-[#222] rounded-lg shadow-xl z-50 flex flex-col py-1">
              {LANGUAGE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setLanguage(opt.value);
                    setIsLanguageOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 text-xs text-left transition-colors hover:bg-[#1a1a1a] ${
                    language === opt.value ? "text-white bg-[#111]" : "text-[#8b8b8b]"
                  }`}
                >
                  <LanguageIcon language={opt.value} className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{opt.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div
        className={`flex items-center overflow-hidden transition-all duration-300 ease-in-out ${
          mode === "code" ? "max-w-[460px] opacity-100" : "max-w-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center whitespace-nowrap gap-1">
          <SwitchToggle
            label={t.bottomBar.windowControls}
            checked={showWindowControls}
            onChange={setShowWindowControls}
          />
          <SwitchToggle label={t.bottomBar.lineNumbers} checked={showLineNumbers} onChange={setShowLineNumbers} />

          <div className="bottom-bar-divider mx-1" />
        </div>
      </div>

      <SwitchToggle label={t.bottomBar.background} checked={showBackground} onChange={setShowBackground} />

      <div className="bottom-bar-divider mx-2" />

      <div className="relative">
        {(() => {
          const activeTheme = EDITOR_THEMES.find((t) => t.id === themeId) || EDITOR_THEMES[0];

          return (
            <button
              type="button"
              onClick={() => setIsThemeOpen(!isThemeOpen)}
              className="flex items-center w-[140px] justify-between gap-1.5 bg-transparent hover:bg-black/20 rounded-md px-1.5 py-1.5 transition-colors focus:outline-none"
            >
              <div className="flex flex-1 items-center gap-1.5 min-w-0">
                <div
                  className="w-4 h-4 rounded-full border border-[#333] shrink-0"
                  style={{ background: activeTheme.canvasBackground }}
                />
                <span className="text-xs text-[#8b8b8b] hover:text-white transition-colors truncate text-left w-full">
                  {t.themes[activeTheme.id]}
                </span>
              </div>

              <svg
                className={`w-3.5 h-3.5 shrink-0 text-[#8b8b8b] transition-transform duration-200 ${isThemeOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
          );
        })()}

        {isThemeOpen && (
          <div className="absolute bottom-full left-0 mb-1 w-44 max-h-72 overflow-y-auto bg-[#0a0a0a] border border-[#222] rounded-lg shadow-xl z-50 flex flex-col py-1">
            {EDITOR_THEMES.map((editorTheme) => (
              <button
                key={editorTheme.id}
                type="button"
                onClick={() => {
                  setThemeId(editorTheme.id);
                  setIsThemeOpen(false);
                }}
                className={`flex items-center gap-2 px-3 py-2 text-xs text-left transition-colors hover:bg-[#1a1a1a] ${
                  themeId === editorTheme.id ? "text-white bg-[#111]" : "text-[#8b8b8b]"
                }`}
              >
                <div
                  className="w-4 h-4 rounded-full border border-[#333] shrink-0"
                  style={{ background: editorTheme.canvasBackground }}
                />
                <span className="truncate">{t.themes[editorTheme.id]}</span>
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
            {t.paddings[activePadding.id]}
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
                {t.paddings[preset.id]}
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
        scale={exportScale}
        compact
        onExportSuccess={onExportSuccess}
      />
    </div>
  );
}