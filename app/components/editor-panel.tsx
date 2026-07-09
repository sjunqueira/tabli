"use client";

import type { RefObject } from "react";
import { ExportControls } from "./export-controls";
import { Mode } from "../lib/types";
import { BACKGROUND_PRESETS, LANGUAGE_OPTIONS, THEME_OPTIONS } from "../lib/constants";

interface EditorPanelProps {
  mode: Mode;
  setMode: (m: Mode) => void;
  code: string;
  setCode: (v: string) => void;
  language: string;
  setLanguage: (v: string) => void;
  theme: string;
  setTheme: (v: string) => void;
  fileName: string;
  setFileName: (v: string) => void;
  showWindowControls: boolean;
  setShowWindowControls: (v: boolean) => void;
  markdown: string;
  setMarkdown: (v: string) => void;
  background: string;
  setBackground: (v: string) => void;
  padding: number;
  setPadding: (v: number) => void;
  targetRef: RefObject<HTMLDivElement>;
}

export function EditorPanel(props: EditorPanelProps) {
  const {
    mode, setMode,
    code, setCode,
    language, setLanguage,
    theme, setTheme,
    fileName, setFileName,
    showWindowControls, setShowWindowControls,
    markdown, setMarkdown,
    background, setBackground,
    padding, setPadding,
    targetRef,
  } = props;

  return (
    <aside className="w-96 flex-shrink-0 border-r border-[#222] bg-[#111] flex flex-col h-full z-10">
      <div className="p-6 border-b border-[#222]">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="3" y1="9" x2="21" y2="9"></line>
            <line x1="9" y1="21" x2="9" y2="9"></line>
          </svg>
          TableRay
        </h1>
        <p className="text-[#8b8b8b] text-xs mt-2">Prints premium de código e tabelas.</p>

        <div className="mt-4 grid grid-cols-2 gap-1 bg-black/40 p-1 rounded-lg">
          <button
            onClick={() => setMode("code")}
            className={`text-xs font-bold py-2 rounded-md transition-colors ${
              mode === "code" ? "bg-white text-black" : "text-[#8b8b8b] hover:text-white"
            }`}
          >
            Código
          </button>
          <button
            onClick={() => setMode("table")}
            className={`text-xs font-bold py-2 rounded-md transition-colors ${
              mode === "table" ? "bg-white text-black" : "text-[#8b8b8b] hover:text-white"
            }`}
          >
            Tabela
          </button>
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-6">
        {mode === "code" ? (
          <>
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-xs uppercase tracking-widest text-[#8b8b8b] font-bold">
                Código
              </label>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                className="w-full flex-1 min-h-[240px] rounded-lg p-4 text-sm font-mono bg-[#0a0a0a] border border-[#222] focus:outline-none focus:border-[var(--accent-purple)] focus:ring-1 focus:ring-[var(--accent-purple)]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-widest text-[#8b8b8b] font-bold">
                  Linguagem
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-[#0a0a0a] border border-[#222] rounded-lg px-3 py-2 text-sm"
                >
                  {LANGUAGE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-widest text-[#8b8b8b] font-bold">
                  Tema
                </label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="bg-[#0a0a0a] border border-[#222] rounded-lg px-3 py-2 text-sm"
                >
                  {THEME_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest text-[#8b8b8b] font-bold">
                Nome do arquivo (opcional)
              </label>
              <input
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="dag_idempotente.py"
                className="bg-[#0a0a0a] border border-[#222] rounded-lg px-3 py-2 text-sm font-mono"
              />
            </div>

            <label className="flex items-center gap-2 text-xs text-[#8b8b8b] cursor-pointer">
              <input
                type="checkbox"
                checked={showWindowControls}
                onChange={(e) => setShowWindowControls(e.target.checked)}
              />
              Mostrar barra de janela
            </label>
          </>
        ) : (
          <div className="flex flex-col gap-2 flex-1">
            <label className="text-xs uppercase tracking-widest text-[#8b8b8b] font-bold">
              Markdown da tabela
            </label>
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              spellCheck={false}
              className="w-full flex-1 min-h-[240px] rounded-lg p-4 text-sm font-mono bg-[#0a0a0a] border border-[#222] focus:outline-none focus:border-[var(--accent-purple)] focus:ring-1 focus:ring-[var(--accent-purple)]"
            />
          </div>
        )}

        <div>
          <label className="text-xs uppercase tracking-widest text-[#8b8b8b] font-bold block mb-3">
            Fundo
          </label>
          <div className="flex flex-wrap gap-3">
            {BACKGROUND_PRESETS.map((preset) => (
              <button
                key={preset.name}
                title={preset.name}
                onClick={() => setBackground(preset.value)}
                className={`w-8 h-8 rounded-full border ${
                  background === preset.value ? "border-white" : "border-[#333]"
                }`}
                style={{
                  background:
                    preset.value === "transparent"
                      ? "repeating-conic-gradient(#333 0% 25%, #1a1a1a 0% 50%) 50% / 10px 10px"
                      : preset.value,
                }}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs uppercase tracking-widest text-[#8b8b8b] font-bold block mb-3 flex justify-between">
            <span>Espaçamento</span>
            <span>{padding}px</span>
          </label>
          <input
            type="range"
            min={0}
            max={128}
            step={16}
            value={padding}
            onChange={(e) => setPadding(Number(e.target.value))}
            className="w-full accent-white"
          />
        </div>
      </div>

      <ExportControls targetRef={targetRef} fileName={fileName.split(".")[0]} />
    </aside>
  );
}