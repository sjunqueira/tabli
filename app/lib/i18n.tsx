"use client";

import { createContext, useContext, useMemo } from "react";
import type { Locale } from "./types";

export interface TranslationStrings {
  header: {
    settings: string;
    preferences: string;
    exportAs: string;
    fontSize: string;
    watermark: string;
    history: string;
    noSnapshots: string;
    starOnGithub: string;
    language: string;
    info: string;
    exportScale: string;
  };
  infoPopup: {
    title: string;
    aboutTitle: string;
    intro: string;
    inspiration: string;
    scope: string;
    contributeTitle: string;
    contribute: string;
    starCta: string;
    coffeeNote: string;
    shortcutsTitle: string;
  };
  shortcuts: {
    focusEditor: string;
    unfocusEditor: string;
    changeColors: string;
    toggleBackground: string;
    toggleLineNumbers: string;
    changePadding: string;
    selectLanguage: string;
    formatCode: string;
    toggleWindowControls: string;
    copyImage: string;
    saveImage: string;
    openShortcuts: string;
  };
  common: {
    code: string;
    table: string;
    empty: string;
  };
  time: {
    now: string;
    secondsAgo: (n: number) => string;
    minutesAgo: (n: number) => string;
    hoursAgo: (n: number) => string;
    daysAgo: (n: number) => string;
  };
  bottomBar: {
    windowControls: string;
    lineNumbers: string;
    background: string;
  };
  codeToolbar: {
    resetWidth: string;
    format: string;
    unsupportedLanguageWarning: string;
    formatError: (details: string) => string;
    overflowWidthSoft: string;
    overflowWidth: string;
    overflowHeight: string;
  };
  tableToolbar: {
    resetColumnWidths: string;
    overflowWidthSoft: string;
    overflowWidth: string;
    overflowHeight: string;
    removeLastColumn: string;
    removeLastRow: string;
  };
  tableImport: {
    trigger: string;
    placeholder: string;
    cancel: string;
    import: string;
  };
  tableSnippet: {
    removeColumn: string;
    addColumn: string;
    removeRow: string;
    addRow: string;
    resizeColumn: string;
    resizeHandle: string;
  };
  codeCard: {
    fileNamePlaceholder: string;
    resizeHandle: string;
  };
  exportControls: {
    copy: string;
    copied: string;
    download: string;
    imageReady: string;
    clipboardBlocked: string;
    rightClickHint: string;
    close: string;
    snippetAlt: string;
  };
  themes: Record<
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
    | "midnight",
    string
  >;
  paddings: Record<"tight" | "compact" | "default" | "spacious", string>;
  watermarkText: string;
}

