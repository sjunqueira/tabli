export type Mode = "code" | "table";

export interface BackgroundPreset {
  name: string;
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
}

export type ExportFormat = "png" | "jpeg";