import type { Plugin } from "prettier";

export const PRETTIER_LANGUAGES = new Set([
  "typescript",
  "javascript",
  "tsx",
  "json",
  "yaml",
  "html",
  "css",
]);

export function normalizeIndentation(code: string): string {
  const lines = code.split("\n");
  const nonEmptyLines = lines.filter((line) => line.trim().length > 0);
  if (nonEmptyLines.length === 0) return code;

  const minIndent = Math.min(
    ...nonEmptyLines.map((line) => line.match(/^\s*/)?.[0].length ?? 0),
  );

  return lines.map((line) => (line.trim().length === 0 ? "" : line.slice(minIndent))).join("\n");
}

async function loadPrettierConfig(language: string): Promise<{ parser: string; plugins: Plugin[] }> {
  switch (language) {
    case "typescript":
    case "tsx": {
      const [ts, estree] = await Promise.all([
        import("prettier/plugins/typescript"),
        import("prettier/plugins/estree"),
      ]);
      return { parser: "typescript", plugins: [ts, estree] };
    }
    case "javascript": {
      const [babel, estree] = await Promise.all([
        import("prettier/plugins/babel"),
        import("prettier/plugins/estree"),
      ]);
      return { parser: "babel", plugins: [babel, estree] };
    }
    case "json": {
      const [babel, estree] = await Promise.all([
        import("prettier/plugins/babel"),
        import("prettier/plugins/estree"),
      ]);
      return { parser: "json", plugins: [babel, estree] };
    }
    case "yaml": {
      const yaml = await import("prettier/plugins/yaml");
      return { parser: "yaml", plugins: [yaml] };
    }
    case "html": {
      const [html, postcss, babel, estree] = await Promise.all([
        import("prettier/plugins/html"),
        import("prettier/plugins/postcss"),
        import("prettier/plugins/babel"),
        import("prettier/plugins/estree"),
      ]);
      return { parser: "html", plugins: [html, postcss, babel, estree] };
    }
    case "css": {
      const postcss = await import("prettier/plugins/postcss");
      return { parser: "css", plugins: [postcss] };
    }
    default:
      throw new Error(`Unsupported language for prettier: ${language}`);
  }
}

export async function formatWithPrettier(code: string, language: string): Promise<string> {
  const [prettier, config] = await Promise.all([
    import("prettier/standalone"),
    loadPrettierConfig(language),
  ]);
  return prettier.format(code, { parser: config.parser, plugins: config.plugins });
}

// erros de parse do Prettier (babel/typescript) trazem `.loc` e a 1a linha da
// mensagem já descreve o problema — o resto é um code frame ASCII, que não
// cabe num toast, então descartamos e montamos "linha X, coluna Y: mensagem"
export function formatPrettierError(err: unknown): string {
  if (err && typeof err === "object" && "message" in err) {
    const e = err as { message?: string; loc?: { start?: { line?: number; column?: number } } };
    const firstLine = (e.message ?? "").split("\n")[0].trim();
    const message = firstLine.replace(/\s*\(\d+:\d+\)\s*$/, "") || "erro de sintaxe";
    const loc = e.loc?.start;
    if (typeof loc?.line === "number") {
      const column = typeof loc.column === "number" ? `, coluna ${loc.column}` : "";
      return `Linha ${loc.line}${column}: ${message}`;
    }
    return message;
  }
  return "erro de sintaxe desconhecido";
}
