"use client";

interface ResizeIndicatorProps {
  width: number;
}

// réguazinha estilo ray.so: aparece só durante o arraste, no lugar da
// toolbar normal, mostrando a largura atual em px
export function ResizeIndicator({ width }: ResizeIndicatorProps) {
  return (
    <div className="relative flex items-center h-6" style={{ width: `${width}px` }}>
      <span className="absolute left-0 w-1.5 h-1.5 rounded-full bg-[#555]" />
      <div className="w-full h-px bg-[#333]" />
      <span className="absolute right-0 w-1.5 h-1.5 rounded-full bg-[#555]" />
      <span className="absolute left-1/2 -translate-x-1/2 bg-[#0a0a0a] border border-[#222] rounded-md px-2 py-0.5 text-[10px] text-[#8b8b8b] font-mono whitespace-nowrap">
        {width} px
      </span>
    </div>
  );
}
