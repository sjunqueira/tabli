import { BackgroundId, BackgroundPreset, LanguageOption, PaddingPreset, ThemeOption } from "./types";

export const BACKGROUND_PRESETS: BackgroundPreset[] = [
  { id: "transparent", value: "transparent" },
  { id: "indigo", value: "linear-gradient(140deg, #1e1b4b 0%, #0f172a 100%)" },
  { id: "blue", value: "linear-gradient(140deg, #0f172a 0%, #1e3a8a 100%)" },
  { id: "emerald", value: "linear-gradient(140deg, #111827 0%, #064e3b 100%)" },
  { id: "green", value: "linear-gradient(140deg, #064e3b 0%, #10b981 100%)" },
  { id: "pink", value: "linear-gradient(140deg, #4c0519 0%, #1e1b4b 100%)" },
  { id: "red", value: "linear-gradient(140deg, #7f1d1d 0%, #991b1b 100%)" },
  { id: "yellow", value: "linear-gradient(140deg, #78350f 0%, #ca8a04 100%)" },
  { id: "black", value: "#050505" },
  { id: "gray", value: "#0a0a0a" },
  { id: "white", value: "#fff" },
];

// cor do cabeçalho da tabela (fundo + texto) por preset de fundo — presets
// "neutros" (transparente/preto/cinza/branco) caem num cinza sutil ("ghost"),
// os coloridos puxam um tom próximo ao do gradiente escolhido
export const TABLE_HEADER_ACCENTS: Record<BackgroundId, { bg: string; text: string }> = {
  transparent: { bg: "rgba(255,255,255,0.04)", text: "#a1a1aa" },
  black: { bg: "rgba(255,255,255,0.04)", text: "#a1a1aa" },
  gray: { bg: "rgba(255,255,255,0.04)", text: "#a1a1aa" },
  white: { bg: "rgba(255,255,255,0.04)", text: "#a1a1aa" },
  indigo: { bg: "rgba(99,102,241,0.14)", text: "#a5b4fc" },
  blue: { bg: "rgba(59,130,246,0.14)", text: "#93c5fd" },
  emerald: { bg: "rgba(16,185,129,0.14)", text: "#6ee7b7" },
  green: { bg: "rgba(74,222,128,0.14)", text: "#86efac" },
  pink: { bg: "rgba(236,72,153,0.14)", text: "#f9a8d4" },
  red: { bg: "rgba(239,68,68,0.14)", text: "#fca5a5" },
  yellow: { bg: "rgba(245,158,11,0.14)", text: "#fcd34d" },
};

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


export const PADDING_PRESETS: { id: PaddingPreset; value: number }[] = [
  { id: "tight", value: 16 },
  { id: "compact", value: 32 },
  { id: "default", value: 48 },
  { id: "spacious", value: 64 },
];

export const MAX_CODE_CARD_HEIGHT = 560;
export const MAX_CARD_HEIGHT = 560;
export const FONT_SIZES = [12, 13, 14, 15, 16, 18, 20];

// a partir daqui a tabela já fica visualmente apertada mesmo que nenhum
// dado esteja sendo cortado ainda — vale avisar antes de chegar no ponto
// em que colunas ficam pequenas demais pra mostrar o conteúdo
export const TABLE_SOFT_COLUMN_COUNT = 6;

// truncar um pouco é aceitável (o usuário ainda reconhece o conteúdo); o
// alerta severo só dispara quando sobra menos que essa fração do texto
// visível dentro da célula
export const TABLE_CLIP_VISIBLE_RATIO = 0.6;

export const MIN_COLUMN_WIDTH = 72;
// padding horizontal de cada célula (globals.css .snippet-table th/td) —
// usado pra estimar a largura real de uma coluna a partir do texto dentro dela
export const TABLE_CELL_PADDING_X = 32;

export const CARD_MIN_WIDTH = 420;
// a partir daqui o card ainda cabe (cresce até o limite real), mas já
// avisamos que imagens muito grandes tendem a não ficar tão boas
export const CARD_SOFT_MAX_WIDTH = 900;
// limite real — a partir daqui o conteúdo não cabe mais e a imagem exportada
// é cortada
export const CARD_HARD_MAX_WIDTH = 1200;

export const THEME_OPTIONS: ThemeOption[] = [
  { label: "GitHub Dark", value: "github-dark" },
  { label: "Dracula", value: "dracula" },
  { label: "One Dark Pro", value: "one-dark-pro" },
  { label: "Nord", value: "nord" },
  { label: "Vitesse Dark", value: "vitesse-dark" },
  { label: "Min Dark", value: "min-dark" },
  { label: "Ayu Dark", value: "ayu-dark" },
  
];

export const DEFAULT_CODE = `function pullMasterSword(hearts: number) {
  if (hearts < 13) {
    throw new Error("Not enough life force. You died! 💀");
  }
  return "Master Sword obtained! 🗡️✨";
}

const linkHearts = 3;
pullMasterSword(linkHearts);`;

export const DEFAULT_MARKDOWN_TABLE = `| Codename | Identity | Equipment | Financial Status |
| :--- | :--- | :--- | :--- |
| Captain America | Steve Rogers | Vibranium Shield | 🧊 Frozen (since 1945) |
| Spider-Man | Peter Parker | Web Shooters | 🪙 Broke (Again) |
| Iron Man | Tony Stark | Mark LXXXV Armor | 💳 Unlimited (Black Card) |
| Thor | Thor Odinson | Mjolnir | 🍺 Tab open at the tavern |
`;