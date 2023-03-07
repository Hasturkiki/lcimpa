<!-- 饼图 -->
<template>
  <div :id="id" :class="className" :style="{ height, width }"/>
</template>

<script setup lang="ts">
import {
  nextTick,
  onActivated,
  onBeforeUnmount,
  onDeactivated,
  onMounted, watch
} from 'vue';
import {init, EChartsOption} from 'echarts';
import resize from '@/utils/resize';

const props = defineProps({
  id: {
    type: String,
    default: 'pieChart'
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
    default: '货品总览',
    required: true,
  }
});

const {mounted, chart, beforeDestroy, activated, deactivated} = resize();

const line = (newValue: string[]) => {
  const barChart = init(document.getElementById(props.id) as HTMLDivElement);
  barChart.setOption({
    title: {text: newValue[0]}
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
  const pieChart = init(document.getElementById(props.id) as HTMLDivElement);

  pieChart.setOption({
    title: {
      show: true,
      text: props.title,
      x: 'center',
      padding: 15,
      textStyle: {
        fontSize: 18,
        fontStyle: 'normal',
        fontWeight: 'bold',
        color: '#11a'
      }
    },
    grid: {
      left: '2%',
      right: '2%',
      bottom: '12%',
      containLabel: true
    },
    legend: {
      top: 'bottom'
    },
    series: [
      {
        name: 'Nightingale Chart',
        type: 'pie',
        radius: [24, 100],
        center: ['50%', '50%'],
        roseType: 'radius',
        itemStyle: {
          borderRadius: 1,
          color: function (params: any) {
            //自定义颜色
            const colorList = [
              '#c91',
              '#9c1',
              '#fc7',
              '#36c',
              '#c9c'
            ];
            return colorList[params.dataIndex];
          }
        },
        data: [
          {value: 27, name: '食品饮料'},
          {value: 17, name: '图书音像'},
          {value: 16, name: '家居日用'},
          {value: 24, name: '电子产品'},
          {value: 16, name: '医药保健'}
        ]
      }
    ]
  } as EChartsOption);
  chart.value = pieChart;
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
