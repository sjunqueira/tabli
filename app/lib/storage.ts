import type { ContentState, ExportScale, Preferences, Snapshot, TableData } from "./types";
import {
  EDITOR_THEMES,
  EXPORT_SCALES,
  FONT_SIZES,
  LANGUAGE_OPTIONS,
  PADDING_PRESETS,
} from "./constants";

export const STORAGE_KEYS = {
  preferences: "tabli:preferences",
  content: "tabli:content",
  history: "tabli:history",
} as const;

const MAX_HISTORY = 10;

function safeGetJSON<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function safeSetJSON(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage indisponível (modo privado, quota excedida, etc.) — ignora silenciosamente
  }
}

function isTableData(value: unknown): value is TableData {
  if (!value || typeof value !== "object") return false;
  const t = value as Record<string, unknown>;
  return (
    Array.isArray(t.headers) &&
    t.headers.every((h) => typeof h === "string") &&
    Array.isArray(t.rows) &&
    t.rows.every((r) => Array.isArray(r) && r.every((c) => typeof c === "string"))
  );
}

export function loadPreferences(): Partial<Preferences> | null {
  const raw = safeGetJSON<Record<string, unknown>>(STORAGE_KEYS.preferences);
  if (!raw || typeof raw !== "object") return null;

  const result: Partial<Preferences> = {};

  if (typeof raw.theme === "string" && EDITOR_THEMES.some((t) => t.id === raw.theme)) {
    result.theme = raw.theme as Preferences["theme"];
  }
  if (typeof raw.showBackground === "boolean") result.showBackground = raw.showBackground;
  if (typeof raw.padding === "string" && PADDING_PRESETS.some((p) => p.id === raw.padding)) {
    result.padding = raw.padding as Preferences["padding"];
  }
  if (typeof raw.fontSize === "number" && FONT_SIZES.includes(raw.fontSize)) {
    result.fontSize = raw.fontSize;
  }
  if (raw.exportFormat === "png" || raw.exportFormat === "jpeg") {
    result.exportFormat = raw.exportFormat;
  }
  if (typeof raw.exportScale === "number" && EXPORT_SCALES.includes(raw.exportScale as ExportScale)) {
    result.exportScale = raw.exportScale as ExportScale;
  }
  if (typeof raw.watermark === "boolean") result.watermark = raw.watermark;
  if (typeof raw.showLineNumbers === "boolean") result.showLineNumbers = raw.showLineNumbers;
  if (typeof raw.showWindowControls === "boolean") result.showWindowControls = raw.showWindowControls;
  if (raw.locale === "pt-BR" || raw.locale === "en-US") result.locale = raw.locale;

  return result;
}

export function savePreferences(prefs: Preferences): void {
  safeSetJSON(STORAGE_KEYS.preferences, prefs);
}

export function loadContent(): Partial<ContentState> | null {
  const raw = safeGetJSON<Record<string, unknown>>(STORAGE_KEYS.content);
  if (!raw || typeof raw !== "object") return null;

  const result: Partial<ContentState> = {};

  if (typeof raw.code === "string") result.code = raw.code;
  if (isTableData(raw.table)) result.table = raw.table;
  if (typeof raw.fileName === "string") result.fileName = raw.fileName;
  if (typeof raw.language === "string" && LANGUAGE_OPTIONS.some((l) => l.value === raw.language)) {
    result.language = raw.language;
  }
  if (raw.mode === "code" || raw.mode === "table") result.mode = raw.mode;

  return result;
}

export function saveContent(content: ContentState): void {
  safeSetJSON(STORAGE_KEYS.content, content);
}

export function loadHistory(): Snapshot[] {
  const raw = safeGetJSON<unknown[]>(STORAGE_KEYS.history);
  if (!Array.isArray(raw)) return [];
  return raw.filter((entry): entry is Snapshot => {
    if (!entry || typeof entry !== "object") return false;
    const s = entry as Record<string, unknown>;
    return (
      typeof s.id === "string" &&
      typeof s.timestamp === "number" &&
      (s.mode === "code" || s.mode === "table") &&
      typeof s.fileName === "string" &&
      typeof s.language === "string" &&
      (s.mode === "code" ? typeof s.code === "string" : isTableData(s.table))
    );
  });
}

function contentsEqual(a: Snapshot, b: Omit<Snapshot, "id" | "timestamp">): boolean {
  if (a.mode !== b.mode || a.fileName !== b.fileName || a.language !== b.language) return false;
  if (a.mode === "code") return a.code === b.code;
  return JSON.stringify(a.table) === JSON.stringify(b.table);
}

export function addSnapshotIfChanged(entry: Omit<Snapshot, "id" | "timestamp">): void {
  const history = loadHistory();
  const last = history[0];
  if (last && contentsEqual(last, entry)) return;

  const snapshot: Snapshot = {
    ...entry,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: Date.now(),
  };

  const next = [snapshot, ...history].slice(0, MAX_HISTORY);
  safeSetJSON(STORAGE_KEYS.history, next);
}
