"use client";

import { useRef, useState, type RefObject } from "react";
import { TableData } from "../lib/types";
import { BACKGROUND_PRESETS, MAX_CARD_HEIGHT, MIN_COLUMN_WIDTH, TABLE_HEADER_ACCENTS } from "../lib/constants";
import { useTranslations } from "../lib/i18n";

interface TableSnippetProps {
  table: TableData;
  setTable: (t: TableData) => void;
  scrollRef: RefObject<HTMLDivElement | null>;
  background: string;
  cardRef: RefObject<HTMLDivElement | null>;
  cardWidth: number | "auto";
  onResizeStart: (direction: 1 | -1) => (e: React.MouseEvent) => void;
}

export function TableSnippet({ table, setTable, scrollRef, background, cardRef, cardWidth, onResizeStart }: TableSnippetProps) {
  const { t } = useTranslations();
  const [resizingCol, setResizingCol] = useState<number | null>(null);
  const tableRef = useRef<HTMLTableElement>(null);

  const backgroundId = BACKGROUND_PRESETS.find((p) => p.value === background)?.id ?? "transparent";
  const headerAccent = TABLE_HEADER_ACCENTS[backgroundId];

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
      columnWidths: table.columnWidths ? [...table.columnWidths, null] : undefined,
    });

  const addRow = () =>
    setTable({ ...table, rows: [...table.rows, table.headers.map(() => "")] });

  const removeColumn = (i: number) => {
    if (table.headers.length <= 1) return;
    setTable({
      headers: table.headers.filter((_, idx) => idx !== i),
      rows: table.rows.map((r) => r.filter((_, idx) => idx !== i)),
      columnWidths: table.columnWidths?.filter((_, idx) => idx !== i),
    });
  };

  const removeRow = (i: number) => {
    if (table.rows.length <= 1) return;
    setTable({ ...table, rows: table.rows.filter((_, idx) => idx !== i) });
  };

  // handler recriado a cada render (não memoizado) — precisa sempre fechar
  // sobre a `table` mais recente, já que redimensionar duas colunas em
  // sequência com um handler "stale" perderia a largura da primeira
  const handleResizeStart = (index: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    const ths = Array.from(tableRef.current?.querySelectorAll("th") ?? []);

    // no primeiro resize a tabela sai de width:100% (auto) pra max-content
    // (intrínseca) — se só travarmos a coluna arrastada, todas as outras
    // "pulam" pro tamanho natural do conteúdo nesse instante. Travando a
    // largura ATUAL de todas de uma vez, a troca de modo fica imperceptível.
    const baseColumnWidths = table.headers.map((_, i) => {
      const existing = table.columnWidths?.[i];
      if (existing != null) return existing;
      return Math.round(ths[i]?.getBoundingClientRect().width ?? MIN_COLUMN_WIDTH);
    });

    const startX = e.clientX;
    const startWidth = baseColumnWidths[index];
    setResizingCol(index);
    setTable({ ...table, columnWidths: baseColumnWidths });

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX;
      const newWidth = Math.max(MIN_COLUMN_WIDTH, Math.round(startWidth + delta));
      const columnWidths = [...baseColumnWidths];
      columnWidths[index] = newWidth;
      setTable({ ...table, columnWidths });
    };

    const handleMouseUp = () => {
      setResizingCol(null);
      document.body.style.cursor = "default";
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    document.body.style.cursor = "col-resize";
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  // .snippet-table força width:100% por padrão (preenche o card mesmo com
  // pouco conteúdo) — mas isso faz colunas redimensionadas manualmente só
  // "roubarem" espaço das outras em vez de crescer de verdade. Uma vez que
  // alguma coluna tem largura manual, a tabela passa a ter largura própria
  // (soma das colunas), podendo estourar o card e disparar o aviso de overflow.
  const hasCustomWidths = table.columnWidths?.some((w) => w != null) ?? false;

  return (
    <div
      ref={cardRef}
      style={{ width: cardWidth === "auto" ? undefined : `${cardWidth}px` }}
      className="group/card relative min-w-[420px] max-w-[1200px] bg-[#0a0a0a] rounded-xl border border-[#222] shadow-2xl flex flex-col"
    >
      <div ref={scrollRef} className="overflow-auto rounded-xl" style={{ maxHeight: `${MAX_CARD_HEIGHT}px` }}>
        <table
          ref={tableRef}
          className="snippet-table"
          style={hasCustomWidths ? { width: "max-content", minWidth: "100%" } : undefined}
        >
          <thead>
            <tr>
              {table.headers.map((h, i) => {
                const width = table.columnWidths?.[i];
                return (
                  <th
                    key={i}
                    className="group/col relative"
                    style={{
                      backgroundColor: headerAccent.bg,
                      color: headerAccent.text,
                      ...(width ? { width: `${width}px`, minWidth: `${width}px`, maxWidth: `${width}px` } : undefined),
                    }}
                  >
                    <input
                      value={h}
                      onChange={(e) => updateHeader(i, e.target.value)}
                      spellCheck={false}
                    />
                    {table.headers.length > 1 && (
                      <button
                        onClick={() => removeColumn(i)}
                        data-ignore-in-export
                        title={t.tableSnippet.removeColumn}
                        className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center text-xs text-[#555] opacity-40 group-hover/col:opacity-100 hover:text-red-400 transition-opacity"
                      >
                        ×
                      </button>
                    )}
                    {i < table.headers.length - 1 && (
                      <div
                        data-ignore-in-export
                        aria-hidden="true"
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-4 bg-current opacity-20 pointer-events-none group-hover/col:opacity-0 transition-opacity"
                      />
                    )}
                    <div
                      onMouseDown={handleResizeStart(i)}
                      data-ignore-in-export
                      title={t.tableSnippet.resizeColumn}
                      className={`absolute right-0 top-0 bottom-0 w-2 cursor-col-resize z-10 transition-colors ${
                        resizingCol === i ? "bg-[#c084fc]/60" : "hover:bg-[#c084fc]/40"
                      }`}
                    />
                  </th>
                );
              })}
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
                        title={t.tableSnippet.removeRow}
                        className="absolute top-1/2 -translate-y-1/2 right-1 w-5 h-5 flex items-center justify-center text-xs text-[#555] opacity-40 group-hover/row:opacity-100 hover:text-red-400 transition-opacity"
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

      <div
        onMouseDown={onResizeStart(-1)}
        data-ignore-in-export
        title={t.tableSnippet.resizeHandle}
        className="group/handle absolute left-0 top-0 bottom-0 w-3 cursor-col-resize z-30 flex items-center justify-start"
      >
        <span className="w-1.5 h-8 rounded-full bg-[#555] opacity-70 group-hover/handle:opacity-100 group-hover/handle:bg-[#c084fc] transition-colors" />
      </div>
      <div
        onMouseDown={onResizeStart(1)}
        data-ignore-in-export
        title={t.tableSnippet.resizeHandle}
        className="group/handle absolute right-0 top-0 bottom-0 w-3 cursor-col-resize z-30 flex items-center justify-end"
      >
        <span className="w-1.5 h-8 rounded-full bg-[#555] opacity-70 group-hover/handle:opacity-100 group-hover/handle:bg-[#c084fc] transition-colors" />
      </div>

      {/* botões flutuantes, fora do fluxo do grid — igual o resize handle do CodeCard */}
      <button
        onClick={addColumn}
        data-ignore-in-export
        title={t.tableSnippet.addColumn}
        className="absolute top-1/2 -translate-y-1/2 -right-8 w-6 h-6 rounded-md border border-[#222] bg-[#111] text-[#555] text-xs flex items-center justify-center opacity-0 group-hover/card:opacity-100 hover:text-white hover:border-white transition-opacity"
      >
        +
      </button>
      <button
        onClick={addRow}
        data-ignore-in-export
        title={t.tableSnippet.addRow}
        className="absolute left-1/2 -translate-x-1/2 -bottom-8 w-6 h-6 rounded-md border border-[#222] bg-[#111] text-[#555] text-xs flex items-center justify-center opacity-0 group-hover/card:opacity-100 hover:text-white hover:border-white transition-opacity"
      >
        +
      </button>
    </div>
  );
}