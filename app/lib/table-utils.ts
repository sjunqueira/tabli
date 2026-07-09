import Papa from "papaparse";
import type { TableData } from "./types";

export function emptyTable(cols = 3, rows = 2): TableData {
  return {
    headers: Array.from({ length: cols }, (_, i) => `col_${i + 1}`),
    rows: Array.from({ length: rows }, () => Array.from({ length: cols }, () => "")),
  };
}

export function tableToMarkdown(table: TableData): string {
  const { headers, rows } = table;
  const headerLine = `| ${headers.join(" | ")} |`;
  const sepLine = `| ${headers.map(() => "---").join(" | ")} |`;
  const rowLines = rows.map((r) => `| ${r.map((c) => c || " ").join(" | ")} |`);
  return [headerLine, sepLine, ...rowLines].join("\n");
}

export function markdownToTable(md: string): TableData {
  const lines = md.trim().split("\n").filter(Boolean);
  if (lines.length < 1) return emptyTable();

  const splitRow = (line: string) =>
    line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());

  const headers = splitRow(lines[0]);
  // pula a linha separadora (|---|---|) se ela existir
  const dataLines = lines[1]?.match(/^[\s|:-]+$/) ? lines.slice(2) : lines.slice(1);
  const rows = dataLines.map(splitRow);

  return { headers, rows };
}

export function tableToCsv(table: TableData): string {
  return Papa.unparse([table.headers, ...table.rows]);
}

export function csvToTable(csv: string): TableData {
  const result = Papa.parse<string[]>(csv.trim(), { skipEmptyLines: true });
  const [headers = [], ...rows] = result.data;
  return { headers, rows };
}