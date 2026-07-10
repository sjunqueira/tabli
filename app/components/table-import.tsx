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
    <div className="flex flex-col items-center gap-2 w-full max-w-[480px]">
      <textarea
        autoFocus
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        placeholder={"Cole um CSV ou uma tabela Markdown...\n\nname,age\nAna,30"}
        rows={5}
        spellCheck={false}
        className="w-full rounded-lg p-3 text-xs font-mono bg-[#0a0a0a] border border-[#222] focus:outline-none focus:border-white/40 resize-none"
      />
      <div className="flex gap-2">
        <button
          onClick={handleImport}
          className="text-[10px] font-bold uppercase tracking-widest bg-white text-black px-3 py-1.5 rounded-md hover:bg-gray-200 transition-colors"
        >
          Importar
        </button>
        <button
          onClick={() => {
            setIsOpen(false);
            setRaw("");
          }}
          className="text-[10px] font-bold uppercase tracking-widest text-[#555] hover:text-white px-3 py-1.5 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}