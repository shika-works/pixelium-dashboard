# Pixelium Dashboard

A pixel-art admin dashboard built with **Vue 3 + TypeScript + Vite** and the
[PixeliumDesign](https://github.com/shika-works/pixelium-design) component library
(`@pixelium/web-vue`), which is linked locally via pnpm.

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

### 1. Link the component library

The component library source lives outside this repo (e.g.
`../pixelium-design/packages/web-vue`). Link it into this project before
installing:

```bash
# from the library package directory
cd ../pixelium-design/packages/web-vue
pnpm link

# from this project directory
cd ../pixelium-dashboard
pnpm link @pixelium/web-vue
```

> On Windows, `pnpm link @pixelium/web-vue` may write a malformed dependency
> entry due to a pnpm bug with scoped packages. If that happens, link the
> directory directly instead (equivalent result):
>
> ```bash
> pnpm link "../pixelium-design/packages/web-vue"
> ```

The dependency is recorded in `package.json` as
`"@pixelium/web-vue": "link:../pixelium-design/packages/web-vue"`.

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

