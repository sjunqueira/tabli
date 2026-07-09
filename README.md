# Tabli

Turn code snippets and Markdown tables into beautiful, shareable images — right in your browser.

Built as a Raycast [Code Images](https://ray.so) alternative with one addition it doesn't have: a dedicated Markdown table formatter, so you're not stuck screenshotting raw pipe-delimited text.

## Features

- **Code snippets** — syntax highlighting for multiple languages via [Shiki](https://shiki.style)
- **Markdown tables** — paste GFM-style tables, get a clean rendered image via [react-markdown](https://github.com/remarkjs/react-markdown) + [remark-gfm](https://github.com/remarkjs/remark-gfm)
- **Custom backgrounds** — solid colors, gradients, or transparent
- **Adjustable padding** — control the frame around your snippet
- **One-click export** — copy to clipboard or download as PNG, powered by [html2canvas-pro](https://github.com/niklasvh/html2canvas-pro)

## Tech stack

- [Next.js](https://nextjs.org) (App Router)
- TypeScript
- Tailwind CSS v4
- Shiki (syntax highlighting)
- react-markdown + remark-gfm (table rendering)
- html2canvas-pro (image export — chosen over html2canvas for correct `oklch()` color support)

## Getting started

```bash
git clone https://github.com/sjunqueira/tabli.git
cd tabli
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Roadmap

- [ ] Custom color picker for backgrounds
- [ ] Multiple snippets side by side
- [ ] Language auto-detection from filename extension
- [ ] Live demo deploy

## License

MIT