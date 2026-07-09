"use client";

import { useRef, useState } from "react";
import { TableSidebar } from "./components/table-sidebar";
import { CaptureFrame } from "./components/capture-frame";
import { BACKGROUND_PRESETS, DEFAULT_CODE } from "./lib/constants";
import type { Mode, TableData } from "./lib/types";
import { BottomBar } from "./components/bottom-bar";

export default function Home() {
  const [mode, setMode] = useState<Mode>("code");

  const [code, setCode] = useState(DEFAULT_CODE);
  const [language, setLanguage] = useState("typescript");
  const [theme, setTheme] = useState("github-dark");
  const [fileName, setFileName] = useState("idempotency.ts");
  const [showWindowControls, setShowWindowControls] = useState(true);

  const [table, setTable] = useState<TableData>({
    headers: ["user_id", "user_name", "user_email"],
    rows: [
      ["1", "Fulano", "fulano@email.com"],
      ["2", "Beltrano", "beltrano@email.com"],
    ],
  });

  const [background, setBackground] = useState(BACKGROUND_PRESETS[1].value);
  const [padding, setPadding] = useState(64);

  const frameRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex h-screen overflow-hidden bg-[#050505] text-[#f3f4f6]">
      {mode === "table" && <TableSidebar table={table} setTable={setTable} />}

      <main
        className="flex-1 flex items-center justify-center overflow-auto relative"
        style={{
          backgroundColor: "#0a0a0a",
          backgroundImage: "radial-gradient(#222 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      >
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