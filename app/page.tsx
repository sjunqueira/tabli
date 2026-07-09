"use client";

import { useRef, useState } from "react";
import { EditorPanel } from "./components/editor-panel";
import { CaptureFrame } from "./components/capture-frame";
import { BACKGROUND_PRESETS, DEFAULT_CODE, DEFAULT_MARKDOWN_TABLE } from "./lib/constants";
import type { Mode } from "./lib/types";

export default function Home() {
  const [mode, setMode] = useState<Mode>("code");

  const [code, setCode] = useState(DEFAULT_CODE);
  const [language, setLanguage] = useState("typescript");
  const [theme, setTheme] = useState("github-dark");
  const [fileName, setFileName] = useState("idempotency.ts");
  const [showWindowControls, setShowWindowControls] = useState(true);

  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN_TABLE);

  const [background, setBackground] = useState(BACKGROUND_PRESETS[1].value);
  const [padding, setPadding] = useState(64);

  const frameRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex h-screen overflow-hidden bg-[#050505] text-[#f3f4f6]">
      <EditorPanel
        mode={mode}
        setMode={setMode}
        code={code}
        setCode={setCode}
        language={language}
        setLanguage={setLanguage}
        theme={theme}
        setTheme={setTheme}
        fileName={fileName}
        setFileName={setFileName}
        showWindowControls={showWindowControls}
        setShowWindowControls={setShowWindowControls}
        markdown={markdown}
        setMarkdown={setMarkdown}
        background={background}
        setBackground={setBackground}
        padding={padding}
        setPadding={setPadding}
        targetRef={frameRef}
      />

      <main
        className="flex-1 flex items-center justify-center overflow-auto"
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
          language={language}
          theme={theme}
          fileName={fileName}
          showWindowControls={showWindowControls}
          markdown={markdown}
        />
      </main>
    </div>
  );
}