import type { HLJSApi } from "highlight.js";

const HLJS_TO_APP_LANGUAGE: Record<string, string> = {
  typescript: "typescript",
  javascript: "javascript",
  python: "python",
  rust: "rust",
  go: "go",
  bash: "bash",
  json: "json",
  yaml: "yaml",
  xml: "html",
  css: "css",
  sql: "sql",
};

const MIN_LENGTH = 8;
const MIN_RELEVANCE = 5;
// diferença mínima de relevância entre o 1º e o 2º colocado do hljs — evita
// trocar a linguagem em empates estatísticos (ex: JS curto que "parece" TS)
const MIN_MARGIN = 2;

// `</Tag>` ou `<Tag ... />` são assinaturas quase exclusivas de JSX/HTML;
// diferente do padrão antigo, isso NÃO confunde genéricos do TypeScript
// como `Array<string>` ou `Promise<void>` com uma tag
const JSX_TAG_PATTERN = /<\/[A-Za-z][\w.]*>|<[A-Za-z][\w.]*(\s[^<>]*)?\/>/;

// sinais que só existem em TypeScript — usados pra corrigir o hljs quando
// ele confunde TS com JS (a gramática de JS ainda "aceita" bastante TS)
const TS_SIGNAL_PATTERN =
  /\binterface\s+\w+|\btype\s+\w+\s*=|:\s*(string|number|boolean|void|any|unknown|never|null|undefined)\b|<[A-Za-z][\w<>, ]*>\s*\(|\bimplements\s+\w+|\b(public|private|protected|readonly)\s+\w+|\bas\s+const\b|\benum\s+\w+|\bsatisfies\s+\w+/;

const SHEBANG_SHELL_PATTERN = /^#!.*\b(bash|sh|zsh)\b/;
const SQL_LEADING_KEYWORD_PATTERN =
  /^(select|insert\s+into|update\s+\w+\s+set|delete\s+from|create\s+(table|database|index|view|schema)|alter\s+table|drop\s+(table|database|index|view)|with\s+\w+\s+as)\b/i;

// checagens determinísticas e baratas, resolvidas sem precisar do hljs —
// cobrem os casos mais comuns e inequívocos (shebang, JSON válido, SQL,
// HTML, frontmatter YAML) antes de cair na detecção estatística
function detectDeterministic(trimmed: string): string | null {
  if (SHEBANG_SHELL_PATTERN.test(trimmed)) return "bash";

  if (/^[{[]/.test(trimmed)) {
    try {
      JSON.parse(trimmed);
      return "json";
    } catch {
      // não é JSON válido — continua pras outras checagens
    }
  }

  if (/^<!doctype html/i.test(trimmed) || /<html[\s>]/i.test(trimmed.slice(0, 200))) {
    return "html";
  }

  if (SQL_LEADING_KEYWORD_PATTERN.test(trimmed)) return "sql";

  if (/^---\s*$/.test(trimmed.split("\n")[0])) return "yaml";

  return null;
}

let hljsPromise: Promise<HLJSApi> | null = null;

async function getHljs(): Promise<HLJSApi> {
  if (!hljsPromise) {
    hljsPromise = (async () => {
      const [{ default: hljs }, ts, js, python, rust, go, bash, json, yaml, xml, css, sql] =
        await Promise.all([
          import("highlight.js/lib/core"),
          import("highlight.js/lib/languages/typescript"),
          import("highlight.js/lib/languages/javascript"),
          import("highlight.js/lib/languages/python"),
          import("highlight.js/lib/languages/rust"),
          import("highlight.js/lib/languages/go"),
          import("highlight.js/lib/languages/bash"),
          import("highlight.js/lib/languages/json"),
          import("highlight.js/lib/languages/yaml"),
          import("highlight.js/lib/languages/xml"),
          import("highlight.js/lib/languages/css"),
          import("highlight.js/lib/languages/sql"),
        ]);
      hljs.registerLanguage("typescript", ts.default);
      hljs.registerLanguage("javascript", js.default);
      hljs.registerLanguage("python", python.default);
      hljs.registerLanguage("rust", rust.default);
      hljs.registerLanguage("go", go.default);
      hljs.registerLanguage("bash", bash.default);
      hljs.registerLanguage("json", json.default);
      hljs.registerLanguage("yaml", yaml.default);
      hljs.registerLanguage("xml", xml.default);
      hljs.registerLanguage("css", css.default);
      hljs.registerLanguage("sql", sql.default);
      return hljs;
    })();
  }
  return hljsPromise;
}

export async function detectLanguage(code: string): Promise<string | null> {
  const trimmed = code.trim();
  if (trimmed.length < MIN_LENGTH) return null;

  const deterministic = detectDeterministic(trimmed);
  if (deterministic) return deterministic;

  const hljs = await getHljs();
  const result = hljs.highlightAuto(trimmed, Object.keys(HLJS_TO_APP_LANGUAGE));
  const best = result.relevance ?? 0;
  const second = result.secondBest?.relevance ?? 0;
  if (!result.language || best < MIN_RELEVANCE || best - second < MIN_MARGIN) return null;

  let mapped = HLJS_TO_APP_LANGUAGE[result.language];
  if (!mapped) return null;

  // hljs às vezes classifica TS como "javascript" (a gramática de JS
  // consegue parsear boa parte da sintaxe de TS) — corrige com sinais
  // exclusivos de TypeScript antes de decidir entre ts/js/tsx
  if (mapped === "javascript" && TS_SIGNAL_PATTERN.test(trimmed)) {
    mapped = "typescript";
  }

  if ((mapped === "typescript" || mapped === "javascript") && JSX_TAG_PATTERN.test(trimmed)) {
    mapped = "tsx";
  }

  return mapped;
}
