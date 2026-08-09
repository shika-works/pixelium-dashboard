export interface ChartPalette {
  isDark: boolean
  barColor: string
  barBorder: string
  textColor: string
  axisColor: string
  bgColor: string
  titleColor: string
  tooltipBg: string
  tooltipBorder: string
}

export function getChartPalette(isDark: boolean): ChartPalette {
  return {
    isDark,
    barColor: isDark ? '#58b8a5' : '#00a891',
    barBorder: isDark ? '#0c0c0c' : '#323232',
    textColor: isDark ? '#b2b2b2' : '#969696',
    axisColor: isDark ? '#353535' : '#e6e6e6',
    bgColor: isDark ? '#0c0c0c' : '#ffffff',
    titleColor: isDark ? '#eaeaea' : '#323232',
    tooltipBg: isDark ? '#202020' : '#ffffff',
    tooltipBorder: isDark ? '#4c4c4c' : '#e6e6e6',
  }
}
