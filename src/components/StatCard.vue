<script setup lang="ts">
import type { Component } from 'vue'

type StatTheme = 'primary' | 'success' | 'warning' | 'danger' | 'notice' | 'sakura'

withDefaults(
  defineProps<{
    title: string
    value: number
    icon: Component
    theme?: StatTheme
    prefix?: string
    suffix?: string
    precision?: number
    trend?: number
    compareText?: string
    invertTrend?: boolean
  }>(),
  {
    theme: 'primary',
    prefix: '',
    suffix: '',
    precision: 0,
    trend: 0,
    compareText: '',
    invertTrend: false,
  },
)
</script>

<template>
  <px-card :class="`stat-card stat-card--${theme}`" :bordered="true" shape="rect">
    <div class="stat-card__body">
      <div class="stat-card__icon">
        <component :is="icon" />
      </div>
      <div class="stat-card__info">
        <div class="stat-card__title">{{ title }}</div>
        <div class="stat-card__value">
          <span v-if="prefix" class="stat-card__prefix">{{ prefix }}</span>
          <px-count-to
            :to="value"
            :precision="precision"
            :duration="1600"
            :separator="true"
          />
          <span v-if="suffix" class="stat-card__suffix">{{ suffix }}</span>
        </div>
        <div class="stat-card__footer">
          <px-tag
            :theme="
              invertTrend
                ? trend >= 0
                  ? 'danger'
                  : 'success'
                : trend >= 0
                  ? 'success'
                  : 'danger'
            "
            size="small"
            shape="round"
          >
            {{ trend >= 0 ? '+' : '' }}{{ trend }}%
          </px-tag>
          <span v-if="compareText" class="stat-card__compare">{{ compareText }}</span>
        </div>
      </div>
    </div>
  </px-card>
</template>

<style scoped>
.stat-card {
  --stat-color: var(--px-primary-6);
  --stat-soft: var(--px-primary-2);
  height: 100%;
}

.stat-card--success {
  --stat-color: var(--px-success-6);
  --stat-soft: var(--px-success-2);
}

.stat-card--warning {
  --stat-color: var(--px-warning-6);
  --stat-soft: var(--px-warning-2);
}

.stat-card--danger {
  --stat-color: var(--px-danger-6);
  --stat-soft: var(--px-danger-2);
}

.stat-card--notice {
  --stat-color: var(--px-notice-6);
  --stat-soft: var(--px-notice-2);
}

.stat-card--sakura {
  --stat-color: var(--px-sakura-6);
  --stat-soft: var(--px-sakura-2);
}

.stat-card__body {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.stat-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  background: var(--stat-soft);
  color: var(--stat-color);
  box-shadow: 4px 4px 0 var(--stat-color);
}

.stat-card__icon :deep(svg) {
  width: 24px;
  height: 24px;
}

.stat-card__info {
  min-width: 0;
}

.stat-card__title {
  font-size: 13px;
  color: var(--px-neutral-8);
}

.stat-card__value {
  margin-top: 6px;
  font-size: 26px;
  font-weight: 700;
  line-height: 1;
  color: var(--px-neutral-10);
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.stat-card__prefix,
.stat-card__suffix {
  font-size: 15px;
  color: var(--px-neutral-8);
}

.stat-card__footer {
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-card__compare {
  font-size: 12px;
  color: var(--px-neutral-8);
}
</style>
