<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import {
  IconClock,
  IconTrendingDown,
  IconTrendingUp,
  IconUsers,
} from '@pixelium/web-vue/icon-pa/es'

import EChartBar from '@/components/EChartBar.vue'
import EChartDonut from '@/components/EChartDonut.vue'
import EChartLine from '@/components/EChartLine.vue'
import StatCard from '@/components/StatCard.vue'

const { t } = useI18n()

const statVisits = computed(() => ({ title: t('analytics.stats.visits'), value: 98230, trend: 12.5 }))
const statOrders = computed(() => ({ title: t('analytics.stats.orders'), value: 3421, trend: 8.2 }))
const statSession = computed(() => ({ title: t('analytics.stats.avgSession'), value: 4.2, trend: 1.5 }))
const statBounce = computed(() => ({ title: t('analytics.stats.bounceRate'), value: 34.6, trend: -3.2 }))

const trafficSeries = computed(() => [
  {
    name: t('analytics.traffic.visits'),
    color: '#00a891',
    data: [82, 91, 76, 104, 98, 121, 113, 135, 128, 142, 131, 156],
  },
  {
    name: t('analytics.traffic.orders'),
    color: '#409eff',
    data: [31, 34, 29, 41, 38, 45, 42, 49, 46, 52, 48, 56],
  },
])

const trafficLabels = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']

const weekData = computed(() =>
  trafficSeries.value[0].data.map((value, i) => ({ label: trafficLabels[i], value })),
)

const weekOrders = computed(() =>
  trafficSeries.value[1].data.map((value, i) => ({ label: trafficLabels[i], value })),
)

const deviceData = computed(() => [
  { label: t('analytics.device.mobile'), value: 62, color: '#409eff' },
  { label: t('analytics.device.desktop'), value: 30, color: '#00a891' },
  { label: t('analytics.device.tablet'), value: 8, color: '#ff7d00' },
])

const browserRows = computed(() => [
  { label: t('analytics.browser.chrome'), percent: 68, theme: 'success' },
  { label: t('analytics.browser.firefox'), percent: 14, theme: 'notice' },
  { label: t('analytics.browser.safari'), percent: 9, theme: 'warning' },
  { label: t('analytics.browser.edge'), percent: 6, theme: 'primary' },
  { label: t('analytics.browser.others'), percent: 3, theme: 'sakura' },
])

const goalRows = computed(() => [
  { label: t('analytics.goal.signups'), percent: 85, theme: 'success' },
  { label: t('analytics.goal.revenueTarget'), percent: 62, theme: 'primary' },
  { label: t('analytics.goal.activeUsers'), percent: 74, theme: 'notice' },
])
</script>

<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h2 class="page-header__title">{{ t('analytics.title') }}</h2>
        <p class="page-header__subtitle">{{ t('analytics.subtitle') }}</p>
      </div>
      <div class="page-header__actions">
        <px-tag theme="primary" shape="round">30D</px-tag>
        <px-tag theme="notice" shape="round">2026</px-tag>
      </div>
    </div>

    <div class="stat-grid">
      <StatCard
        :title="statVisits.title"
        :value="statVisits.value"
        :icon="IconTrendingUp"
        theme="notice"
        :trend="statVisits.trend"
        :compare-text="t('dashboard.stats.weekly')"
      />
      <StatCard
        :title="statOrders.title"
        :value="statOrders.value"
        :icon="IconUsers"
        theme="warning"
        :trend="statOrders.trend"
        :compare-text="t('dashboard.stats.weekly')"
      />
      <StatCard
        :title="statSession.title"
        :value="statSession.value"
        :icon="IconClock"
        theme="primary"
        :trend="statSession.trend"
        suffix="min"
        :precision="1"
        :compare-text="t('dashboard.stats.weekly')"
      />
      <StatCard
        :title="statBounce.title"
        :value="statBounce.value"
        :icon="IconTrendingDown"
        theme="sakura"
        :trend="statBounce.trend"
        suffix="%"
        :precision="1"
        :compare-text="t('dashboard.stats.weekly')"
        :invert-trend="true"
      />
    </div>

    <div class="grid-2">
      <px-card>
        <template #header>
          <span class="card-title">{{ t('analytics.traffic.title') }}</span>
        </template>
        <EChartLine :series="trafficSeries" :labels="trafficLabels" :height="220" />
      </px-card>

      <px-card>
        <template #header>
          <span class="card-title">{{ t('analytics.browser.title') }}</span>
        </template>
        <div class="status-list">
          <div v-for="row in browserRows" :key="row.label" class="status-row">
            <div class="flex-between">
              <span>{{ row.label }}</span>
              <span class="text-muted">{{ row.percent }}%</span>
            </div>
            <px-progress :percentage="row.percent" :theme="row.theme" variant="checkered" />
          </div>
        </div>
      </px-card>
    </div>

    <div class="grid-2-reverse">
      <div class="right-stack">
        <px-card>
          <template #header>
            <span class="card-title">{{ t('analytics.device.title') }}</span>
          </template>
          <EChartDonut :data="deviceData" :height="200" />
        </px-card>

        <px-card>
          <template #header>
            <span class="card-title">{{ t('analytics.traffic.visits') }}</span>
          </template>
          <EChartBar :data="weekData" color="#409eff" :height="160" />
        </px-card>
      </div>

      <div class="right-stack">
        <px-card>
          <template #header>
            <span class="card-title">{{ t('analytics.goal.title') }}</span>
          </template>
          <div class="status-list">
            <div v-for="row in goalRows" :key="row.label" class="status-row">
              <div class="flex-between">
                <span>{{ row.label }}</span>
                <span class="text-muted">{{ row.percent }}%</span>
              </div>
              <px-progress :percentage="row.percent" :theme="row.theme" />
            </div>
          </div>
        </px-card>

        <px-card>
          <template #header>
            <span class="card-title">{{ t('analytics.traffic.orders') }}</span>
          </template>
          <EChartBar :data="weekOrders" color="#00b42a" :height="160" />
        </px-card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-title {
  font-size: 15px;
  font-weight: 700;
}

.status-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.status-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.right-stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>

