<script setup lang="ts">
import { computed } from 'vue'

import { use } from 'echarts/core'
import { BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { EChartsOption } from 'echarts'

import VChart from 'vue-echarts'

import { useAppTheme } from '@/composables/useAppTheme'
import { getChartPalette } from '@/composables/chartPalette'

use([BarChart, GridComponent, TooltipComponent, CanvasRenderer])

interface BarDatum {
  label: string
  value: number
}

const props = withDefaults(
  defineProps<{
    data: BarDatum[]
    color?: string
    height?: number
  }>(),
  {
    color: '',
    height: 220,
  },
)

const { isDark } = useAppTheme()
const palette = computed(() => getChartPalette(isDark.value))

const option = computed<EChartsOption>(() => {
  const p = palette.value
  const barColor = props.color || p.barColor

  return {
    grid: { left: 8, right: 8, top: 24, bottom: 4, containLabel: true },
    tooltip: {
      trigger: 'axis',
      backgroundColor: p.tooltipBg,
      borderColor: p.tooltipBorder,
      borderWidth: 1,
      textStyle: { color: p.textColor, fontSize: 12 },
      formatter: (params: unknown) => {
        const list = (Array.isArray(params) ? params : [params]) as {
          name: string
          value: number
        }[]
        const item = list[0]
        return item
          ? `<b>${item.name}</b><br/>${Number(item.value).toLocaleString()}`
          : ''
      },
    },
    xAxis: {
      type: 'category',
      data: props.data.map((d) => d.label),
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
    series: [
      {
        name: 'value',
        type: 'bar',
        data: props.data.map((d) => d.value),
        barMaxWidth: 32,
        itemStyle: {
          color: barColor,
          borderColor: p.barBorder,
          borderWidth: 2,
          borderRadius: [2, 2, 0, 0],
        },
        emphasis: { focus: 'series' },
      },
    ],
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
