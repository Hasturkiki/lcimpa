<!-- 漏斗图 -->
<template>
  <div :id="id" :title="title" :class="className" :style="{ height, width }" />
</template>

<script setup lang="ts">
import {
  nextTick,
  onActivated,
  onBeforeUnmount,
  onDeactivated,
  onMounted, watch
} from 'vue';
import { init, EChartsOption } from 'echarts';
import resize from '@/utils/resize';

const props = defineProps({
  id: {
    type: String,
    default: 'funnelChart'
  },
  className: {
    type: String,
    default: ''
  },
  width: {
    type: String,
    default: '200px',
    required: true
  },
  height: {
    type: String,
    default: '200px',
    required: true
  },
  title: {
    type: String,
    default: '其它信息',
    required: true,
  }
});

const { mounted, chart, beforeDestroy, activated, deactivated } = resize();

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
  const funnelChart = init(document.getElementById(props.id) as HTMLDivElement);

  funnelChart.setOption({
    title: {
      show: true,
      text: props.title,
      x: 'center',
      padding: 15,
      textStyle: {
        fontSize: 18,
        fontStyle: 'normal',
        fontWeight: 'bold',
        color: '#337ecc'
      }
    },
    grid: {
      left: '2%',
      right: '2%',
      bottom: '10%',
      containLabel: true
    },
    legend: {
      x: 'center',
      y: 'bottom',
      data: ['Show', 'Click', 'Visit', 'Inquiry', 'Order']
    },

    series: [
      {
        name: 'Funnel',
        type: 'funnel',
        left: '20%',
        top: 60,
        bottom: 60,
        width: '60%',
        sort: 'descending',
        gap: 2,
        label: {
          show: true,
          position: 'inside'
        },
        labelLine: {
          length: 10,
          lineStyle: {
            width: 1,
            type: 'solid'
          }
        },
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 1
        },
        emphasis: {
          label: {
            fontSize: 20
          }
        },
        data: [
          { value: 60, name: 'Visit' },
          { value: 40, name: 'Inquiry' },
          { value: 20, name: 'Order' },
          { value: 80, name: 'Click' },
          { value: 100, name: 'Show' }
        ]
      }
    ]
  } as EChartsOption);
  chart.value = funnelChart;
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

<style lang="scss" scoped></style>