const ptBR: TranslationStrings = {
  header: {
    settings: "Configurações",
    preferences: "Preferências",
    exportAs: "Exportar como",
    fontSize: "Tamanho da fonte",
    watermark: "Marca d'água",
    history: "Histórico",
    noSnapshots: "Nenhum snapshot salvo ainda.",
    starOnGithub: "Star on GitHub",
    language: "Idioma",
    info: "Sobre o Tabli",
    exportScale: "Escala de exportação",
  },
  infoPopup: {
    title: "Sobre o Tabli",
    aboutTitle: "Sobre",
    intro:
      "Tabli é uma ferramenta para transformar pequenos trechos de código e tabelas em imagens bonitas, prontas para compartilhar. A ideia é oferecer uma forma rápida e intuitiva de criar capturas com aparência profissional, sem precisar editar imagens manualmente.",

   inspiration:
      "O Tabli não nasceu completamente do zero. A ideia inicial era criar um fork do ray.so, mas, após avaliar o projeto, decidi que seria melhor desenvolver uma nova codebase do zero, com o auxílio de IA, mantendo apenas a inspiração na experiência original. É justamente por isso que o Tabli também é open-source: uma forma de manter vivo o espírito do projeto que o inspirou, enquanto evolui como um produto próprio, tendo o modo de tabelas como seu principal diferencial.",
    scope:
      "Não é feito para código ou tabelas grandes e reais de produção: o objetivo aqui são imagens educativas, exemplos e trechos ilustrativos. Todo o processamento acontece localmente no navegador, sem enviar seu conteúdo para servidores, mantendo seus dados privados.",

    contributeTitle: "Contribua",
    contribute:
      "O projeto continua open-source. Você pode contribuir direto no repositório ou criar seu próprio fork e versão a partir dele em",
    starCta: "Gostou do Tabli? A forma mais simples de apoiar é deixando uma estrela no",

    coffeeNote: "Café via Pix/PayPal: sergiojunqueira.s@gmail.com",

    shortcutsTitle: "Atalhos",
  },
  shortcuts: {
    focusEditor: "Focar editor",
    unfocusEditor: "Desfocar editor",
    changeColors: "Mudar tema/cores",
    toggleBackground: "Alternar fundo",
    toggleLineNumbers: "Alternar linhas",
    changePadding: "Mudar espaçamento",
    selectLanguage: "Trocar linguagem",
    formatCode: "Formatar código",
    toggleWindowControls: "Alternar janela",
    copyImage: "Copiar imagem",
    saveImage: "Salvar imagem",
    openShortcuts: "Abrir atalhos",
  },
  common: {
    code: "Código",
    table: "Tabela",
    empty: "(vazio)",
  },
  time: {
    now: "agora",
    secondsAgo: (n) => `${n}s atrás`,
    minutesAgo: (n) => `${n} min atrás`,
    hoursAgo: (n) => `${n}h atrás`,
    daysAgo: (n) => `${n}d atrás`,
  },
  bottomBar: {
    windowControls: "Janela",
    lineNumbers: "Linhas",
    background: "Fundo",
  },
  codeToolbar: {
    resetWidth: "← Ajuste automático",
    format: "Formatar código",
    unsupportedLanguageWarning:
      "Esta linguagem não tem suporte completo do Prettier. Foi aplicada apenas a normalização de indentação, então a formatação pode não ficar tão precisa.",
    formatError: (details) => `Não foi possível formatar: ${details}.`,
    overflowWidthSoft: "Seu código está ficando grande. Imagens muito grandes podem não ficar tão boas.",
    overflowWidth:
      "Seu código passou do tamanho máximo. A imagem exportada será cortada. Recomendamos quebrar em linhas menores.",
    overflowHeight:
      "Seu código passou da altura máxima. A imagem exportada será cortada. Recomendamos dividir o código em blocos menores.",
  },
  tableToolbar: {
    resetColumnWidths: "← Ajuste automático",
    overflowWidthSoft: "Sua tabela está ficando grande. Imagens muito grandes podem não ficar tão boas.",
    overflowWidth:
      "Algumas colunas ficaram estreitas demais e os dados não estão totalmente visíveis. Remova colunas ou linhas para melhorar a legibilidade.",
    overflowHeight:
      "Sua tabela passou da altura máxima. A imagem exportada será cortada. Recomendamos remover linhas ou colunas.",
    removeLastColumn: "Remover última coluna",
    removeLastRow: "Remover última linha",
  },
  tableImport: {
    trigger: "Importar via CSV/Markdown",
    placeholder: "Cole seu CSV ou Markdown aqui...",
    cancel: "Cancelar",
    import: "Importar",
  },
  tableSnippet: {
    removeColumn: "Remover coluna",
    addColumn: "Adicionar coluna",
    removeRow: "Remover linha",
    addRow: "Adicionar linha",
    resizeColumn: "Redimensionar coluna",
    resizeHandle: "Arraste para redimensionar",
  },
  codeCard: {
    fileNamePlaceholder: "Sem-título-1",
    resizeHandle: "Arraste para redimensionar",
  },
  exportControls: {
    copy: "Copiar",
    copied: "Copiado!",
    download: "Baixar",
    imageReady: "Sua imagem está pronta!",
    clipboardBlocked: "O navegador bloqueou a cópia automática.",
    rightClickHint: 'Clique com o botão direito na imagem e selecione "Copiar imagem".',
    close: "Fechar",
    snippetAlt: "Snippet gerado",
  },
  themes: {
    "github-dark": "GitHub Dark",
    dracula: "Dracula",
    "one-dark-pro": "One Dark Pro",
    nord: "Nord",
    "vitesse-dark": "Vitesse Dark",
    "min-dark": "Min Dark",
    "ayu-dark": "Ayu Dark",
    noir: "Noir",
    ice: "Ice",
    sand: "Sand",
    forest: "Forest",
    mono: "Mono",
    breeze: "Breeze",
    candy: "Candy",
    crimson: "Crimson",
    falcon: "Falcon",
    meadow: "Meadow",
    midnight: "Midnight",
  },
  paddings: {
    tight: "Justo",
    compact: "Compacto",
    default: "Padrão",
    spacious: "Espaçoso",
  },
  watermarkText: "Feito com Tabli",
};

