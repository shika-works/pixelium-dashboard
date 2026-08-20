# Pixelium Dashboard

A pixel-art admin dashboard built with **Vue 3 + TypeScript + Vite** and the
[PixeliumDesign](https://github.com/shika-works/pixelium-design) component library
(`@pixelium/web-vue`), installed from the published npm package.

## Links

- **PixeliumDesign component library**: <https://github.com/shika-works/pixelium-design>
- **PixeliumDesign live demo**: <https://shika-works.github.io/pixelium-design/>

## Features

- Retro pixel-art UI powered by `@pixelium/web-vue`
- Responsive admin layout: collapsible sidebar, top bar, breadcrumbs
- Light / dark theme toggle (persisted in `localStorage`)
- i18n with Chinese (`zh`) and English (`en`) support
- Dashboard overview with animated counters, ECharts charts, tables and timeline
- Progress bars keep the pixel-art look via the component library's `px-progress`
- Pages: Dashboard, Analytics, Users (search / filter / selection / pagination / dialogs), Orders, Settings
- `vue-router` based routing with lazy-loaded views

## Getting Started

Requirements: Node `>=23.11.1`, pnpm `>=10`.

### 1. Install the component library

The component library `@pixelium/web-vue` is installed from the published npm
package, so `pnpm install` works out of the box.

To develop against a local source build of the library (e.g.
`../pixelium-design/packages/web-vue`), add a `pnpm-workspace.yaml` override:

```yaml
overrides:
  '@pixelium/web-vue': link:../pixelium-design/packages/web-vue
```

### 2. Install & run

```bash
pnpm install
pnpm dev
```

Build for production:

```bash
pnpm build
pnpm preview
```

## Deploy to GitHub Pages

Live site: <https://shika-works.github.io/pixelium-dashboard/>

1. Push to the `main` branch — the GitHub Actions workflow
   (`.github/workflows/deploy.yml`) builds the app and deploys `dist/` to
   Pages automatically.
2. Make sure GitHub Pages is enabled for the repo:
   **Settings → Pages → Source: GitHub Actions**.

Notes:

- `vite.config.ts` sets `base: '/pixelium-dashboard/'` for the project-site URL.
  Change or remove it when deploying elsewhere (e.g. a custom domain).
- The build step copies `dist/index.html` to `dist/404.html` so client-side
  routes like `/pixelium-dashboard/users` work on refresh (GitHub Pages has no
  SPA rewrite).
- The component library `@pixelium/web-vue@0.2.0-beta` is published on npm,
  so `pnpm install` works without local linking.

## Project Structure

```
src/
├── main.ts                 # entry: registers plugin, i18n, router
├── App.vue                 # root component (router-view)
├── router/index.ts         # routes
├── i18n/                   # vue-i18n instance + locales (en / zh)
├── styles/global.css       # global styles (layout helpers)
├── composables/useAppTheme.ts
├── layouts/DashboardLayout.vue
├── components/
│   ├── AppSidebar.vue      # logo + px-menu navigation
│   ├── AppTopbar.vue       # breadcrumb, search, theme/lang switch, notifications, avatar
│   ├── StatCard.vue        # animated statistic card
│   ├── EChartBar.vue       # ECharts bar chart (theme aware)
│   ├── EChartLine.vue      # ECharts line / area chart, multi-series
│   └── EChartDonut.vue     # ECharts donut chart with legend
└── views/
    ├── DashboardView.vue
    ├── AnalyticsView.vue
    ├── UsersView.vue
    ├── RolesView.vue     # roles & permissions
    ├── OrdersView.vue
    ├── SettingsView.vue
    └── AddProductView.vue # add-product form (showcases all form controls)
```

