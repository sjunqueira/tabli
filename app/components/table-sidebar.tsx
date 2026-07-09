"use client";

import { useState, useEffect } from "react";
import { TableData, TableFormat } from "../lib/types";
import { tableToMarkdown, markdownToTable, tableToCsv, csvToTable } from "../lib/table-utils";

interface TableSidebarProps {
  table: TableData;
  setTable: (t: TableData) => void;
  isOpen: boolean; 
}

const FORMATS: { id: TableFormat; label: string }[] = [
  { id: "cells", label: "Células" },
  { id: "markdown", label: "Markdown" },
  { id: "csv", label: "CSV" },
];

export function TableSidebar({ table, setTable, isOpen }: TableSidebarProps) {
  const [format, setFormat] = useState<TableFormat>("cells");
  
  const [width, setWidth] = useState(384);
  const [isResizing, setIsResizing] = useState(false);
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = Math.max(300, Math.min(e.clientX, 800));
      setWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = "default";
    };

    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  // Função de cópia atualizada com feedback visual
  const handleCopy = (text: string, formatId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(formatId);
    
    // Reseta o botão após 2 segundos
    setTimeout(() => {
      setCopiedFormat(null);
    }, 2000);
  };

return (
    <aside 
      className={`flex-shrink-0 border-r border-[#222] bg-[#111] flex flex-col h-full relative transition-all duration-300 ease-in-out ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      style={{ 
        width: `${width}px`,
        marginLeft: isOpen ? "0px" : `-${width}px` 
      }}
    >
      <div className="p-6 border-b border-[#222]">
        <div className="grid grid-cols-3 gap-1 bg-black/40 p-1 rounded-lg">
          {FORMATS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFormat(f.id)}
              className={`text-xs font-bold py-2 rounded-md transition-colors ${
                format === f.id ? "bg-white text-black" : "text-[#8b8b8b] hover:text-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto flex flex-col">
        {format === "cells" && <CellsEditor table={table} setTable={setTable} />}

        {format === "markdown" && (
          <div className="flex flex-col h-full gap-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-bold text-[#555] uppercase tracking-wider">Markdown Editor</span>
              <button 
                onClick={() => handleCopy(tableToMarkdown(table), "markdown")}
                className={`text-[10px] font-medium transition-colors flex items-center gap-1.5 ${
                  copiedFormat === "markdown" ? "text-green-500" : "text-[#8b8b8b] hover:text-white"
                }`}
              >
                {copiedFormat === "markdown" ? (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Copiado!
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copiar
                  </>
                )}
              </button>
            </div>
            <textarea
              className="w-full flex-1 rounded-lg p-4 text-xs font-mono leading-relaxed bg-[#0a0a0a] text-[#a1a1aa] border border-[#222] focus:outline-none focus:border-[#444] custom-scrollbar resize-none transition-colors"
              value={tableToMarkdown(table)}
              onChange={(e) => setTable(markdownToTable(e.target.value))}
              spellCheck={false}
            />
          </div>
        )}

        {format === "csv" && (
          <div className="flex flex-col h-full gap-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-bold text-[#555] uppercase tracking-wider">CSV Data</span>
              <button 
                onClick={() => handleCopy(tableToCsv(table), "csv")}
                className={`text-[10px] font-medium transition-colors flex items-center gap-1.5 ${
                  copiedFormat === "csv" ? "text-green-500" : "text-[#8b8b8b] hover:text-white"
                }`}
              >
                {copiedFormat === "csv" ? (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Copiado!
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copiar
                  </>
                )}
              </button>
            </div>
            <textarea
              className="w-full flex-1 rounded-lg p-4 text-xs font-mono leading-relaxed bg-[#0a0a0a] text-[#a1a1aa] border border-[#222] focus:outline-none focus:border-[#444] custom-scrollbar resize-none transition-colors"
              value={tableToCsv(table)}
              onChange={(e) => setTable(csvToTable(e.target.value))}
              spellCheck={false}
            />
          </div>
        )}
      </div>

      <div
        onMouseDown={(e) => {
          e.preventDefault();
          setIsResizing(true);
        }}
        className={`absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize z-50 transition-colors ${
          isResizing ? "bg-[#444]" : "bg-transparent hover:bg-[#333]"
        }`}
        style={{ transform: "translateX(50%)" }}
      />
    </aside>
  );
}

function CellsEditor({ table, setTable }: Omit<TableSidebarProps, 'isOpen'>) {
  const [showColumnWarning, setShowColumnWarning] = useState(false);

  const updateHeader = (i: number, value: string) => {
    const headers = [...table.headers];
    headers[i] = value;
    setTable({ ...table, headers });
  };

  const updateCell = (row: number, col: number, value: string) => {
    const rows = table.rows.map((r) => [...r]);
    rows[row][col] = value;
    setTable({ ...table, rows });
  };

  const addColumn = () => {
    if (table.headers.length >= 5) {
      setShowColumnWarning(true);
    }
    setTable({
      headers: [...table.headers, `col_${table.headers.length + 1}`],
      rows: table.rows.map((r) => [...r, ""]),
    });
  };

  const addRow = () =>
    setTable({ ...table, rows: [...table.rows, table.headers.map(() => "")] });

  const removeColumn = (i: number) => {
    if (table.headers.length <= 1) return;
    if (table.headers.length <= 6) {
      setShowColumnWarning(false);
    }
    setTable({
      headers: table.headers.filter((_, idx) => idx !== i),
      rows: table.rows.map((r) => r.filter((_, idx) => idx !== i)),
    });
  };

  const removeRow = (i: number) => {
    if (table.rows.length <= 1) return;
    setTable({ ...table, rows: table.rows.filter((_, idx) => idx !== i) });
  };

  const clearTable = () => {
    setTable({
      headers: ["col_1", "col_2", "col_3"],
      rows: [["", "", ""]],
    });
    setShowColumnWarning(false);
  };

  const fillDummyData = () => {
    setTable({
      headers: ["Codename", "Identity", "Equipment", "Status"],
      rows: [
        ["Spider-Man", "Peter Parker", "Web Shooters", "Broke"],
        ["Iron Man", "Tony Stark", "Mark LXXXV", "Rich"],
        ["Thor", "Thor Odinson", "Mjolnir", "Drinking"],
      ],
    });
    setShowColumnWarning(false);
  };

  return (
    <div className="flex flex-col gap-2 h-full">
      <div className="overflow-x-auto pb-4 custom-scrollbar">
        <table className="cell-grid w-max border-collapse">
          <thead>
            <tr>
              {table.headers.map((h, i) => (
                <th key={i} className="min-w-[120px] pr-2 align-middle group">
                  {/* Novo Layout do Header: Flexbox em vez de Absolute */}
                  <div className="flex items-center gap-1 border-b border-transparent focus-within:border-[#444] transition-colors">
                    <input 
                      value={h} 
                      onChange={(e) => updateHeader(i, e.target.value)} 
                      className="w-full bg-transparent outline-none py-1.5 font-bold text-white placeholder-[#444]"
                      placeholder={`Col ${i + 1}`}
                    />
                    <button 
                      onClick={() => removeColumn(i)} 
                      title="Remover coluna"
                      className="p-1 text-[#444] opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-500/10 rounded transition-all shrink-0"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </th>
              ))}
              <th className="add-col min-w-[40px] text-center align-middle pl-2">
                <button 
                  onClick={addColumn} 
                  title="Adicionar coluna" 
                  className="p-1 text-[#444] hover:text-white hover:bg-[#222] rounded transition-colors flex items-center justify-center w-full"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, ri) => (
              <tr key={ri} className="group">
                {row.map((cell, ci) => (
                  <td key={ci} className="min-w-[120px] pr-2 align-top">
                    <input 
                      value={cell} 
                      onChange={(e) => updateCell(ri, ci, e.target.value)} 
                      className="w-full bg-transparent outline-none py-1.5 border-b border-transparent focus:border-[#222] text-[#8b8b8b] focus:text-white transition-colors"
                      placeholder="..."
                    />
                  </td>
                ))}
                <td className="remove-row min-w-[40px] text-center align-middle">
                  <button 
                    onClick={() => removeRow(ri)} 
                    title="Remover linha"
                    className="p-1 text-[#444] opacity-30 group-hover:opacity-100 hover:text-red-500 transition-all rounded mx-auto"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showColumnWarning && (
        <div className="mt-1 flex items-start gap-2 bg-[#1a1a1a] border border-yellow-900/50 rounded-lg p-3 shrink-0">
          <span className="text-xs font-medium text-yellow-500/90 leading-relaxed">
            ⚠️ Recomendação: Muitas colunas podem deixar o visual do seu snippet achatado ou ilegível.
          </span>
          <button 
            onClick={() => setShowColumnWarning(false)}
            className="text-[#8b8b8b] hover:text-white shrink-0 mt-0.5"
            title="Dispensar aviso"
          >
            ×
          </button>
        </div>
      )}

      <button
        onClick={addRow}
        className="mt-2 text-xs text-[#8b8b8b] border border-dashed border-[#333] rounded-lg py-2 hover:text-white hover:border-white transition-colors shrink-0"
      >
        + linha
      </button>

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#222]">
        <button
          onClick={fillDummyData}
          className="text-[10px] uppercase tracking-wider font-bold text-[#444] hover:text-white transition-colors px-2 py-1 rounded"
        >
          Dados de Teste
        </button>
        <button
          onClick={clearTable}
          className="text-[10px] uppercase tracking-wider font-bold text-[#444] hover:text-red-500 transition-colors px-2 py-1 rounded"
        >
          Limpar Tudo
        </button>
      </div>
    </div>
  );
}