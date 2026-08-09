<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

import { Message } from '@pixelium/web-vue'
import {
  IconBackburger,
  IconMenu,
  IconMoon,
  IconNotification,
  IconSearch,
  IconSun,
} from '@pixelium/web-vue/icon-pa/es'

import { useAppTheme } from '@/composables/useAppTheme'
import type { AppLocale } from '@/i18n'
import { setLocale } from '@/i18n'

defineProps<{ collapsed: boolean }>()
defineEmits<{ 'toggle-collapse': [] }>()

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()

const { isDark, toggle: toggleTheme } = useAppTheme()

const searchValue = ref('')

const breadcrumbOptions = computed(() => {
  const items = (route.meta.breadcrumb as string[] | undefined) ?? []
  return items.map((label, i) => ({
    index: i === 0 ? '/dashboard' : route.path,
    label,
  }))
})

function onBreadcrumbSelect(index: string | number | symbol) {
  if (typeof index === 'string' && index.startsWith('/')) {
    router.push(index)
  }
}

const languageOptions = computed(() => [
  { label: 'English', index: 'en' },
  { label: '简体中文', index: 'zh' },
])

function onLanguageSelect(index: string | number | symbol) {
  setLocale(index as AppLocale)
}

const notificationOptions = computed(() => [
  { index: 'order', theme: 'warning', timeKey: 'min5', label: t('dashboard.activity.orderPlaced') },
  { index: 'user', theme: 'success', timeKey: 'hour1', label: t('dashboard.activity.userRegistered') },
  { index: 'payment', theme: 'notice', timeKey: 'hour2', label: t('dashboard.activity.paymentReceived') },
  { index: 'report', theme: 'sakura', timeKey: 'day1', label: t('dashboard.activity.reportGenerated') },
])

const notifyVisible = ref(false)

function onNotificationSelect(index: string | number | symbol) {
  const found = notificationOptions.value.find((o) => o.index === index)
  if (found) {
    Message.info(String(found.label))
  }
  notifyVisible.value = false
}

const userOptions = [
  { label: t('topbar.profile'), index: 'profile' },
  { label: t('topbar.account'), index: 'account' },
  { divider: true, label: t('topbar.logout'), index: 'logout' },
]

function onUserSelect(index: string | number | symbol) {
  if (index === 'logout') {
    Message.success(t('topbar.logout'))
  } else {
    router.push('/settings')
  }
}
</script>

<template>
  <div class="app-topbar">
    <div class="topbar-left">
      <px-button shape="square" variant="plain" @click="$emit('toggle-collapse')">
        <template #icon>
          <IconMenu v-if="collapsed" />
          <IconBackburger v-else />
        </template>
      </px-button>

      <px-breadcrumb :options="breadcrumbOptions" splitter=">" @select="onBreadcrumbSelect" />
    </div>

    <div class="topbar-right">
      <px-input
        v-model="searchValue"
        class="topbar-search"
        :placeholder="t('topbar.searchPlaceholder')"
        clearable
      >
        <template #prefix>
          <IconSearch />
        </template>
      </px-input>

      <px-drop-down :options="languageOptions" placement="bottom-end" @select="onLanguageSelect">
        <px-button shape="square" variant="plain" :title="t('topbar.language')">
          {{ locale === 'zh' ? '中' : 'EN' }}
        </px-button>
      </px-drop-down>

      <px-button shape="square" variant="plain" :title="t('topbar.theme')" @click="toggleTheme">
        <template #icon>
          <IconSun v-if="isDark" />
          <IconMoon v-else />
        </template>
      </px-button>

      <px-popover
        v-model:visible="notifyVisible"
        trigger="click"
        placement="bottom-end"
        :content-style="{ width: '320px' }"
      >
        <template #default>
          <px-badge :value="3" theme="danger">
            <px-button shape="square" variant="plain" :title="t('topbar.notifications')">
              <template #icon>
                <IconNotification />
              </template>
            </px-button>
          </px-badge>
        </template>

        <template #content>
          <div class="notify-panel">
            <div class="notify-panel__header">
              <span>{{ t('topbar.notifications') }}</span>
              <px-tag theme="danger" size="small" shape="round">3</px-tag>
            </div>
            <div class="notify-panel__list">
              <button
                v-for="item in notificationOptions"
                :key="item.index"
                class="notify-item"
                type="button"
                @click="onNotificationSelect(item.index)"
              >
                <span class="notify-item__dot" :class="`notify-item__dot--${item.theme}`" />
                <span class="notify-item__text">{{ item.label }}</span>
                <span class="notify-item__time">{{ t(`topbar.notifyTimes.${item.timeKey}`) }}</span>
              </button>
            </div>
            <div class="notify-panel__footer">
              <router-link to="/orders" class="notify-panel__view-all">
                {{ t('dashboard.recentOrders.viewAll') }}
              </router-link>
            </div>
          </div>
        </template>
      </px-popover>

      <px-drop-down :options="userOptions" placement="bottom-end" @select="onUserSelect">
        <px-avatar class="topbar-avatar">PX</px-avatar>
      </px-drop-down>
    </div>
  </div>
</template>

<style scoped>
.app-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
}

.topbar-left,
.topbar-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.topbar-search {
  width: 220px;
}

.topbar-avatar {
  cursor: pointer;
}

.notify-panel {
  display: flex;
  flex-direction: column;
}

.notify-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px 10px;
  font-size: 14px;
  font-weight: 700;
  border-bottom: 2px solid var(--px-neutral-3);
}

.notify-panel__list {
  display: flex;
  flex-direction: column;
  padding: 4px;
}

.notify-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 8px;
  border: none;
  background: transparent;
  color: var(--px-neutral-10);
  font-family: inherit;
  font-size: 13px;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s;
}

.notify-item:hover {
  background-color: var(--px-neutral-2);
}

.notify-item__dot {
  width: 10px;
  height: 10px;
  flex-shrink: 0;
  box-shadow: 2px 2px 0 color-mix(in srgb, currentColor 30%, transparent);
}

.notify-item__dot--warning {
  background: var(--px-warning-6);
}

.notify-item__dot--success {
  background: var(--px-success-6);
}

.notify-item__dot--notice {
  background: var(--px-notice-6);
}

.notify-item__dot--sakura {
  background: var(--px-sakura-6);
}

.notify-item__text {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.notify-item__time {
  flex-shrink: 0;
  font-size: 11px;
  color: var(--px-neutral-8);
}

.notify-panel__footer {
  padding: 8px 12px;
  border-top: 2px solid var(--px-neutral-3);
  text-align: center;
}

.notify-panel__view-all {
  font-size: 13px;
  color: var(--px-primary-6);
}

.notify-panel__view-all:hover {
  text-decoration: underline;
}

@media (max-width: 900px) {
  .topbar-search {
    display: none;
  }
}
</style>
