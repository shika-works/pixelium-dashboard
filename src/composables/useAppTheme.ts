import { computed, ref } from 'vue'

export type AppTheme = 'light' | 'dark'

const STORAGE_KEY = 'pixelium-theme'

function readSavedTheme(): AppTheme {
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'dark' || saved === 'light') return saved
  }
  return 'light'
}

function applyThemeClass(mode: AppTheme) {
  if (typeof document !== 'undefined') {
    const html = document.documentElement
    html.classList.remove('light', 'dark')
    html.classList.add(mode)
  }
}

const themeMode = ref<AppTheme>(readSavedTheme())

applyThemeClass(themeMode.value)

export function useAppTheme() {
  const isDark = computed(() => themeMode.value === 'dark')

  function setTheme(mode: AppTheme) {
    themeMode.value = mode
    applyThemeClass(mode)
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, mode)
    }
  }

  function toggle() {
    setTheme(isDark.value ? 'light' : 'dark')
  }

  return { themeMode, isDark, toggle, setTheme }
}

