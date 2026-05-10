# Relo Atlas

Relo Atlas is a research-backed emigration scorecard that compares 26 countries across 16 categories. It lets you tune category weights and career sector to see a personalised ranking, with transparent source citations.

## The story

Relo Atlas started as a simple spreadsheet and a question: "If I had to start over somewhere else, how would I decide?" The usual advice was opinion-heavy and trend-led. I wanted a tool that was grounded in sources, honest about trade-offs, and flexible enough to reflect different life goals. So I built a scorecard, then a dashboard, then a map. This repo is the end result: a living, data-first lens on relocation.

## What it does

- Ranks countries across a weighted set of categories
- Lets you personalise weights and filter by region or career field
- Keeps methodology and sources visible, so the why is never hidden
- Stores user preferences locally for quick iteration

## Tech stack

- React + TypeScript (Vite)
- Bun for tooling
- CSS Modules + global styles
- GitHub Pages for hosting

## Getting started

```bash
bun install
bun dev
```

## Build

```bash
bun run build
bun run preview
```

## Deployment (GitHub Pages)

- The repo includes a GitHub Actions workflow that builds and deploys on every push to `main` or `master`.
- Ensure `base` in `vite.config.ts` matches your repo name if you fork it.
- In GitHub settings, set Pages to "GitHub Actions" for the source.

## Project structure

- `src/data` — research data, sources, and category descriptions
- `src/components` — UI components and modals
- `src/utils` — scoring helpers
- `src/styles` — global styles and component CSS modules

## Customisation

- Update weights, descriptions, and sources in `src/data`
- Adjust the scoring logic in `src/utils/score.ts`
- Swap the map image in `public/Emigration_Scorecard__Global_Overview.png`

## Contributing

If you want to extend the dataset or refine methodology, open an issue or a PR with sources included. Changes without citations are treated as speculative.

## License

MIT
