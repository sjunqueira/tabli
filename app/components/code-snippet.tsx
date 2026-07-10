"use client";

import type { RefObject } from "react";
import { TableData } from "../lib/types";
import { MAX_CARD_HEIGHT } from "../lib/constants";

interface TableSnippetProps {
  table: TableData;
  setTable: (t: TableData) => void;
  scrollRef: RefObject<HTMLDivElement | null>;
}

export function TableSnippet({ table, setTable, scrollRef }: TableSnippetProps) {
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

  const addColumn = () =>
    setTable({
      headers: [...table.headers, `col_${table.headers.length + 1}`],
      rows: table.rows.map((r) => [...r, ""]),
    });

  const addRow = () =>
    setTable({ ...table, rows: [...table.rows, table.headers.map(() => "")] });

  const removeColumn = (i: number) => {
    if (table.headers.length <= 1) return;
    setTable({
      headers: table.headers.filter((_, idx) => idx !== i),
      rows: table.rows.map((r) => r.filter((_, idx) => idx !== i)),
    });
  };

  const removeRow = (i: number) => {
    if (table.rows.length <= 1) return;
    setTable({ ...table, rows: table.rows.filter((_, idx) => idx !== i) });
  };

  return (
    <div className="group/card relative min-w-[420px] max-w-[900px] bg-[#0a0a0a] rounded-xl border border-[#222] shadow-2xl overflow-hidden flex flex-col">
      <div ref={scrollRef} className="overflow-auto" style={{ maxHeight: `${MAX_CARD_HEIGHT}px` }}>
        <table className="snippet-table">
          <thead>
            <tr>
              {table.headers.map((h, i) => (
                <th key={i} className="group/col relative">
                  <input
                    value={h}
                    onChange={(e) => updateHeader(i, e.target.value)}
                    spellCheck={false}
                  />
                  {table.headers.length > 1 && (
                    <button
                      onClick={() => removeColumn(i)}
                      data-ignore-in-export
                      title="Remover coluna"
                      className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center text-[10px] text-[#555] opacity-0 group-hover/col:opacity-100 hover:text-red-400 transition-opacity"
                    >
                      ×
                    </button>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, ri) => (
              <tr key={ri} className="group/row">
                {row.map((cell, ci) => (
                  <td key={ci} className="relative">
                    <input
                      value={cell}
                      onChange={(e) => updateCell(ri, ci, e.target.value)}
                      spellCheck={false}
                    />
                    {ci === row.length - 1 && table.rows.length > 1 && (
                      <button
                        onClick={() => removeRow(ri)}
                        data-ignore-in-export
                        title="Remover linha"
                        className="absolute top-1/2 -translate-y-1/2 -right-6 w-5 h-5 flex items-center justify-center text-[10px] text-[#555] opacity-0 group-hover/row:opacity-100 hover:text-red-400 transition-opacity"
                      >
                        ×
                      </button>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* botões flutuantes, fora do fluxo do grid — igual o resize handle do CodeCard */}
      <button
        onClick={addColumn}
        data-ignore-in-export
        title="Adicionar coluna"
        className="absolute top-1/2 -translate-y-1/2 -right-8 w-6 h-6 rounded-md border border-[#222] bg-[#111] text-[#555] text-xs flex items-center justify-center opacity-0 group-hover/card:opacity-100 hover:text-white hover:border-white transition-opacity"
      >
        +
      </button>
      <button
        onClick={addRow}
        data-ignore-in-export
        title="Adicionar linha"
        className="absolute left-1/2 -translate-x-1/2 -bottom-8 w-6 h-6 rounded-md border border-[#222] bg-[#111] text-[#555] text-xs flex items-center justify-center opacity-0 group-hover/card:opacity-100 hover:text-white hover:border-white transition-opacity"
      >
        +
      </button>
    </div>
  );
}