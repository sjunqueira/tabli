"use client";

import { useEffect, useRef, useState } from "react";
import { CaptureFrame } from "./components/capture-frame";
import { CodeToolbar } from "./components/code-toolbar";
import { useCodeEditorState } from "./hooks/use-code-editor-state";
import { BACKGROUND_PRESETS, DEFAULT_CODE } from "./lib/constants";
import type { ExportFormat, Mode, PaddingPreset, TableData } from "./lib/types";
import { BottomBar } from "./components/bottom-bar";
import { Header } from "./components/header";
import { TableToolbar } from "./components/table-toolbar";
import { useCardOverflow } from "./hooks/use-card-overflow";
import { PADDING_PRESETS } from "./lib/constants";


export default function Home() {
  const [mode, setMode] = useState<Mode>("code");
  const [isReady, setIsReady] = useState(false);

  
  const [padding, setPadding] = useState<PaddingPreset>("default");
  const paddingValue = PADDING_PRESETS.find((p) => p.id === padding)?.value ?? 48;

  const [showLineNumbers, setShowLineNumbers] = useState(false);

  const [code, setCode] = useState(DEFAULT_CODE);
  const [language, setLanguage] = useState("typescript");
  const [theme, setTheme] = useState("github-dark");
  const [fileName, setFileName] = useState("heroes.ts");
  const [showWindowControls, setShowWindowControls] = useState(true);

  const [fontSize, setFontSize] = useState(14);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("png");
  const [watermark, setWatermark] = useState(false);

  const codeEditor = useCodeEditorState(code, setCode);

  const [table, setTable] = useState<TableData>({
    headers: ["Codename", "Identity", "Equipment", "Financial Status"],
    rows: [
      ["Captain America", "Steve Rogers", "Vibranium Shield", "🧊 Frozen (since 1945)"],
      ["Spider-Man", "Peter Parker", "Web Shooters", "🪙 Broke (Again)"],
      ["Iron Man", "Tony Stark", "Mark LXXXV Armor", "💳 Unlimited (Black Card)"],
      ["Thor", "Thor Odinson", "Mjolnir", "🍺 Tab open at the tavern"],
    ],
  });
  

  const tableOverflow = useCardOverflow<HTMLDivElement>();
  const [background, setBackground] = useState(BACKGROUND_PRESETS[1].value);

  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mode === "table") setIsReady(true);
  }, [mode]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#050505] text-[#f3f4f6]">

      <main
        className="flex-1 flex items-center justify-center relative"
        style={{
          backgroundColor: "#0a0a0a",
          backgroundImage: "radial-gradient(#222 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      >
        <div
          className={`w-full h-full flex flex-col items-center justify-center gap-4 transition-all duration-500 ease-out ${
            isReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
        >
          <div className="absolute top-0 left-0 w-full z-10">
            <Header
              fontSize={fontSize}
              onFontSizeChange={setFontSize}
              exportFormat={exportFormat}
              onExportFormatChange={setExportFormat}
              watermark={watermark}
              onWatermarkChange={setWatermark}
            />
          </div>

          <CaptureFrame
            ref={frameRef}
            tableScrollRef={tableOverflow.ref}
            mode={mode}
            background={background}
            padding={paddingValue}
            showLineNumbers={showLineNumbers}
            code={code}
            onCodeChange={setCode}
            language={language}
            theme={theme}
            fileName={fileName}
            onFileNameChange={setFileName}
            showWindowControls={showWindowControls}
            table={table}
            codeWidth={codeEditor.customWidth}
            fontSize={fontSize}
            watermark={watermark}
            codeCardRef={codeEditor.cardRef}
            codeTextareaRef={codeEditor.textareaRef}
            onCodeKeyDown={codeEditor.handleKeyDown}
            onCodeResizeStart={codeEditor.handleResizeStart}
            onCodeReady={() => setIsReady(true)}
            setTable={setTable}
          />

          {mode === "code" && (
            <CodeToolbar
              isCustomWidth={codeEditor.customWidth !== "auto"}
              onResetWidth={codeEditor.resetWidth}
              onFormat={codeEditor.formatCode}
              isOverflowing={codeEditor.isOverflowing}
              isOverflowingHeight={codeEditor.isOverflowingHeight}
            />
          )}

          {mode === "table" && (
            <TableToolbar
              isOverflowingWidth={tableOverflow.isOverflowingWidth}
              isOverflowingHeight={tableOverflow.isOverflowingHeight}
              onImport={setTable}
            />
          )}

          <BottomBar
            mode={mode}
            setMode={setMode}
            language={language}
            setLanguage={setLanguage}
            theme={theme}
            setTheme={setTheme}
            padding={padding}
            setPadding={setPadding}
            showLineNumbers={showLineNumbers}
            setShowLineNumbers={setShowLineNumbers}
            showWindowControls={showWindowControls}
            setShowWindowControls={setShowWindowControls}
            background={background}
            setBackground={setBackground}
            targetRef={frameRef}
            fileName={fileName}
            exportFormat={exportFormat}
          />
        </div>
      </main>
    </div>
  );
}