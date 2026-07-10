export type Mode = "code" | "table";

export type BackgroundId =
  | "transparent"
  | "indigo"
  | "blue"
  | "emerald"
  | "green"
  | "pink"
  | "red"
  | "yellow"
  | "black"
  | "gray"
  | "white";

export interface BackgroundPreset {
  id: BackgroundId;
  value: string;
}

export interface LanguageOption {
  label: string;
  value: string;
}

export interface ThemeOption {
  label: string;
  value: string;
}

export type TableFormat = "markdown" | "csv" | "cells";

export interface TableData {
  headers: string[];
  rows: string[][];
  // largura manual (px) por coluna — null/undefined = auto (tamanho por conteúdo)
  columnWidths?: (number | null)[];
}

export type ExportFormat = "png" | "jpeg";

export type ExportScale = 2 | 4 | 6;

export type PaddingPreset = "tight" | "compact" | "default" | "spacious";

export type Locale = "pt-BR" | "en-US";

export interface Snapshot {
  id: string;
  timestamp: number;
  mode: Mode;
  code?: string;
  table?: TableData;
  fileName: string;
  language: string;
}

export interface Preferences {
  theme: string;
  padding: PaddingPreset;
  fontSize: number;
  exportFormat: ExportFormat;
  exportScale: ExportScale;
  watermark: boolean;
  showLineNumbers: boolean;
  showWindowControls: boolean;
  locale: Locale;
}

export interface ContentState {
  code: string;
  table: TableData;
  fileName: string;
  language: string;
  mode: Mode;
}