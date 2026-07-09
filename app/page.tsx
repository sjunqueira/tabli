"use client";

import { useRef, useState } from "react";
import { TableSidebar } from "./components/table-sidebar";
import { CaptureFrame } from "./components/capture-frame";
import { BACKGROUND_PRESETS, DEFAULT_CODE } from "./lib/constants";
import type { Mode, TableData } from "./lib/types";
import { BottomBar } from "./components/bottom-bar";
import { Header } from "./components/header";

export default function Home() {
  const [mode, setMode] = useState<Mode>("code");
  const [code, setCode] = useState(DEFAULT_CODE);
  const [language, setLanguage] = useState("typescript");
  const [theme, setTheme] = useState("github-dark");
  const [fileName, setFileName] = useState("heroes.ts");
  const [showWindowControls, setShowWindowControls] = useState(true);

  const [table, setTable] = useState<TableData>({
    headers: ["Codename", "Identity", "Equipment", "Financial Status"],
    rows: [
      ["Captain America", "Steve Rogers", "Vibranium Shield", "🧊 Frozen (since 1945)"],
      ["Spider-Man", "Peter Parker", "Web Shooters", "🪙 Broke (Again)"],
      ["Iron Man", "Tony Stark", "Mark LXXXV Armor", "💳 Unlimited (Black Card)"],
      ["Thor", "Thor Odinson", "Mjolnir", "🍺 Tab open at the tavern"],
    ],
  });

  const [background, setBackground] = useState(BACKGROUND_PRESETS[1].value);
  const [padding, setPadding] = useState(64);

  const frameRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex h-screen overflow-hidden bg-[#050505] text-[#f3f4f6]">
      {/* ⚠️ Mudança aqui: Passamos o isOpen em vez de renderizar condicionalmente */}
      <TableSidebar 
        table={table} 
        setTable={setTable} 
        isOpen={mode === "table"} 
      />

      <main
        className="flex-1 flex items-center justify-center relative"
        style={{
          backgroundColor: "#0a0a0a",
          backgroundImage: "radial-gradient(#222 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      >
        <div className="absolute top-0 left-0 w-full z-10">
          <Header />
        </div>

        <CaptureFrame
          ref={frameRef}
          mode={mode}
          background={background}
          padding={padding}
          code={code}
          onCodeChange={setCode}
          language={language}
          theme={theme}
          fileName={fileName}
          onFileNameChange={setFileName}
          showWindowControls={showWindowControls}
          table={table}
        />

        <BottomBar
          mode={mode}
          setMode={setMode}
          language={language}
          setLanguage={setLanguage}
          theme={theme}
          setTheme={setTheme}
          showWindowControls={showWindowControls}
          setShowWindowControls={setShowWindowControls}
          background={background}
          setBackground={setBackground}
          padding={padding}
          setPadding={setPadding}
          targetRef={frameRef}
          fileName={fileName}
        />
      </main>
    </div>
  );
}