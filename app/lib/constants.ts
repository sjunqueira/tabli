import { BackgroundPreset, LanguageOption, ThemeOption } from "./types";

export const BACKGROUND_PRESETS: BackgroundPreset[] = [
  { name: "Transparente", value: "transparent" },
  { name: "Índigo", value: "linear-gradient(140deg, #1e1b4b 0%, #0f172a 100%)" },
  { name: "Azul", value: "linear-gradient(140deg, #0f172a 0%, #1e3a8a 100%)" },
  { name: "Esmeralda", value: "linear-gradient(140deg, #111827 0%, #064e3b 100%)" },
  { name: "Verde", value: "linear-gradient(140deg, #064e3b 0%, #10b981 100%)" },
  { name: "Rosa", value: "linear-gradient(140deg, #4c0519 0%, #1e1b4b 100%)" },
  { name: "Vermelho", value: "linear-gradient(140deg, #7f1d1d 0%, #991b1b 100%)" },
  { name: "Amarelo", value: "linear-gradient(140deg, #78350f 0%, #ca8a04 100%)" },
  { name: "Preto", value: "#050505" },
  { name: "Cinza", value: "#0a0a0a" },
  { name: "Branco", value: "#fff" },
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

export const MAX_CODE_CARD_HEIGHT = 560;
export const MAX_CARD_HEIGHT = 560;
export const FONT_SIZES = [12, 13, 14, 15, 16, 18, 20];

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