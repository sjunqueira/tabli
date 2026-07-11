"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ExportFormat, ExportScale, Snapshot } from "../lib/types";
import { EXPORT_SCALES, FONT_SIZES } from "../lib/constants";
import { loadHistory } from "../lib/storage";
import { useTranslations, type TranslationStrings } from "../lib/i18n";
import { useDismiss } from "../hooks/use-dismiss";
import { isEditableTarget } from "../lib/dom";
import { ModifierKey } from "./modifier-key";
import Link from "next/link";

interface HeaderProps {
  fontSize: number;
  onFontSizeChange: (v: number) => void;
  exportFormat: ExportFormat;
  onExportFormatChange: (v: ExportFormat) => void;
  exportScale: ExportScale;
  onExportScaleChange: (v: ExportScale) => void;
  watermark: boolean;
  onWatermarkChange: (v: boolean) => void;
  onRestoreSnapshot: (snapshot: Snapshot) => void;
}

function formatRelativeTime(timestamp: number, time: TranslationStrings["time"]): string {
  const diffSeconds = Math.round((Date.now() - timestamp) / 1000);
  if (diffSeconds < 5) return time.now;
  if (diffSeconds < 60) return time.secondsAgo(diffSeconds);
  const diffMinutes = Math.round(diffSeconds / 60);
  if (diffMinutes < 60) return time.minutesAgo(diffMinutes);
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return time.hoursAgo(diffHours);
  const diffDays = Math.round(diffHours / 24);
  return time.daysAgo(diffDays);
}

function snapshotPreview(snapshot: Snapshot, emptyLabel: string): string {
  const raw =
    snapshot.mode === "code"
      ? (snapshot.code ?? "").replace(/\s+/g, " ").trim()
      : [snapshot.table?.headers.join(" | "), snapshot.table?.rows[0]?.join(" | ")]
          .filter(Boolean)
          .join(" · ");
  return raw.length > 70 ? `${raw.slice(0, 70)}…` : raw || emptyLabel;
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="min-w-[1.25rem] text-center text-[10px] text-[#d4d4d8] font-mono bg-[#111] px-1.5 py-0.5 rounded-sm border border-[#333]">
      {children}
    </kbd>
  );
}

function ShortcutRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-[#8b8b8b]">{label}</span>
      <div className="flex items-center gap-1 shrink-0">{children}</div>
    </div>
  );
}

