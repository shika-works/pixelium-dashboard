import { createI18n } from 'vue-i18n'

import en from './locales/en'
import zh from './locales/zh'

export type AppLocale = 'en' | 'zh'

const LOCALE_STORAGE_KEY = 'pixelium-locale'

function detectLocale(): AppLocale {
  if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY)
    if (stored === 'en' || stored === 'zh') return stored
  }
  if (typeof navigator !== 'undefined') {
    return navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en'
  }
  return 'en'
}

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: detectLocale(),
  fallbackLocale: 'en',
  messages: { en, zh },
})

export function setLocale(locale: AppLocale) {
  i18n.global.locale.value = locale
  localStorage.setItem(LOCALE_STORAGE_KEY, locale)
  document.documentElement.setAttribute('lang', locale)
}

export function getLocale(): AppLocale {
  return i18n.global.locale.value as AppLocale
}

export default i18n
