<script setup lang="ts">
import { computed } from 'vue'

import { use } from 'echarts/core'
import { PieChart } from 'echarts/charts'
import { GraphicComponent, LegendComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { EChartsOption } from 'echarts'

import VChart from 'vue-echarts'

import { useAppTheme } from '@/composables/useAppTheme'
import { getChartPalette } from '@/composables/chartPalette'

use([PieChart, GraphicComponent, LegendComponent, TooltipComponent, CanvasRenderer])

interface DonutDatum {
  label: string
  value: number
  color: string
}

const props = withDefaults(
  defineProps<{
    data: DonutDatum[]
    height?: number
  }>(),
  {
    height: 240,
  },
)

const { isDark } = useAppTheme()
const palette = computed(() => getChartPalette(isDark.value))

const total = computed(() => props.data.reduce((sum, d) => sum + d.value, 0))

const percentMap = computed(() => {
  const map = new Map<string, number>()
  for (const d of props.data) {
    map.set(d.label, Math.round((d.value / (total.value || 1)) * 100))
  }
  return map
})

const option = computed<EChartsOption>(() => {
  const p = palette.value

  return {
    tooltip: {
      trigger: 'item',
      backgroundColor: p.tooltipBg,
      borderColor: p.tooltipBorder,
      borderWidth: 1,
      textStyle: { color: p.textColor, fontSize: 12 },
      formatter: '{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      right: 8,
      top: 'middle',
      icon: 'rect',
      itemWidth: 12,
      itemHeight: 12,
      textStyle: { color: p.textColor, fontSize: 12 },
      formatter: (name: string) => `${name}  ${percentMap.value.get(name) ?? 0}%`,
    },
    graphic: [
      {
        type: 'text',
        left: 'center',
        top: 'middle',
        style: {
          text: total.value.toLocaleString(),
          textAlign: 'center',
          textVerticalAlign: 'middle',
          fontSize: 18,
          fontWeight: 700,
          fill: p.titleColor,
        },
      },
    ],
    series: [
      {
        type: 'pie',
        radius: ['55%', '78%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: true,
        label: { show: false },
        itemStyle: {
          borderColor: p.barBorder,
          borderWidth: 2,
          borderRadius: 0,
        },
        emphasis: {
          scaleSize: 4,
          label: { show: false },
        },
        data: props.data.map((d) => ({
          name: d.label,
          value: d.value,
          itemStyle: { color: d.color },
        })),
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
