import { createApp } from 'vue'
import type { Plugin } from 'vue'

import PixeliumVue from '@pixelium/web-vue'

import App from './App.vue'
import i18n from './i18n'
import router from './router'

import '@pixelium/web-vue/dist/font.css'
import '@pixelium/web-vue/dist/pixelium-vue.css'
import '@pixelium/web-vue/dist/normalize.css'
import './styles/global.css'

if (typeof document !== 'undefined') {
  document.body.setAttribute('data-overlayscrollbars-initialize', '')
  document.documentElement.setAttribute('data-overlayscrollbars-initialize', '')
}

const app = createApp(App)

app.use(PixeliumVue as unknown as Plugin)
app.use(i18n)
app.use(router)

app.mount('#app')
