"use client";

import type { TableData } from "../lib/types";
import { TableImport } from "./table-import";
import { useTranslations } from "../lib/i18n";

interface TableToolbarProps {
  isOverflowingWidth: boolean;
  isOverflowingWidthHard: boolean;
  isOverflowingHeight: boolean;
  onImport: (table: TableData) => void;
  onResetColumnWidths: () => void;
  canRemoveColumn: boolean;
  canRemoveRow: boolean;
  onRemoveLastColumn: () => void;
  onRemoveLastRow: () => void;
}

export function TableToolbar({
  isOverflowingWidth,
  isOverflowingWidthHard,
  isOverflowingHeight,
  onImport,
  onResetColumnWidths,
  canRemoveColumn,
  canRemoveRow,
  onRemoveLastColumn,
  onRemoveLastRow,
}: TableToolbarProps) {
  const { t } = useTranslations();
  return (
    <div className="flex flex-col w-full max-w-full min-w-[560px] items-center gap-2">
      <div className="flex flex-col w-[560px] items-center gap-4">
        <button
          onClick={onResetColumnWidths}
          className="text-[10px] text-[#555] hover:text-[#8b8b8b] transition-colors uppercase tracking-widest font-bold"
        >
          {t.tableToolbar.resetColumnWidths}
        </button>
        <TableImport onImport={onImport} />
      </div>

      {isOverflowingWidthHard ? (
        <div className="flex items-center gap-2 text-[10px] text-red-400/90 bg-red-500/5 px-3 py-1.5 rounded-md border border-red-500/10">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {t.tableToolbar.overflowWidth}
          {canRemoveColumn && (
            <button
              onClick={onRemoveLastColumn}
              className="shrink-0 underline decoration-dotted underline-offset-2 hover:text-red-300 transition-colors"
            >
              {t.tableToolbar.removeLastColumn}
            </button>
          )}
        </div>
      ) : (
        isOverflowingWidth && (
          <div className="flex items-center gap-2 text-[10px] text-[#8b8b8b] bg-white/[0.03] px-3 py-1.5 rounded-md border border-white/[0.06]">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
            {t.tableToolbar.overflowWidthSoft}
          </div>
        )
      )}

      {isOverflowingHeight && (
        <div className="flex items-center gap-2 text-[10px] text-yellow-600/80 bg-yellow-500/5 px-3 py-1.5 rounded-md border border-yellow-500/10">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {t.tableToolbar.overflowHeight}
          {canRemoveRow && (
            <button
              onClick={onRemoveLastRow}
              className="shrink-0 underline decoration-dotted underline-offset-2 hover:text-yellow-400 transition-colors"
            >
              {t.tableToolbar.removeLastRow}
            </button>
          )}
        </div>
      )}
    </div>
  );
}