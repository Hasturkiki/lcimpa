<!-- 雷达图 -->
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
    default: 'radarChart'
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
    default: '业务总览',
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
  const radarChart = init(document.getElementById(props.id) as HTMLDivElement);
  radarChart.setOption({
    title: {
      show: true,
      text: props.title,
      x: 'center',
      padding: 15,
      textStyle: {
        fontSize: 18,
        fontStyle: 'normal',
        fontWeight: 'bold',
        color: '#37e'
      }
    },
    grid: {
      left: '2%',
      right: '2%',
      bottom: '12%',
      containLabel: true
    },
    legend: {
      x: 'center',
      y: 'bottom',
      data: ['业务总数', '进行中数量', '已完成数量']
    },
    radar: {
      radius: '52%',
      indicator: [
        {name: '食品饮料'},
        {name: '图书音像'},
        {name: '家居日用'},
        {name: '手机数码'},
        {name: '医药保健'}
      ]
    },
    series: [
      {
        name: 'Budget vs spending',
        type: 'radar',
        itemStyle: {
          borderRadius: 5,
          color: function (params: any) {
            //自定义颜色
            const colorList = ['#5af', '#7c1', '#ea1'];
            return colorList[params.dataIndex];
          }
        },
        data: [
          {
            value: [16, 9, 7, 16, 9],
            name: '业务总数'
          },
          {
            value: [4, 3, 3, 6, 3],
            name: '进行中数量'
          },
          {
            value: [12, 6, 4, 10, 6],
            name: '已完成数量'
          }
        ]
      }
    ]
  } as EChartsOption);
  chart.value = radarChart;
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
