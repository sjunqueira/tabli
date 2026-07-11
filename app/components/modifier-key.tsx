"use client";

import { useEffect, useState } from "react";

// alterna entre o símbolo de comando e "Ctrl" pra quem não reconhece o
// símbolo — em vez de detectar o SO (nem sempre confiável), mostra os dois
export function ModifierKey({ className = "" }: { className?: string }) {
  const [showCtrl, setShowCtrl] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setShowCtrl((v) => !v), 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className={`relative inline-grid w-6 place-items-center overflow-hidden align-middle ${className}`}>
      <span
        className={`col-start-1 row-start-1 transition-all duration-500 ${
          showCtrl ? "opacity-0 -translate-y-1" : "opacity-100 translate-y-0"
        }`}
      >
        ⌘
      </span>
      <span
        className={`col-start-1 row-start-1 transition-all duration-500 ${
          showCtrl ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
        }`}
      >
        Ctrl
      </span>
    </span>
  );
}
