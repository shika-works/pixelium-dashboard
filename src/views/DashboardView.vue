<script setup lang="ts">
import { computed, h, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { Tag } from '@pixelium/web-vue'
import type { TableOptionsArg } from '@pixelium/web-vue'
import {
  IconAddBox,
  IconCart,
  IconChartBar,
  IconDownload,
  IconDollar,
  IconShoppingBag,
  IconUserPlus,
  IconUsers,
} from '@pixelium/web-vue/icon-pa/es'

import EChartBar from '@/components/EChartBar.vue'
import EChartDonut from '@/components/EChartDonut.vue'
import StatCard from '@/components/StatCard.vue'

const { t } = useI18n()

const lastUpdated = new Date().toLocaleDateString()

const statUsers = computed(() => ({
  title: t('dashboard.stats.totalUsers'),
  value: 12863,
  trend: 12.5,
}))
const statOrders = computed(() => ({
  title: t('dashboard.stats.totalOrders'),
  value: 3421,
  trend: 8.2,
}))
const statRevenue = computed(() => ({
  title: t('dashboard.stats.totalRevenue'),
  value: 98650,
  trend: 15.3,
}))
const statConversion = computed(() => ({
  title: t('dashboard.stats.conversionRate'),
  value: 2.8,
  trend: -1.4,
}))

type RevenueRange = 'week' | 'month' | 'year'
const revenueRange = ref<RevenueRange>('month')

const revenueWeek = [42, 68, 55, 78, 63, 90, 74]
const revenueMonth = [52, 61, 47, 70, 84, 66, 91, 58, 75, 88, 69, 95]
const revenueYear = [620, 710, 540, 860, 780, 920, 700, 830, 980, 760, 910, 1080]

const dayKeys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const
const monthKeys = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec',
] as const

const revenueData = computed(() => {
  if (revenueRange.value === 'week') {
    return revenueWeek.map((value, i) => ({ label: t(`days.${dayKeys[i]}`), value }))
  }
  if (revenueRange.value === 'month') {
    return revenueMonth.map((value, i) => ({ label: `W${i + 1}`, value }))
  }
  return revenueYear.map((value, i) => ({ label: t(`months.${monthKeys[i]}`), value }))
})

const rangeOptions = computed(() => [
  { label: t('dashboard.revenue.week'), value: 'week' },
  { label: t('dashboard.revenue.month'), value: 'month' },
  { label: t('dashboard.revenue.year'), value: 'year' },
])

const channelData = computed(() => [
  { label: t('dashboard.channels.direct'), value: 48, color: '#00a891' },
  { label: t('dashboard.channels.search'), value: 32, color: '#409eff' },
  { label: t('dashboard.channels.social'), value: 20, color: '#ff7d00' },
  { label: t('dashboard.channels.email'), value: 12, color: '#ff9ab2' },
  { label: t('dashboard.channels.referral'), value: 8, color: '#00b42a' },
])

const systemStatus: {
  key: string
  percent: number
  theme: 'primary' | 'sakura' | 'success' | 'warning' | 'danger' | 'notice'
}[] = [
  { key: 'fulfillment', percent: 92, theme: 'success' },
  { key: 'payment', percent: 96, theme: 'notice' },
  { key: 'delivery', percent: 88, theme: 'warning' },
  { key: 'stock', percent: 74, theme: 'primary' },
]

interface OrderRow {
  id: string
  customer: string
  date: string
  amount: number
  status: string
}

const recentOrders: OrderRow[] = [
  { id: '#PX-1024', customer: 'Alice Chen', date: '2026-08-07', amount: 1280, status: 'paid' },
  { id: '#PX-1023', customer: 'Bob Smith', date: '2026-08-07', amount: 560, status: 'pending' },
  { id: '#PX-1022', customer: 'Carol Lin', date: '2026-08-06', amount: 2450, status: 'shipped' },
  { id: '#PX-1021', customer: 'Dave Wu', date: '2026-08-06', amount: 320, status: 'delivered' },
  { id: '#PX-1020', customer: 'Eve Zhang', date: '2026-08-05', amount: 890, status: 'cancelled' },
]

const ORDER_THEME: Record<
  string,
  'success' | 'warning' | 'notice' | 'primary' | 'danger' | 'info'
> = {
  paid: 'success',
  pending: 'warning',
  shipped: 'notice',
  delivered: 'primary',
  cancelled: 'danger',
}

const recentOrderColumns = computed(() => [
  { key: 'id', label: t('orders.columns.id'), field: 'id' },
  { key: 'customer', label: t('orders.columns.customer'), field: 'customer' },
  { key: 'date', label: t('orders.columns.date'), field: 'date', width: 120 },
  {
    key: 'status',
    label: t('orders.columns.status'),
    field: 'status',
    width: 100,
    render: (arg: TableOptionsArg) =>
      h(
        Tag,
        { theme: ORDER_THEME[arg.record.status as string] ?? 'info', size: 'small' },
        () => t(`orders.status.${arg.record.status}`),
      ),
  },
  {
    key: 'amount',
    label: t('orders.columns.amount'),
    field: 'amount',
    width: 110,
    align: 'right',
    render: (arg: TableOptionsArg) => `$${(arg.record.amount as number).toLocaleString()}`,
  },
])