const enUS: TranslationStrings = {
  header: {
    settings: "Settings",
    preferences: "Preferences",
    exportAs: "Export as",
    fontSize: "Font size",
    watermark: "Watermark",
    history: "History",
    noSnapshots: "No snapshots saved yet.",
    starOnGithub: "Star on GitHub",
    language: "Language",
    info: "About Tabli",
    exportScale: "Export scale",
  },
  infoPopup: {
    title: "About Tabli",
    aboutTitle: "About",
    intro:
      "Tabli is a tool for turning small code snippets and tables into beautiful, shareable images. The goal is to provide a fast and intuitive way to create polished visuals without the need for manual image editing.",
   inspiration:
     "Tabli didn't start completely from scratch. The original idea was to build it as a fork of ray.so, but after evaluating the project I decided it would be better to create a brand-new codebase instead, developed with the help of AI while keeping the same core inspiration. That's also why Tabli is open source: to honor the spirit of the project that inspired it while allowing it to evolve into its own product, with table support becoming its main differentiator.",
    scope:
      "Tabli is not intended for large production codebases or massive datasets. It is designed for educational examples, visual demonstrations, and illustrative snippets. Everything runs locally in your browser, so your content is never uploaded to external servers.",
    contributeTitle: "Contribute",
    contribute:
      "The project remains open-source. You can contribute directly to the repository or create your own fork and version from it on",
    starCta: "Enjoying Tabli? The simplest way to support it is leaving a star on the",
    coffeeNote: "Coffee via Pix/PayPal: sergiojunqueira.s@gmail.com",
    shortcutsTitle: "Shortcuts",
  },
  shortcuts: {
    focusEditor: "Focus editor",
    unfocusEditor: "Unfocus editor",
    changeColors: "Change theme/colors",
    toggleBackground: "Toggle background",
    toggleLineNumbers: "Toggle line numbers",
    changePadding: "Change padding",
    selectLanguage: "Select language",
    formatCode: "Format code",
    toggleWindowControls: "Toggle window",
    copyImage: "Copy image",
    saveImage: "Save image",
    openShortcuts: "Open shortcuts",
  },
  common: {
    code: "Code",
    table: "Table",
    empty: "(empty)",
  },
  time: {
    now: "now",
    secondsAgo: (n) => `${n}s ago`,
    minutesAgo: (n) => `${n} min ago`,
    hoursAgo: (n) => `${n}h ago`,
    daysAgo: (n) => `${n}d ago`,
  },
  bottomBar: {
    windowControls: "Window",
    lineNumbers: "Lines",
    background: "Background",
  },
  codeToolbar: {
    resetWidth: "← Auto-adjustment",
    format: "Format Code",
    unsupportedLanguageWarning:
      "This language isn't fully supported by Prettier. Only indentation normalization was applied, so formatting may be less precise.",
    formatError: (details) => `Couldn't format: ${details}.`,
    overflowWidthSoft: "Your code is getting large. Very large images may not look as good.",
    overflowWidth:
      "Your code exceeds the maximum width. The exported image will be cropped. We recommend breaking it into shorter lines.",
    overflowHeight:
      "Your code exceeds the maximum height. The exported image will be cropped. We recommend splitting the code into smaller blocks.",
  },
  tableToolbar: {
    resetColumnWidths: "← Auto-adjustment",
    overflowWidthSoft: "Your table is getting large. Very large images may not look as good.",
    overflowWidth:
      "Some columns became too narrow and the data isn't fully visible. Remove columns or rows to improve readability.",
    overflowHeight:
      "Your table exceeds the maximum height. The exported image will be cropped. We recommend removing rows or columns.",
    removeLastColumn: "Remove last column",
    removeLastRow: "Remove last row",
  },
  tableImport: {
    trigger: "Import from CSV/Markdown",
    placeholder: "Paste your CSV or Markdown here...",
    cancel: "Cancel",
    import: "Import",
  },
  tableSnippet: {
    removeColumn: "Remove column",
    addColumn: "Add column",
    removeRow: "Remove row",
    addRow: "Add row",
    resizeColumn: "Resize column",
    resizeHandle: "Drag to resize",
  },
  codeCard: {
    fileNamePlaceholder: "Untitled-1",
    resizeHandle: "Drag to resize",
  },
  exportControls: {
    copy: "Copy",
    copied: "Copied!",
    download: "Download",
    imageReady: "Your image is ready!",
    clipboardBlocked: "Your browser blocked the automatic copy.",
    rightClickHint: 'Right-click the image and choose "Copy image".',
    close: "Close",
    snippetAlt: "Generated snippet",
  },
  themes: {
    "github-dark": "GitHub Dark",
    dracula: "Dracula",
    "one-dark-pro": "One Dark Pro",
    nord: "Nord",
    "vitesse-dark": "Vitesse Dark",
    "min-dark": "Min Dark",
    "ayu-dark": "Ayu Dark",
    noir: "Noir",
    ice: "Ice",
    sand: "Sand",
    forest: "Forest",
    mono: "Mono",
    breeze: "Breeze",
    candy: "Candy",
    crimson: "Crimson",
    falcon: "Falcon",
    meadow: "Meadow",
    midnight: "Midnight",
  },
  paddings: {
    tight: "Tight",
    compact: "Compact",
    default: "Default",
    spacious: "Spacious",
  },
  watermarkText: "Made with Tabli",
};

export const TRANSLATIONS: Record<Locale, TranslationStrings> = {
  "pt-BR": ptBR,
  "en-US": enUS,
};

export function detectLocale(): Locale {
  if (typeof navigator === "undefined") return "pt-BR";
  return navigator.language.toLowerCase().startsWith("pt") ? "pt-BR" : "en-US";
}

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationStrings;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

interface LocaleProviderProps {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  children: React.ReactNode;
}

export function LocaleProvider({ locale, setLocale, children }: LocaleProviderProps) {
  const value = useMemo(() => ({ locale, setLocale, t: TRANSLATIONS[locale] }), [locale, setLocale]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useTranslations(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useTranslations must be used within a LocaleProvider");
  return ctx;
}
