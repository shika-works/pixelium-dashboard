<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

import {
  IconAddBox,
  IconAnalytics,
  IconCart,
  IconDashboard,
  IconMessage,
  IconPixelarticons,
  IconShield,
  IconShoppingBag,
  IconSliders,
  IconStore,
  IconUser,
  IconUsers,
} from '@pixelium/web-vue/icon-pa/es'

defineProps<{ collapsed: boolean }>()

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const activeKey = ref<string>(route.path)
const expandedKeys = ref<(string | number | symbol)[]>(['users', 'orders', 'components'])

watch(
  () => route.path,
  (path) => {
    activeKey.value = path
  },
)

function onMenuSelect(index: string | number | symbol) {
  if (typeof index === 'string') {
    router.push(index)
  }
}
</script>

<template>
  <div class="app-sidebar">
    <router-link to="/dashboard" class="sidebar-logo">
      <span class="sidebar-logo__mark">
        <IconPixelarticons />
      </span>
      <span v-show="!collapsed" class="sidebar-logo__text">{{ t('app.name') }}</span>
    </router-link>

    <px-menu
      v-model:active="activeKey"
      v-model:expanded="expandedKeys"
      :collapsed="collapsed"
      direction="vertical"
      @select="onMenuSelect"
    >
      <px-menu-item index="/dashboard">
        <template #icon><IconDashboard /></template>
        <span>{{ t('nav.dashboard') }}</span>
      </px-menu-item>

      <px-menu-item index="/analytics">
        <template #icon><IconAnalytics /></template>
        <span>{{ t('nav.analytics') }}</span>
      </px-menu-item>

      <px-submenu index="users" :label="t('nav.userManagement')">
        <template #icon><IconUsers /></template>
        <px-menu-item index="/users">
          <template #icon><IconUser /></template>
          <span>{{ t('nav.userList') }}</span>
        </px-menu-item>
        <px-menu-item index="/users/roles">
          <template #icon><IconShield /></template>
          <span>{{ t('nav.rolesPermissions') }}</span>
        </px-menu-item>
      </px-submenu>

      <px-submenu index="orders" :label="t('nav.orderManagement')">
        <template #icon><IconShoppingBag /></template>
        <px-menu-item index="/orders">
          <template #icon><IconCart /></template>
          <span>{{ t('nav.orderList') }}</span>
        </px-menu-item>
      </px-submenu>

      <px-submenu index="components" :label="t('nav.components')">
        <template #icon><IconStore /></template>
        <px-menu-item index="/components/form">
          <template #icon><IconAddBox /></template>
          <span>{{ t('nav.formControls') }}</span>
        </px-menu-item>
        <px-menu-item index="/components/dialogs">
          <template #icon><IconMessage /></template>
          <span>{{ t('nav.dialogs') }}</span>
        </px-menu-item>
      </px-submenu>

      <px-menu-item index="/settings">
        <template #icon><IconSliders /></template>
        <span>{{ t('nav.settings') }}</span>
      </px-menu-item>
    </px-menu>
  </div>
</template>

<style scoped>
.app-sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  flex-shrink: 0;
  border-bottom: 2px solid var(--px-neutral-3);
}

.sidebar-logo__mark {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  background: var(--px-primary-6);
  color: var(--px-neutral-1);
  box-shadow: 4px 4px 0 var(--px-primary-3);
}

.sidebar-logo__mark :deep(svg) {
  width: 22px;
  height: 22px;
}

.sidebar-logo__text {
  font-size: 16px;
  font-weight: 700;
  white-space: nowrap;
  letter-spacing: 1px;
}

.px-menu {
  margin: 12px 8px;
}
</style>
