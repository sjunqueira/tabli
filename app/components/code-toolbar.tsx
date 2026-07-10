"use client";

interface CodeToolbarProps {
  isCustomWidth: boolean;
  onResetWidth: () => void;
  onFormat: () => void;
  isOverflowing: boolean;
  isOverflowingHeight: boolean;
}

export function CodeToolbar({
  isCustomWidth,
  onResetWidth,
  onFormat,
  isOverflowing,
  isOverflowingHeight,
}: CodeToolbarProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-4">
        {isCustomWidth && (
          <button
            onClick={onResetWidth}
            className="text-[10px] text-[#555] hover:text-[#8b8b8b] transition-colors uppercase tracking-widest font-bold"
          >
            ← Auto-adjustment
          </button>
        )}
        <button
          onClick={onFormat}
          className="text-[10px] text-[#555] hover:text-[#8b8b8b] transition-colors uppercase tracking-widest font-bold"
        >
          Format Code
        </button>
      </div>

      {isOverflowing && (
        <div className="flex items-center gap-2 text-[10px] text-yellow-600/80 bg-yellow-500/5 px-3 py-1.5 rounded-md border border-yellow-500/10">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Seu código é mais largo que a área da imagem. Recomendamos quebrar em linhas menores.
        </div>
      )}

      {isOverflowingHeight && (
        <div className="flex items-center gap-2 text-[10px] text-yellow-600/80 bg-yellow-500/5 px-3 py-1.5 rounded-md border border-yellow-500/10">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Seu código passou da altura máxima. A imagem exportada será cortada. Recomendamos dividir o código em blocos menores
        </div>
      )}
    </div>
  );
}