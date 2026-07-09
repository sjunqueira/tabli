import { BackgroundPreset, LanguageOption, ThemeOption } from "./types";

export const BACKGROUND_PRESETS: BackgroundPreset[] = [
  { name: "Transparente", value: "transparent" },
  { name: "Índigo", value: "linear-gradient(140deg, #1e1b4b 0%, #0f172a 100%)" },
  { name: "Esmeralda", value: "linear-gradient(140deg, #111827 0%, #064e3b 100%)" },
  { name: "Rosa", value: "linear-gradient(140deg, #4c0519 0%, #1e1b4b 100%)" },
  { name: "Carvão", value: "#1a1a1a" },
  { name: "Preto", value: "#050505" },
];

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { label: "TypeScript", value: "typescript" },
  { label: "JavaScript", value: "javascript" },
  { label: "TSX", value: "tsx" },
  { label: "Python", value: "python" },
  { label: "SQL", value: "sql" },
  { label: "Bash", value: "bash" },
  { label: "JSON", value: "json" },
  { label: "YAML", value: "yaml" },
  { label: "Rust", value: "rust" },
  { label: "Go", value: "go" },
  { label: "HTML", value: "html" },
  { label: "CSS", value: "css" },
  { label: "Plain text", value: "plaintext" },
];

export const THEME_OPTIONS: ThemeOption[] = [
  { label: "GitHub Dark", value: "github-dark" },
  { label: "Dracula", value: "dracula" },
  { label: "One Dark Pro", value: "one-dark-pro" },
  { label: "Nord", value: "nord" },
  { label: "Vitesse Dark", value: "vitesse-dark" },
  { label: "Min Dark", value: "min-dark" },
];

export const DEFAULT_CODE = `export function isIdempotent(fn) {
  const seen = new Set();
  return (input) => {
    const key = JSON.stringify(input);
    if (seen.has(key)) return null;
    seen.add(key);
    return fn(input);
  };
}`;

export const DEFAULT_MARKDOWN_TABLE = `| user_id | user_name | user_email | created_at |
| ------- | --------- | ---------- | ---------- |
| 1 | Ana Silva | ana.silva@email.com | 2026-01-15 |
| 2 | Bruno Souza | bruno.s@email.com | 2026-02-20 |
| 3 | Carlos Edu | cadu@email.com | 2026-03-05 |
`;