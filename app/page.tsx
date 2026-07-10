"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CaptureFrame } from "./components/capture-frame";
import { CodeToolbar } from "./components/code-toolbar";
import { ResizeIndicator } from "./components/resize-indicator";
import { useCodeEditorState } from "./hooks/use-code-editor-state";
import { useCardResize } from "./hooks/use-card-resize";
import {
  BACKGROUND_PRESETS,
  CARD_HARD_MAX_WIDTH,
  CARD_MIN_WIDTH,
  DEFAULT_CODE,
  MIN_COLUMN_WIDTH,
  TABLE_CELL_PADDING_X,
} from "./lib/constants";
import type { ExportFormat, ExportScale, Locale, Mode, PaddingPreset, Snapshot, TableData } from "./lib/types";
import { BottomBar } from "./components/bottom-bar";
import { Header } from "./components/header";
import { TableToolbar } from "./components/table-toolbar";
import { useTableOverflow } from "./hooks/use-table-overflow";
import { PADDING_PRESETS } from "./lib/constants";
import { addSnapshotIfChanged, loadContent, loadPreferences, saveContent, savePreferences } from "./lib/storage";
import { LocaleProvider, TRANSLATIONS, detectLocale } from "./lib/i18n";


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
  const [exportScale, setExportScale] = useState<ExportScale>(2);
  const [watermark, setWatermark] = useState(false);
  const [locale, setLocale] = useState<Locale>("pt-BR");
  const t = TRANSLATIONS[locale];

  const codeEditor = useCodeEditorState(code, setCode, language, t.codeToolbar, setLanguage);
  const { pinLanguage } = codeEditor;

  const [table, setTable] = useState<TableData>({
    headers: ["Codename", "Identity", "Equipment", "Financial Status"],
    rows: [
      ["Captain America", "Steve Rogers", "Vibranium Shield", "🧊 Frozen (since 1945)"],
      ["Spider-Man", "Peter Parker", "Web Shooters", "🪙 Broke (Again)"],
      ["Iron Man", "Tony Stark", "Mark LXXXV Armor", "💳 Unlimited (Black Card)"],
      ["Thor", "Thor Odinson", "Mjolnir", "🍺 Tab open at the tavern"],
    ],
  });
  

  const tableOverflow = useTableOverflow(table);
  const tableCardRef = useRef<HTMLDivElement>(null);
  const tableResize = useCardResize(tableCardRef);
  const [background, setBackground] = useState(BACKGROUND_PRESETS[1].value);

  const frameRef = useRef<HTMLDivElement>(null);
  const hasRestoredRef = useRef(false);

  useEffect(() => {
    if (mode === "table") setIsReady(true);
  }, [mode]);

  // restaura preferências e conteúdo do localStorage uma única vez no mount
  useEffect(() => {
    const prefs = loadPreferences();
    if (prefs) {
      if (prefs.theme !== undefined) setTheme(prefs.theme);
      if (prefs.padding !== undefined) setPadding(prefs.padding);
      if (prefs.fontSize !== undefined) setFontSize(prefs.fontSize);
      if (prefs.exportFormat !== undefined) setExportFormat(prefs.exportFormat);
      if (prefs.exportScale !== undefined) setExportScale(prefs.exportScale);
      if (prefs.watermark !== undefined) setWatermark(prefs.watermark);
      if (prefs.showLineNumbers !== undefined) setShowLineNumbers(prefs.showLineNumbers);
      if (prefs.showWindowControls !== undefined) setShowWindowControls(prefs.showWindowControls);
      setLocale(prefs.locale ?? detectLocale());
    } else {
      setLocale(detectLocale());
    }

    const content = loadContent();
    if (content) {
      if (content.code !== undefined) setCode(content.code);
      if (content.table !== undefined) setTable(content.table);
      if (content.fileName !== undefined) setFileName(content.fileName);
      if (content.language !== undefined) {
        pinLanguage();
        setLanguage(content.language);
      }
      if (content.mode !== undefined) setMode(content.mode);
    }

    hasRestoredRef.current = true;
  }, [pinLanguage]);

  // persiste preferências sempre que mudam
  useEffect(() => {
    if (!hasRestoredRef.current) return;
    savePreferences({
      theme,
      padding,
      fontSize,
      exportFormat,
      exportScale,
      watermark,
      showLineNumbers,
      showWindowControls,
      locale,
    });
  }, [theme, padding, fontSize, exportFormat, exportScale, watermark, showLineNumbers, showWindowControls, locale]);

  // persiste conteúdo atual sempre que muda
  useEffect(() => {
    if (!hasRestoredRef.current) return;
    saveContent({ code, table, fileName, language, mode });
  }, [code, table, fileName, language, mode]);

  const takeSnapshot = useCallback(() => {
    addSnapshotIfChanged({
      mode,
      fileName,
      language,
      ...(mode === "code" ? { code } : { table }),
    });
  }, [mode, code, table, fileName, language]);

  const handleModeChange = useCallback(
    (newMode: Mode) => {
      if (newMode !== mode) takeSnapshot();
      setMode(newMode);
    },
    [mode, takeSnapshot],
  );

  const handleRestoreSnapshot = useCallback(
    (snapshot: Snapshot) => {
      setFileName(snapshot.fileName);
      pinLanguage();
      setLanguage(snapshot.language);
      if (snapshot.mode === "code" && snapshot.code !== undefined) setCode(snapshot.code);
      if (snapshot.mode === "table" && snapshot.table !== undefined) setTable(snapshot.table);
      setMode(snapshot.mode);
    },
    [pinLanguage],
  );

  const handleLanguageChange = useCallback(
    (lang: string) => {
      pinLanguage();
      setLanguage(lang);
    },
    [pinLanguage],
  );

  // em vez de só limpar columnWidths (o que joga a tabela de volta pro
  // layout automático do navegador, que divide o espaço igualmente entre
  // colunas e corta as com conteúdo mais longo), calcula uma largura
  // proporcional à necessidade real de cada coluna, medida direto no DOM.
  //
  // dar pra cada coluna sua largura natural não bastava: se a soma passasse
  // do limite do card, a tabela simplesmente ficava mais larga que o card
  // permite (exigindo scroll horizontal ou cortando na exportação) — ou
  // seja, continuava "não cabendo" pro usuário. Por isso, quando a soma
  // excede o limite, encolhe as colunas proporcionalmente ao quanto cada
  // uma passa do mínimo, até caber — só usa o mínimo puro se nem isso couber.
  const autoFitColumnWidths = () => {
    const container = tableOverflow.ref.current;
    if (!container) return;

    // input.scrollWidth nunca é menor que a largura ATUAL do input — se a
    // coluna já está larga, a medição "natural" vem inflada e o auto-ajuste
    // mantém a folga. measureText mede o texto em si, independente do layout
    const measureCtx = document.createElement("canvas").getContext("2d");
    const measureInput = (input: HTMLInputElement) => {
      if (!measureCtx) return input.scrollWidth;
      const cs = window.getComputedStyle(input);
      measureCtx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      const letterSpacing = parseFloat(cs.letterSpacing) || 0;
      return Math.ceil(measureCtx.measureText(input.value).width + letterSpacing * input.value.length);
    };

    const headerInputs = Array.from(container.querySelectorAll("thead th input")) as HTMLInputElement[];
    const naturalContentWidths = headerInputs.map(measureInput);
    container.querySelectorAll("tbody tr").forEach((row) => {
      row.querySelectorAll("td input").forEach((input, i) => {
        naturalContentWidths[i] = Math.max(naturalContentWidths[i] ?? 0, measureInput(input as HTMLInputElement));
      });
    });

    const naturalWidths = naturalContentWidths.map((w) => w + TABLE_CELL_PADDING_X);
    const naturalTotal = naturalWidths.reduce((sum, w) => sum + w, 0);
    const minTotal = naturalWidths.length * MIN_COLUMN_WIDTH;

    let columnWidths: number[];
    if (naturalTotal <= CARD_HARD_MAX_WIDTH) {
      columnWidths = naturalWidths.map((w) => Math.max(MIN_COLUMN_WIDTH, Math.round(w)));
    } else if (minTotal >= CARD_HARD_MAX_WIDTH) {
      columnWidths = naturalWidths.map(() => MIN_COLUMN_WIDTH);
    } else {
      const budget = CARD_HARD_MAX_WIDTH - minTotal;
      const totalExcess = naturalTotal - minTotal;
      const scale = budget / totalExcess;
      columnWidths = naturalWidths.map((w) =>
        Math.round(MIN_COLUMN_WIDTH + Math.max(0, w - MIN_COLUMN_WIDTH) * scale),
      );
    }

    // desfaz também o resize manual do CARD — senão um card alargado na mão
    // continua esticando a tabela (min-width:100%) e a folga permanece
    tableResize.resetWidth();
    setTable((prev) => ({ ...prev, columnWidths }));
  };

  const removeLastColumn = useCallback(() => {
    setTable((prev) => {
      if (prev.headers.length <= 1) return prev;
      return {
        headers: prev.headers.slice(0, -1),
        rows: prev.rows.map((r) => r.slice(0, -1)),
        columnWidths: prev.columnWidths?.slice(0, -1),
      };
    });
  }, []);

  const removeLastRow = useCallback(() => {
    setTable((prev) => (prev.rows.length <= 1 ? prev : { ...prev, rows: prev.rows.slice(0, -1) }));
  }, []);

  // snapshot automático ao fechar/recarregar a aba
  useEffect(() => {
    const handleBeforeUnload = () => takeSnapshot();
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [takeSnapshot]);

  return (
    <LocaleProvider locale={locale} setLocale={setLocale}>
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
              exportScale={exportScale}
              onExportScaleChange={setExportScale}
              watermark={watermark}
              onWatermarkChange={setWatermark}
              onRestoreSnapshot={handleRestoreSnapshot}
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
            tableCardRef={tableCardRef}
            tableWidth={tableResize.customWidth}
            onCodeKeyDown={codeEditor.handleKeyDown}
            onCodePaste={codeEditor.handlePaste}
            onCodeResizeStart={codeEditor.handleResizeStart}
            onTableResizeStart={tableResize.handleResizeStart}
            onCodeReady={() => setIsReady(true)}
            setTable={setTable}
          />

          {mode === "code" &&
            (codeEditor.isResizing ? (
              <ResizeIndicator
                width={typeof codeEditor.customWidth === "number" ? codeEditor.customWidth : CARD_MIN_WIDTH}
              />
            ) : (
              <CodeToolbar
                isCustomWidth={codeEditor.customWidth !== "auto"}
                onResetWidth={codeEditor.resetWidth}
                onFormat={codeEditor.formatCode}
                isOverflowingWidth={codeEditor.isOverflowingWidth}
                isOverflowingWidthHard={codeEditor.isOverflowingWidthHard}
                isOverflowingHeight={codeEditor.isOverflowingHeight}
                formatFeedback={codeEditor.formatFeedback}
              />
            ))}

          {mode === "table" &&
            (tableResize.isResizing ? (
              <ResizeIndicator
                width={typeof tableResize.customWidth === "number" ? tableResize.customWidth : CARD_MIN_WIDTH}
              />
            ) : (
              <TableToolbar
                isOverflowingWidth={tableOverflow.isOverflowingWidth}
                isOverflowingWidthHard={tableOverflow.isOverflowingWidthHard}
                isOverflowingHeight={tableOverflow.isOverflowingHeight}
                onImport={setTable}
                onResetColumnWidths={autoFitColumnWidths}
                canRemoveColumn={table.headers.length > 1}
                canRemoveRow={table.rows.length > 1}
                onRemoveLastColumn={removeLastColumn}
                onRemoveLastRow={removeLastRow}
              />
            ))}

          <BottomBar
            mode={mode}
            setMode={handleModeChange}
            language={language}
            setLanguage={handleLanguageChange}
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
            exportScale={exportScale}
            onExportSuccess={takeSnapshot}
          />
        </div>
      </main>
    </div>
    </LocaleProvider>
  );
}