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

export type PaddingPreset = "tight" | "compact" | "default" | "spacious";

export type Locale = "pt-BR" | "en-US";

