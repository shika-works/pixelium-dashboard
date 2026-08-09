<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { IconDownload, IconSearch } from '@pixelium/web-vue/icon-pa/es'

interface OrderRow {
  key: number
  id: string
  customer: string
  date: string
  amount: number
  status: string
  payment: string
}

const { t } = useI18n()

const customers = [
  'Alice Chen', 'Bob Smith', 'Carol Lin', 'Dave Wu', 'Eve Zhang',
  'Frank Li', 'Grace Wang', 'Henry Zhao', 'Ivy Sun', 'Jack Ma',
  'Kate Liu', 'Leo Xu', 'Mia Huang', 'Nick Zhou', 'Olivia Tang',
]

const payments = ['alipay', 'wechat', 'card'] as const
const statuses = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'] as const

function generateOrders(count: number): OrderRow[] {
  const current = new Date('2026-08-07')
  return Array.from({ length: count }, (_, i) => {
    const date = new Date(current)
    date.setDate(date.getDate() - i)
    return {
      key: i + 1,
      id: `#PX-${1024 - i}`,
      customer: customers[i % customers.length],
      date: date.toISOString().slice(0, 10),
      amount: Math.round((Math.abs(Math.sin(i * 7.3)) * 2800 + 80) * 10) / 10,
      status: statuses[i % statuses.length],
      payment: payments[i % payments.length],
    }
  })
}

const orders = ref<OrderRow[]>(generateOrders(42))
const keyword = ref('')
const statusFilter = ref('all')
const page = ref(1)
const pageSize = ref(10)

const filteredOrders = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  return orders.value.filter((o) => {
    const matchKw = !kw || o.id.toLowerCase().includes(kw) || o.customer.toLowerCase().includes(kw)
    const matchStatus = statusFilter.value === 'all' || o.status === statusFilter.value
    return matchKw && matchStatus
  })
})

watch([keyword, statusFilter], () => {
  page.value = 1
})

const statusOptions = computed(() => [
  { label: t('common.all'), value: 'all' },
  { label: t('orders.status.pending'), value: 'pending' },
  { label: t('orders.status.paid'), value: 'paid' },
  { label: t('orders.status.shipped'), value: 'shipped' },
  { label: t('orders.status.delivered'), value: 'delivered' },
  { label: t('orders.status.cancelled'), value: 'cancelled' },
])

const STATUS_THEME: Record<string, 'warning' | 'success' | 'notice' | 'primary' | 'danger' | 'info'> = {
  pending: 'warning',
  paid: 'success',
  shipped: 'notice',
  delivered: 'primary',
  cancelled: 'danger',
}

const columns = computed(() => [
  { key: 'id', label: t('orders.columns.id'), field: 'id', width: 110 },
  { key: 'customer', label: t('orders.columns.customer'), field: 'customer', minWidth: 160 },
  { key: 'date', label: t('orders.columns.date'), field: 'date', width: 130 },
  { key: 'status', label: t('orders.columns.status'), slotName: 'status', width: 110 },
  { key: 'payment', label: t('orders.columns.payment'), slotName: 'payment', width: 120 },
  { key: 'amount', label: t('orders.columns.amount'), slotName: 'amount', width: 120, align: 'right' },
])

function formatAmount(value: number): string {
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
</script>

<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h2 class="page-header__title">{{ t('orders.title') }}</h2>
        <p class="page-header__subtitle">{{ t('orders.subtitle') }}</p>
      </div>
      <div class="page-header__actions">
        <px-tag theme="primary" shape="round">{{ t('orders.total') }}: {{ orders.length }}</px-tag>
        <px-button theme="primary">
          <template #icon>
            <IconDownload />
          </template>
          {{ t('dashboard.quick.exportReport') }}
        </px-button>
      </div>
    </div>

    <px-card>
      <div class="toolbar">
        <px-input
          v-model="keyword"
          class="toolbar-search"
          :placeholder="t('orders.searchPlaceholder')"
          clearable
        >
          <template #prefix>
            <IconSearch />
          </template>
        </px-input>
        <px-select v-model="statusFilter" :options="statusOptions" class="toolbar-select" />
      </div>

      <px-table
        :data="filteredOrders"
        :columns="columns"
        row-key="key"
        v-model:page="page"
        v-model:page-size="pageSize"
        :pagination="{ showTotal: true, showJumper: true, showSize: true }"
        variant="striped"
      >
        <template #status="{ record }">
          <px-tag :theme="STATUS_THEME[record.status] ?? 'info'" size="small" shape="round">
            {{ t(`orders.status.${record.status}`) }}
          </px-tag>
        </template>
        <template #payment="{ record }">
          <span>{{ t(`orders.payment.${record.payment}`) }}</span>
        </template>
        <template #amount="{ record }">
          <span class="amount-cell">{{ formatAmount(record.amount) }}</span>
        </template>
      </px-table>
    </px-card>
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.toolbar-search {
  width: 280px;
}

.toolbar-select {
  width: 150px;
}

.amount-cell {
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
</style>

