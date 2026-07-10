"use client";

import type { TableData } from "../lib/types";
import { TableImport } from "./table-import";

interface TableToolbarProps {
  isOverflowingWidth: boolean;
  isOverflowingHeight: boolean;
  onImport: (table: TableData) => void;
}

export function TableToolbar({ isOverflowingWidth, isOverflowingHeight, onImport }: TableToolbarProps) {
  return (
    <div className="flex flex-col w-full max-w-full min-w-[560px] items-center gap-2">
      <TableImport onImport={onImport}/>

      {isOverflowingWidth && (
        <div className="flex items-center gap-2 text-[10px] text-yellow-600/80 bg-yellow-500/5 px-3 py-1.5 rounded-md border border-yellow-500/10">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Sua tabela é mais larga que a área da imagem. Reduza colunas ou textos longos.
        </div>
      )}

      {isOverflowingHeight && (
        <div className="flex items-center gap-2 text-[10px] text-yellow-600/80 bg-yellow-500/5 px-3 py-1.5 rounded-md border border-yellow-500/10">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Sua tabela passou da altura máxima. A imagem exportada será cortada.
        </div>
      )}
    </div>
  );
}