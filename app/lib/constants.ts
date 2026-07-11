import { EditorTheme, ExportScale, LanguageOption, PaddingPreset } from "./types";

// paleta curada à mão por tema — cardBackground usa alpha <1 de propósito
// (leve efeito de vidro fosco, combinado com o backdrop-blur do card) e
// shikiTheme só precisa combinar visualmente com a paleta, não bater 1:1
// com o nome do tema (por isso vários temas hardcoded reaproveitam um tema
// do Shiki já pronto que "veste bem" a cor escolhida)
export const EDITOR_THEMES: EditorTheme[] = [
  {
    id: "github-dark",
    shikiTheme: "github-dark",
    canvasBackground: "linear-gradient(140deg, #0d1117 0%, #1c2530 100%)",
    cardBackground: "rgba(13,17,23,0.92)",
    tableHeaderBg: "rgba(88,166,255,0.14)",
    tableHeaderText: "#79c0ff",
  },
  {
    id: "dracula",
    shikiTheme: "dracula",
    canvasBackground: "linear-gradient(140deg, #2b2140 0%, #1e1f29 100%)",
    cardBackground: "rgba(40,42,54,0.92)",
    tableHeaderBg: "rgba(189,147,249,0.16)",
    tableHeaderText: "#bd93f9",
  },
  {
    id: "one-dark-pro",
    shikiTheme: "one-dark-pro",
    canvasBackground: "linear-gradient(140deg, #282c34 0%, #1b1e24 100%)",
    cardBackground: "rgba(40,44,52,0.92)",
    tableHeaderBg: "rgba(97,175,239,0.14)",
    tableHeaderText: "#61afef",
  },
  {
    id: "nord",
    shikiTheme: "nord",
    canvasBackground: "linear-gradient(140deg, #2e3440 0%, #242933 100%)",
    cardBackground: "rgba(46,52,64,0.92)",
    tableHeaderBg: "rgba(136,192,208,0.16)",
    tableHeaderText: "#88c0d0",
  },
  {
    id: "vitesse-dark",
    shikiTheme: "vitesse-dark",
    canvasBackground: "linear-gradient(140deg, #181818 0%, #101010 100%)",
    cardBackground: "rgba(18,18,18,0.92)",
    tableHeaderBg: "rgba(77,147,117,0.18)",
    tableHeaderText: "#7fd9b6",
  },
  {
    id: "min-dark",
    shikiTheme: "min-dark",
    canvasBackground: "linear-gradient(140deg, #1f1f1f 0%, #141414 100%)",
    cardBackground: "rgba(31,31,31,0.92)",
    tableHeaderBg: "rgba(255,255,255,0.05)",
    tableHeaderText: "#a1a1aa",
  },
  {
    id: "ayu-dark",
    shikiTheme: "ayu-dark",
    canvasBackground: "linear-gradient(140deg, #0b0e14 0%, #131721 100%)",
    cardBackground: "rgba(11,14,20,0.92)",
    tableHeaderBg: "rgba(255,180,84,0.16)",
    tableHeaderText: "#ffb454",
  },
  {
    id: "noir",
    shikiTheme: "vitesse-black",
    canvasBackground: "linear-gradient(140deg, #1c1c1c 0%, #0a0a0a 100%)",
    cardBackground: "rgba(20,20,20,0.92)",
    tableHeaderBg: "rgba(255,255,255,0.06)",
    tableHeaderText: "#d4d4d8",
  },
  {
    id: "ice",
    shikiTheme: "night-owl",
    canvasBackground: "linear-gradient(140deg, #142b3d 0%, #0a1622 100%)",
    cardBackground: "rgba(15,33,48,0.9)",
    tableHeaderBg: "rgba(56,189,248,0.16)",
    tableHeaderText: "#7dd3fc",
  },
  {
    id: "sand",
    shikiTheme: "gruvbox-dark-soft",
    canvasBackground: "linear-gradient(140deg, #d8a672 0%, #b9804a 100%)",
    cardBackground: "rgba(38,30,22,0.9)",
    tableHeaderBg: "rgba(217,166,114,0.18)",
    tableHeaderText: "#e8c9a0",
  },
  {
    id: "forest",
    shikiTheme: "everforest-dark",
    canvasBackground: "linear-gradient(140deg, #1a2e22 0%, #0d1a13 100%)",
    cardBackground: "rgba(18,32,26,0.92)",
    tableHeaderBg: "rgba(74,222,128,0.16)",
    tableHeaderText: "#86efac",
  },
  {
    id: "mono",
    shikiTheme: "vesper",
    canvasBackground: "linear-gradient(140deg, #2a2a2a 0%, #131313 100%)",
    cardBackground: "rgba(26,26,26,0.92)",
    tableHeaderBg: "rgba(255,255,255,0.05)",
    tableHeaderText: "#a1a1aa",
  },
  {
    id: "breeze",
    shikiTheme: "poimandres",
    canvasBackground: "linear-gradient(140deg, #2a2140 0%, #171225 100%)",
    cardBackground: "rgba(30,24,48,0.92)",
    tableHeaderBg: "rgba(167,139,250,0.16)",
    tableHeaderText: "#c4b5fd",
  },
  {
    id: "candy",
    shikiTheme: "synthwave-84",
    canvasBackground: "linear-gradient(140deg, #3d1a35 0%, #1f0f24 100%)",
    cardBackground: "rgba(42,21,48,0.9)",
    tableHeaderBg: "rgba(244,114,182,0.18)",
    tableHeaderText: "#f9a8d4",
  },
  {
    id: "crimson",
    shikiTheme: "red",
    canvasBackground: "linear-gradient(140deg, #3d1015 0%, #1a0708 100%)",
    cardBackground: "rgba(36,10,13,0.92)",
    tableHeaderBg: "rgba(248,113,113,0.16)",
    tableHeaderText: "#fca5a5",
  },
  {
    id: "falcon",
    shikiTheme: "tokyo-night",
    canvasBackground: "linear-gradient(140deg, #2b3648 0%, #151b26 100%)",
    cardBackground: "rgba(28,37,49,0.92)",
    tableHeaderBg: "rgba(148,163,184,0.16)",
    tableHeaderText: "#cbd5e1",
  },
  {
    id: "meadow",
    shikiTheme: "monokai",
    canvasBackground: "linear-gradient(140deg, #24361f 0%, #101a0d 100%)",
    cardBackground: "rgba(24,38,21,0.92)",
    tableHeaderBg: "rgba(163,230,53,0.16)",
    tableHeaderText: "#bef264",
  },
  {
    id: "midnight",
    shikiTheme: "aurora-x",
    canvasBackground: "linear-gradient(140deg, #141a33 0%, #0a0d1a 100%)",
    cardBackground: "rgba(16,20,42,0.92)",
    tableHeaderBg: "rgba(129,140,248,0.16)",
    tableHeaderText: "#a5b4fc",
  },
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


export const PADDING_PRESETS: { id: PaddingPreset; value: number }[] = [
  { id: "tight", value: 16 },
  { id: "compact", value: 32 },
  { id: "default", value: 48 },
  { id: "spacious", value: 64 },
];

export const MAX_CODE_CARD_HEIGHT = 560;
export const MAX_CARD_HEIGHT = 560;
export const FONT_SIZES = [12, 13, 14, 15, 16, 18, 20];
export const EXPORT_SCALES: ExportScale[] = [2, 4, 6];

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