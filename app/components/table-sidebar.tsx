"use client";

import { useState } from "react";
import { TableData, TableFormat } from "../lib/types";
import { tableToMarkdown, markdownToTable, tableToCsv, csvToTable } from "../lib/table-utils";

interface TableSidebarProps {
  table: TableData;
  setTable: (t: TableData) => void;
}

const FORMATS: { id: TableFormat; label: string }[] = [
  { id: "cells", label: "Células" },
  { id: "markdown", label: "Markdown" },
  { id: "csv", label: "CSV" },
];

export function TableSidebar({ table, setTable }: TableSidebarProps) {
  const [format, setFormat] = useState<TableFormat>("cells");

  return (
    <aside className="w-96 flex-shrink-0 border-r border-[#222] bg-[#111] flex flex-col h-full">
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

      <div className="p-6 flex-1 overflow-y-auto">
        {format === "cells" && <CellsEditor table={table} setTable={setTable} />}

        {format === "markdown" && (
          <textarea
            className="w-full h-full min-h-[300px] rounded-lg p-4 text-sm font-mono bg-[#0a0a0a] border border-[#222] focus:outline-none focus:border-[var(--accent-purple)]"
            value={tableToMarkdown(table)}
            onChange={(e) => setTable(markdownToTable(e.target.value))}
            spellCheck={false}
          />
        )}

        {format === "csv" && (
          <textarea
            className="w-full h-full min-h-[300px] rounded-lg p-4 text-sm font-mono bg-[#0a0a0a] border border-[#222] focus:outline-none focus:border-[var(--accent-purple)]"
            value={tableToCsv(table)}
            onChange={(e) => setTable(csvToTable(e.target.value))}
            spellCheck={false}
          />
        )}
      </div>
    </aside>
  );
}

function CellsEditor({ table, setTable }: TableSidebarProps) {
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

  const removeColumn = (i: number) =>
    setTable({
      headers: table.headers.filter((_, idx) => idx !== i),
      rows: table.rows.map((r) => r.filter((_, idx) => idx !== i)),
    });

  const removeRow = (i: number) =>
    setTable({ ...table, rows: table.rows.filter((_, idx) => idx !== i) });

  return (
    <div className="flex flex-col gap-2">
      <div className="overflow-x-auto">
        <table className="cell-grid">
          <thead>
            <tr>
              {table.headers.map((h, i) => (
                <th key={i}>
                  <input value={h} onChange={(e) => updateHeader(i, e.target.value)} />
                  <button onClick={() => removeColumn(i)} title="Remover coluna">×</button>
                </th>
              ))}
              <th className="add-col">
                <button onClick={addColumn} title="Adicionar coluna">+</button>
              </th>
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td key={ci}>
                    <input value={cell} onChange={(e) => updateCell(ri, ci, e.target.value)} />
                  </td>
                ))}
                <td className="remove-row">
                  <button onClick={() => removeRow(ri)} title="Remover linha">×</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        onClick={addRow}
        className="text-xs text-[#8b8b8b] border border-dashed border-[#333] rounded-lg py-2 hover:text-white hover:border-white transition-colors"
      >
        + linha
      </button>
    </div>
  );
}