export type Mode = "code" | "table";

export type EditorThemeId =
  | "github-dark"
  | "dracula"
  | "one-dark-pro"
  | "nord"
  | "vitesse-dark"
  | "min-dark"
  | "ayu-dark"
  | "noir"
  | "ice"
  | "sand"
  | "forest"
  | "mono"
  | "breeze"
  | "candy"
  | "crimson"
  | "falcon"
  | "meadow"
  | "midnight";

// um tema unifica: gradiente do canvas atrás do card, fundo do próprio card
// (com um leve toque de transparência, pra deixar o card com um ar de vidro
// fosco sobre o canvas), tema do Shiki pra colorir o código e cor de
// destaque do cabeçalho da tabela — a paleta é curada à mão por tema (não
// precisa bater 1:1 com o catálogo de temas do Shiki), então IDE e fundo
// nunca destoam
export interface EditorTheme {
  id: EditorThemeId;
  shikiTheme: string;
  canvasBackground: string;
  cardBackground: string;
  tableHeaderBg: string;
  tableHeaderText: string;
}

export interface LanguageOption {
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
  theme: EditorThemeId;
  showBackground: boolean;
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