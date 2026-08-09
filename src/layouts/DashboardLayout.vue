<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { RouterView } from 'vue-router'

import AppSidebar from '@/components/AppSidebar.vue'
import AppTopbar from '@/components/AppTopbar.vue'

const asideCollapsed = ref(false)
const menuCollapsed = ref(false)

let expandTimer: ReturnType<typeof setTimeout> | undefined

function onToggleCollapse() {
  clearTimeout(expandTimer)

  if (asideCollapsed.value) {
    asideCollapsed.value = false
    expandTimer = setTimeout(() => {
      menuCollapsed.value = false
    }, 50)
  } else {
    asideCollapsed.value = true
    menuCollapsed.value = true
  }
}

onBeforeUnmount(() => clearTimeout(expandTimer))
</script>

<template>
  <px-container direction="horizontal" class="app-layout">
    <px-aside :width="asideCollapsed ? 67 : 236" class="app-aside">
      <AppSidebar :collapsed="menuCollapsed" />
    </px-aside>

    <px-container class="app-body">
      <px-header :min-height="64" bordered class="app-header">
        <AppTopbar :collapsed="asideCollapsed" @toggle-collapse="onToggleCollapse" />
      </px-header>

        <px-scroll-bar class="app-scroll">
          <px-main class="app-main" soft>
            <RouterView v-slot="{ Component }">
              <transition name="fade" mode="out-in">
                <component :is="Component" />
              </transition>
            </RouterView>
          </px-main>
        </px-scroll-bar>
    </px-container>
  </px-container>
</template>

<style scoped>
.app-layout {
  height: 100%;
  overflow: hidden;
}

.app-aside {
  transition: width 0.2s ease;
  overflow-x: hidden;
}

.app-body {
  min-width: 0;
  height: 100%;
}

.app-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.app-main {
  overflow: hidden;
}

.app-scroll {
  height: 100%;
}
</style>
