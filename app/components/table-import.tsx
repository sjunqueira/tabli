"use client";

import { useState } from "react";
import type { TableData } from "../lib/types";
import { parseImportedTable } from "../lib/table-utils";

interface TableImportProps {
  onImport: (table: TableData) => void;
}

export function TableImport({ onImport }: TableImportProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [raw, setRaw] = useState("");

  const handleImport = () => {
    if (!raw.trim()) return;
    onImport(parseImportedTable(raw));
    setRaw("");
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="text-[10px] text-[#555] hover:text-[#8b8b8b] transition-colors uppercase tracking-widest font-bold"
      >
        Importar via CSV/Markdown
      </button>
    );
  }

  return (
    <div className="w-full max-w-[540px] animate-in fade-in zoom-in-95 duration-200">
      <div className="relative rounded-xl bg-[#0c0c0c] border border-[#2a2a2a] shadow-2xl focus-within:border-[#555] transition-colors">
        
        <textarea
          autoFocus
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          placeholder="Cole seu CSV ou Markdown aqui..."
          rows={4}
          spellCheck={false}
          className="w-full p-4 pb-14 text-sm font-mono bg-transparent text-[#e5e7eb] placeholder:text-[#555] focus:outline-none resize-none selection:bg-white/20"
        />

        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
          <button
            onClick={() => {
              setIsOpen(false);
              setRaw("");
            }}
            className="text-xs font-medium text-[#666] hover:text-white px-2 py-1 rounded transition-colors"
          >
            Cancelar
          </button>

          <button
            onClick={handleImport}
            disabled={!raw.trim()}
            className="flex items-center gap-1.5 bg-[#ededed] text-[#0a0a0a] px-3 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider hover:bg-white disabled:opacity-10 disabled:cursor-not-allowed transition-all"
          >
            Importar
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              className="w-3.5 h-3.5" 
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}