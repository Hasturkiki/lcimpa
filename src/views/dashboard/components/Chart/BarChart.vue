<!--  线 + 柱混合图 -->
<template>
  <div :id="id" :title="title" :class="className" :style="{ height, width }"/>
</template>

<script setup lang="ts">
import {
  nextTick,
  onActivated,
  onBeforeUnmount,
  onDeactivated,
  onMounted,
  watch
} from 'vue';
import {init, EChartsOption} from 'echarts';
import * as echarts from 'echarts';
import resize from '@/utils/resize';

const props = defineProps({
  id: {
    type: String,
    default: 'barChart',
  },
  className: {
    type: String,
    default: '',
  },
  width: {
    type: String,
    default: '200px',
    required: true,
  },
  height: {
    type: String,
    default: '200px',
    required: true,
  },
  title: {
    type: String,
    default: '用户总览',
    required: true,
  }
});

const {mounted, chart, beforeDestroy, activated, deactivated} = resize();

const line = (newValue: string[]) => {
  const barChart = init(document.getElementById(props.id) as HTMLDivElement);
  barChart.setOption({
    title:{text:newValue[0]}
  })
  chart.value = barChart
}

watch(
  () => [props.title],
  (newValue, oldValue) => {
    if (newValue != oldValue) {
      setTimeout(() => {
        line(newValue)
      }, 100)
    }
  }
)

function initChart() {
  const barChart = init(document.getElementById(props.id) as HTMLDivElement);
  barChart.setOption({
    title: {
      show: true,
      text: props.title,
      x: 'center',
      padding: 15,
      textStyle: {
        fontSize: 18,
        fontStyle: 'normal',
        fontWeight: 'bold',
        color: '#1a1',
      },
    },
    grid: {
      left: '2%',
      right: '2%',
      bottom: '12%',
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#f55',
        },
      },
    },
    legend: {
      x: 'center',
      y: 'bottom',
      data: ['用户数', '业务成交量', '用户增长率', '业务增长率'],
    },
    xAxis: [
      {
        type: 'category',
        data: ['北京', '上海', '广州', '深圳'],
        axisPointer: {
          type: 'shadow',
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        min: 0,
        max: 50,
        interval: 10,
        axisLabel: {
          formatter: '{value} ',
        },
      },
      {
        type: 'value',
        min: 0,
        max: 100,
        interval: 20,
        axisLabel: {
          formatter: '{value}%',
        },
      },
    ],
    series: [
      {
        name: '用户数',
        type: 'bar',
        data: [42, 24, 36, 42],
        barWidth: 20,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {offset: 0, color: '#5df'},
            {offset: 0.5, color: '#57f'},
            {offset: 1, color: '#35c'},
          ]),
        },
      },
      {
        name: '业务成交量',
        type: 'bar',
        data: [44, 36, 42, 42],
        barWidth: 20,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {offset: 0, color: '#3fb'},
            {offset: 0.5, color: '#3e7'},
            {offset: 1, color: '#3c5'},
          ]),
        },
      },
      {
        name: '用户增长率',
        type: 'line',
        yAxisIndex: 1,
        data: [42, 36, 72, 60],
        itemStyle: {
          color: '#5ff',
        },
      },
      {
        name: '业务增长率',
        type: 'line',
        yAxisIndex: 1,
        data: [52, 42, 64, 64],
        itemStyle: {
          color: '#5f5',
        },
      },
    ],
  } as EChartsOption);
  chart.value = barChart;
}

onBeforeUnmount(() => {
  beforeDestroy();
});

onActivated(() => {
  activated();
});

onDeactivated(() => {
  deactivated();
});

onMounted(() => {
  mounted();
  nextTick(() => {
    initChart();
  });
});
</script>
