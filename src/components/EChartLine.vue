<script setup lang="ts">
import { computed } from 'vue'

import { use } from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { EChartsOption } from 'echarts'

import VChart from 'vue-echarts'

import { useAppTheme } from '@/composables/useAppTheme'
import { getChartPalette } from '@/composables/chartPalette'

use([LineChart, GridComponent, LegendComponent, TooltipComponent, CanvasRenderer])

export interface LineSeries {
  name: string
  color: string
  data: number[]
}

const props = withDefaults(
  defineProps<{
    series: LineSeries[]
    labels?: string[]
    height?: number
    step?: boolean
  }>(),
  {
    labels: () => [],
    height: 220,
    step: true,
  },
)

const { isDark } = useAppTheme()
const palette = computed(() => getChartPalette(isDark.value))

const categories = computed(() => {
  const count = Math.max(...props.series.map((s) => s.data.length), 0)
  return props.labels.length > 0
    ? props.labels
    : Array.from({ length: count }, (_, i) => String(i + 1))
})

const option = computed<EChartsOption>(() => {
  const p = palette.value

  return {
    grid: { left: 8, right: 8, top: 36, bottom: 4, containLabel: true },
    tooltip: {
      trigger: 'axis',
      backgroundColor: p.tooltipBg,
      borderColor: p.tooltipBorder,
      borderWidth: 1,
      textStyle: { color: p.textColor, fontSize: 12 },
    },
    legend: {
      top: 0,
      right: 0,
      icon: 'rect',
      itemWidth: 12,
      itemHeight: 12,
      textStyle: { color: p.textColor, fontSize: 12 },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: categories.value,
      axisLine: { lineStyle: { color: p.axisColor } },
      axisTick: { show: false },
      axisLabel: { color: p.textColor, fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: p.axisColor, type: 'dashed' } },
      axisLabel: { color: p.textColor, fontSize: 11 },
    },
    series: props.series.map((s) => ({
      name: s.name,
      type: 'line' as const,
      data: s.data,
      step: props.step ? ('end' as const) : false,
      smooth: false,
      showSymbol: true,
      symbolSize: 5,
      lineStyle: { width: 2, color: s.color },
      itemStyle: { color: s.color, borderColor: p.barBorder, borderWidth: 2 },
      areaStyle: { opacity: 0.12 },
    })),
  }
})
</script>

<template>
  <v-chart class="echart" :style="{ height: `${height}px` }" :option="option" autoresize />
</template>

<style scoped>
.echart {
  width: 100%;
}
</style>