export function Header({
  fontSize,
  onFontSizeChange,
  exportFormat,
  onExportFormatChange,
  exportScale,
  onExportScaleChange,
  watermark,
  onWatermarkChange,
  onRestoreSnapshot,
}: HeaderProps) {
  const { t, locale, setLocale } = useTranslations();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [history, setHistory] = useState<Snapshot[]>([]);

  const settingsRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);

  useDismiss(settingsRef, isSettingsOpen, () => setIsSettingsOpen(false));
  useDismiss(infoRef, isInfoOpen, () => setIsInfoOpen(false));
  useDismiss(historyRef, isHistoryOpen, () => setIsHistoryOpen(false));

  // "?" abre o popup de atalhos/sobre, igual ao ray.so
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "?" || isEditableTarget(document.activeElement)) return;
      e.preventDefault();
      setIsInfoOpen(true);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const cycleFontSize = () => {
    const currentIndex = FONT_SIZES.indexOf(fontSize);
    const nextIndex = (currentIndex + 1) % FONT_SIZES.length;
    onFontSizeChange(FONT_SIZES[nextIndex]);
  };

  const cycleExportFormat = () => {
    onExportFormatChange(exportFormat === "png" ? "jpeg" : "png");
  };

  const cycleExportScale = () => {
    const currentIndex = EXPORT_SCALES.indexOf(exportScale);
    const nextIndex = (currentIndex + 1) % EXPORT_SCALES.length;
    onExportScaleChange(EXPORT_SCALES[nextIndex]);
  };

  const cycleLocale = () => {
    setLocale(locale === "pt-BR" ? "en-US" : "pt-BR");
  };

  return (
    <header className="w-full flex items-center justify-between p-4 px-6 select-none relative z-50">
      <div className="flex items-center gap-3">
        <h1 className="text-white text-sm font-bold tracking-widest flex items-center gap-2">
          Tabli
          <span className="px-1.5 py-0.5 rounded-md bg-[#1a1a1a] border border-[#333] text-[9px] text-[#8b8b8b] tracking-normal normal-case font-medium">
            beta
          </span>
        </h1>
      </div>

      <nav className="flex items-center gap-4">
        <button
          onClick={() => setIsInfoOpen(true)}
          title={t.header.info}
          className="transition-colors p-1.5 rounded hover:bg-[#111] text-[#8b8b8b] hover:text-white"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
            />
          </svg>
        </button>

        <div className="relative" ref={settingsRef}>
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            title={t.header.settings}
            className={`transition-colors p-1.5 rounded hover:bg-[#111] ${
              isSettingsOpen ? "text-white bg-[#111]" : "text-[#8b8b8b]"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
              />
            </svg>
          </button>

          {isSettingsOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-[#0a0a0a] border border-[#222] rounded-lg shadow-xl flex flex-col py-2 overflow-hidden">
              <div className="px-3 py-1.5 border-b border-[#222] mb-1">
                <span className="text-[10px] text-[#555] font-bold uppercase tracking-wider">
                  {t.header.preferences}
                </span>
              </div>

              <button
                onClick={cycleLocale}
                className="flex items-center justify-between px-3 py-2 hover:bg-[#1a1a1a] transition-colors w-full text-left"
              >
                <span className="text-xs text-[#8b8b8b]">{t.header.language}</span>
                <span className="text-[10px] text-white font-medium bg-[#111] px-1.5 py-0.5 rounded border border-[#333] uppercase">
                  {locale === "pt-BR" ? "PT-BR" : "EN-US"}
                </span>
              </button>

              <button
                onClick={cycleExportFormat}
                className="flex items-center justify-between px-3 py-2 hover:bg-[#1a1a1a] transition-colors w-full text-left"
              >
                <span className="text-xs text-[#8b8b8b]">{t.header.exportAs}</span>
                <span className="text-[10px] text-white font-medium bg-[#111] px-1.5 py-0.5 rounded border border-[#333] uppercase">
                  {exportFormat}
                </span>
              </button>

              <button
                onClick={cycleExportScale}
                className="flex items-center justify-between px-3 py-2 hover:bg-[#1a1a1a] transition-colors w-full text-left"
              >
                <span className="text-xs text-[#8b8b8b]">{t.header.exportScale}</span>
                <span className="text-[10px] text-white font-medium bg-[#111] px-1.5 py-0.5 rounded border border-[#333] uppercase">
                  {exportScale}x
                </span>
              </button>

              <button
                onClick={cycleFontSize}
                className="flex items-center justify-between px-3 py-2 hover:bg-[#1a1a1a] transition-colors w-full text-left"
              >
                <span className="text-xs text-[#8b8b8b]">{t.header.fontSize}</span>
                <span className="text-xs text-white font-medium">{fontSize}px</span>
              </button>

              <button
                onClick={() => onWatermarkChange(!watermark)}
                className="flex items-center justify-between px-3 py-2 hover:bg-[#1a1a1a] transition-colors w-full text-left group"
              >
                <span className="text-xs text-[#8b8b8b]">{t.header.watermark}</span>
                <div
                  className={`w-6 h-3.5 rounded-full flex items-center px-0.5 border transition-colors ${
                    watermark ? "bg-white/20 border-white/40" : "bg-[#222] border-[#333] group-hover:border-[#555]"
                  }`}
                >
                  <div
                    className={`w-2.5 h-2.5 rounded-full transition-transform ${
                      watermark ? "bg-white translate-x-2.5" : "bg-[#8b8b8b] translate-x-0"
                    }`}
                  />
                </div>
              </button>

              <button
                onClick={() => {
                  setHistory(loadHistory());
                  setIsHistoryOpen(true);
                  setIsSettingsOpen(false);
                }}
                className="flex items-center justify-between px-3 py-2 hover:bg-[#1a1a1a] transition-colors w-full text-left"
              >
                <span className="text-xs text-[#8b8b8b]">{t.header.history}</span>
                <svg className="w-3.5 h-3.5 text-[#555]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          )}
        </div>

        <div className="w-px h-4 bg-[#333]" />
        <Link
          href="https://github.com/sjunqueira/tabli"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 px-2 py-1.5 rounded-md transition-all"
        >
          <Image alt="github-logo" src={"github.svg"} width={24} height={24} className="invert" loading="eager" />
          <span className="text-[#8b8b8b] text-xs font-medium group-hover:text-white transition-colors">
            {t.header.starOnGithub}
          </span>
        </Link>
      </nav>

      {isInfoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-black/70">
          <div
            ref={infoRef}
            className="relative bg-[#0a0a0a] border border-[#222] rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col sm:flex-row overflow-hidden"
          >
            <button
              onClick={() => setIsInfoOpen(false)}
              aria-label={t.exportControls.close}
              className="absolute right-3 top-3 z-10 w-6 h-6 flex items-center justify-center rounded-full border border-[#333] text-[#8b8b8b] hover:text-white hover:border-[#555] transition-colors"
            >
              ×
            </button>

            <div className="flex-1 p-5 flex flex-col gap-3 overflow-y-auto">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">{t.infoPopup.aboutTitle}</h2>
              <p className="text-xs text-[#d4d4d8] leading-relaxed">{t.infoPopup.intro}</p>
              <p className="text-xs text-[#d4d4d8] leading-relaxed">{t.infoPopup.inspiration}</p>
              <p className="text-xs text-[#8b8b8b] leading-relaxed">{t.infoPopup.scope}</p>

              <h3 className="text-xs font-bold text-white uppercase tracking-wider mt-2">
                {t.infoPopup.contributeTitle}
              </h3>
              <p className="text-xs text-[#8b8b8b] leading-relaxed">
                {t.infoPopup.contribute}{" "}
                <Link
                  href="https://github.com/sjunqueira/tabli"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-[#d4d4d8] hover:text-white"
                >
                  GitHub
                </Link>
                .
              </p>
              <p className="text-xs text-[#8b8b8b] leading-relaxed">
                {t.infoPopup.starCta}{" "}
                <Link
                  href="https://github.com/sjunqueira/tabli"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-[#d4d4d8] hover:text-white"
                >
                  GitHub
                </Link>
                .
              </p>

              <p className="text-[10px] text-[#444] leading-relaxed mt-1">{t.infoPopup.coffeeNote}</p>
            </div>

            <div className="hidden sm:block w-px bg-[#222]" />
            <div className="block sm:hidden h-px bg-[#222]" />

            <div className="sm:w-56 shrink-0 p-5 flex flex-col gap-2.5 overflow-y-auto">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider mb-1">
                {t.infoPopup.shortcutsTitle}
              </h2>

              <ShortcutRow label={t.shortcuts.focusEditor}>
                <Kbd>F</Kbd>
              </ShortcutRow>
              <ShortcutRow label={t.shortcuts.unfocusEditor}>
                <Kbd>Esc</Kbd>
              </ShortcutRow>
              <ShortcutRow label={t.shortcuts.changeColors}>
                <Kbd>C</Kbd>
              </ShortcutRow>
              <ShortcutRow label={t.shortcuts.toggleBackground}>
                <Kbd>B</Kbd>
              </ShortcutRow>
              <ShortcutRow label={t.shortcuts.toggleLineNumbers}>
                <Kbd>N</Kbd>
              </ShortcutRow>
              <ShortcutRow label={t.shortcuts.changePadding}>
                <Kbd>P</Kbd>
              </ShortcutRow>
              <ShortcutRow label={t.shortcuts.selectLanguage}>
                <Kbd>L</Kbd>
              </ShortcutRow>
              <ShortcutRow label={t.shortcuts.toggleWindowControls}>
                <Kbd>W</Kbd>
              </ShortcutRow>
              <ShortcutRow label={t.shortcuts.formatCode}>
                <Kbd>⌥</Kbd>
                <Kbd>⇧</Kbd>
                <Kbd>F</Kbd>
              </ShortcutRow>
              <ShortcutRow label={t.shortcuts.copyImage}>
                <Kbd>
                  <ModifierKey />
                </Kbd>
                <Kbd>C</Kbd>
              </ShortcutRow>
              <ShortcutRow label={t.shortcuts.saveImage}>
                <Kbd>
                  <ModifierKey />
                </Kbd>
                <Kbd>S</Kbd>
              </ShortcutRow>
              <ShortcutRow label={t.shortcuts.openShortcuts}>
                <Kbd>?</Kbd>
              </ShortcutRow>
            </div>
          </div>
        </div>
      )}

      {isHistoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-black/70">
          <div
            ref={historyRef}
            className="bg-[#0a0a0a] border border-[#222] rounded-xl shadow-2xl w-full max-w-md max-h-[70vh] flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#222] shrink-0">
              <span className="text-xs font-bold text-white uppercase tracking-wider">{t.header.history}</span>
              <button
                onClick={() => setIsHistoryOpen(false)}
                className="text-[#8b8b8b] hover:text-white transition-colors"
              >
                ×
              </button>
            </div>

            <div className="overflow-y-auto flex-1">
              {history.length === 0 ? (
                <p className="text-xs text-[#555] p-6 text-center">{t.header.noSnapshots}</p>
              ) : (
                history.map((snapshot) => (
                  <button
                    key={snapshot.id}
                    onClick={() => {
                      onRestoreSnapshot(snapshot);
                      setIsHistoryOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 border-b border-[#161616] last:border-b-0 hover:bg-[#141414] transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] text-[#8b8b8b] uppercase tracking-wider">
                        {snapshot.mode === "code" ? t.common.code : t.common.table}
                      </span>
                      <span className="text-[10px] text-[#555]">{formatRelativeTime(snapshot.timestamp, t.time)}</span>
                    </div>
                    <p className="text-xs text-[#d4d4d8] font-mono truncate">
                      {snapshotPreview(snapshot, t.common.empty)}
                    </p>
                    {snapshot.mode === "code" && (
                      <p className="text-[10px] text-[#555] mt-0.5">
                        {snapshot.fileName} · {snapshot.language}
                      </p>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