const todoItems = computed(() => [
  { title: t('dashboard.todo.reviewOrders'), mark: '08:30', theme: 'warning' },
  { title: t('dashboard.todo.replyMessages'), mark: '09:15', theme: 'notice' },
  { title: t('dashboard.todo.updateStock'), mark: '10:02', theme: 'success' },
  { title: t('dashboard.todo.confirmDelivery'), mark: '11:40', theme: 'primary' },
  { title: t('dashboard.todo.weeklyReport'), mark: '12:00', theme: 'sakura' },
])

const quickActions = computed(() => [
  { label: t('dashboard.quick.exportReport'), icon: IconDownload, theme: 'primary' },
  { label: t('dashboard.quick.addProduct'), icon: IconAddBox, theme: 'notice' },
  { label: t('dashboard.quick.inviteUser'), icon: IconUserPlus, theme: 'success' },
  { label: t('dashboard.quick.viewOrders'), icon: IconCart, theme: 'warning' },
])
</script>

<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h2 class="page-header__title">
          {{ t('dashboard.welcome') }}, Admin <span class="emoji">👾</span>
        </h2>
        <p class="page-header__subtitle">{{ t('dashboard.subtitle') }}</p>
      </div>
      <div class="page-header__actions">
        <px-tag theme="notice" shape="round">
          {{ t('dashboard.lastUpdated') }}: {{ lastUpdated }}
        </px-tag>
        <px-button theme="primary">
          <template #icon>
            <IconDownload />
          </template>
          {{ t('dashboard.quick.exportReport') }}
        </px-button>
      </div>
    </div>

    <div class="stat-grid">
      <StatCard
        :title="statUsers.title"
        :value="statUsers.value"
        :icon="IconUsers"
        :trend="statUsers.trend"
        :compare-text="t('dashboard.stats.weekly')"
      />
      <StatCard
        :title="statOrders.title"
        :value="statOrders.value"
        :icon="IconShoppingBag"
        theme="warning"
        :trend="statOrders.trend"
        :compare-text="t('dashboard.stats.weekly')"
      />
      <StatCard
        :title="statRevenue.title"
        :value="statRevenue.value"
        :icon="IconDollar"
        theme="success"
        :trend="statRevenue.trend"
        prefix="$"
        :compare-text="t('dashboard.stats.weekly')"
      />
      <StatCard
        :title="statConversion.title"
        :value="statConversion.value"
        :icon="IconChartBar"
        theme="sakura"
        :trend="statConversion.trend"
        suffix="%"
        :precision="1"
        :compare-text="t('dashboard.stats.weekly')"
      />
    </div>

    <div class="dash-grid">
      <px-card>
        <template #header>
          <div class="flex-between">
            <span class="card-title">{{ t('dashboard.revenue.title') }}</span>
            <px-radio-group
              v-model="revenueRange"
              :options="rangeOptions"
              variant="retro"
              size="small"
            />
          </div>
        </template>
        <EChartBar :data="revenueData" :height="240" />
      </px-card>

      <px-card>
        <template #header>
          <span class="card-title">{{ t('dashboard.channels.title') }}</span>
        </template>
        <EChartDonut :data="channelData" :height="240" />
      </px-card>

      <px-card>
        <template #header>
          <div class="flex-between">
            <span class="card-title">{{ t('dashboard.recentOrders.title') }}</span>
            <router-link to="/orders" class="view-all">{{ t('dashboard.recentOrders.viewAll') }}</router-link>
          </div>
        </template>
        <div class="table-wrap">
          <px-table
            :data="recentOrders"
            :columns="recentOrderColumns"
            :bordered="true"
            variant="striped"
            :pagination="false"
          />
        </div>
      </px-card>

      <px-card>
        <template #header>
          <span class="card-title">{{ t('dashboard.system.title') }}</span>
        </template>
        <div class="status-list">
          <div v-for="item in systemStatus" :key="item.key" class="status-row">
            <div class="flex-between">
              <span>{{ t(`dashboard.system.${item.key}`) }}</span>
              <span class="text-muted">{{ item.percent }}%</span>
            </div>
            <px-progress
              :percentage="item.percent"
              :theme="item.theme"
              variant="checkered"
            />
          </div>
        </div>
      </px-card>

      <px-card>
        <template #header>
          <span class="card-title">{{ t('dashboard.quick.title') }}</span>
        </template>
        <div class="quick-grid">
          <px-button
            v-for="action in quickActions"
            :key="action.label"
            :theme="action.theme"
            variant="outline"
            class="quick-btn"
          >
            <template #icon>
              <component :is="action.icon" />
            </template>
            {{ action.label }}
          </px-button>
        </div>
      </px-card>

      <px-card>
        <template #header>
          <span class="card-title">{{ t('dashboard.todo.title') }}</span>
        </template>
        <px-timeline>
          <px-timeline-item
            v-for="(item, i) in todoItems"
            :key="i"
            :mark="item.mark"
            :title="item.title"
            :theme="item.theme"
          />
        </px-timeline>
      </px-card>
    </div>
  </div>
</template>

<style scoped>
.card-title {
  font-size: 15px;
  font-weight: 700;
}

.dash-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 16px;
}

.dash-grid > * {
  min-width: 0;
}

@media (max-width: 1100px) {
  .dash-grid {
    grid-template-columns: minmax(0, 1fr);
  }
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

.quick-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.quick-btn {
  width: 100%;
}

.table-wrap {
  overflow: auto;
}

.view-all {
  color: var(--px-primary-6);
  font-size: 13px;
}

.view-all:hover {
  text-decoration: underline;
}

.emoji {
  font-family: initial;
}
</style>

