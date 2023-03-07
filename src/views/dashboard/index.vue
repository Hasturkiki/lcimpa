<script lang="ts">
export default {name: 'Dashboard'};
</script>

<script setup lang="ts">
// 组件引用
import SvgIcon from '@/components/SvgIcon/index.vue';
import BarChart from './components/Chart/BarChart.vue';
import PieChart from './components/Chart/PieChart.vue';
import RadarChart from './components/Chart/RadarChart.vue';
import FunnelChart from "./components/Chart/FunnelChart.vue";

import userApi from '@/api/user'
import goodsApi from '@/api/goods'
import businessApi from '@/api/business'
import {
  reactive,
  onMounted
} from "vue";

const state = reactive({
  userTotal: 2023,
  goodsTotal: 2023,
  moneyTotal: 2023,
  businessTotal: 2023,
})

onMounted(() => {
  //  初始化首页数据
  userApi.listUserPages({
    pageNum: 1,
    pageSize: 1024,
    keywords: "",
    isEnabled: true,
    type: -1
  }).then(({data}) => {
    state.userTotal = data.total;
  });
  goodsApi.listGoodsPages({
    pageNum: 1,
    pageSize: 1024,
    keywords: "",
    ownerId: 0
  }).then(({data}) => {
    state.goodsTotal = data.total;
  });
  businessApi.listBusinessPages({
    pageNum: 1,
    pageSize: 1024,
    keywords: "",
    upId: 0,
    companyId: 0,
    state: -1
  }).then(({data}) => {
    state.businessTotal = data.total
    let businessList = data.list
    let moneyTotal = 0
    for (const business of businessList)
      moneyTotal += business.brokerage * 10000
    state.moneyTotal = moneyTotal / 10000
  });
})
</script>

<template>
  <div class="dashboard-container">
    <!-- 数据 -->
    <el-row :gutter="40" class="card-panel__col">
      <el-col :xs="24" :sm="12" :lg="6" class="card-panel__col">
        <el-link class="card-panel" href="#/user/index" :underline="false">
          <div class="card-panel-icon-wrapper icon-user">
            <svg-icon icon-class="userOverview" size="4em"/>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">{{ $t('dashboard.userTotal') }}</div>
            <div class="card-panel-num">{{ state.userTotal }}</div>
          </div>
        </el-link>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6" class="card-panel__col">
        <el-link class="card-panel" href="#/goods/index" :underline="false">
          <div class="card-panel-icon-wrapper icon-goods">
            <svg-icon icon-class="goodsOverview" size="4em"/>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">{{ $t('dashboard.goodsTotal') }}</div>
            <div class="card-panel-num">{{ state.goodsTotal }}</div>
          </div>
        </el-link>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6" class="card-panel__col">
        <el-link class="card-panel" href="#/business/index" :underline="false">
          <div class="card-panel-icon-wrapper icon-money">
            <svg-icon icon-class="money" size="4em"/>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">{{ $t('dashboard.moneyTotal') }}</div>
            <div class="card-panel-num">${{ state.moneyTotal.toFixed(2) }}</div>
          </div>
        </el-link>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6" class="card-panel__col">
        <el-link class="card-panel" href="#/business/index" :underline="false">
          <div class="card-panel-icon-wrapper icon-business">
            <svg-icon icon-class="businessOverview" size="4em"/>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">{{ $t('dashboard.businessTotal') }}</div>
            <div class="card-panel-num">{{ state.businessTotal }}</div>
          </div>
        </el-link>
      </el-col>
    </el-row>

    <!-- Echarts 图表 -->
    <el-row :gutter="42" style="margin-top: 20px">
      <el-col :xs="24" :sm="12" :lg="8" class="card-panel__col">
        <BarChart
          id="barChart"
          height="400px"
          width="400px"
          class="chart-container"
          :title="$t('barChart.title')"
        />
      </el-col>

      <el-col :xs="24" :sm="12" :lg="8" class="card-panel__col">
        <PieChart
          id="pieChart"
          height="400px"
          width="400px"
          class="chart-container"
          :title="$t('pieChart.title')"
        />
      </el-col>

      <el-col :xs="24" :sm="12" :lg="8" class="card-panel__col">
        <RadarChart
          id="radarChart"
          height="400px"
          width="400px"
          class="chart-container"
          :title="$t('radarChart.title')"
        />
      </el-col>

      <!-- 此处style用以隐藏元素同时避免eCharts错误 -->
      <el-col :xs="24" :sm="12" :lg="8" class="card-panel__col" style="visibility: hidden; max-height: 0">
        <FunnelChart
          id="funnelChart"
          height="400px"
          width="400px"
          class="chart-container"
          :title="$t('funnelChart.title')"
        />
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.dashboard-container {
  padding: 23.3px 37px 42px 37px;
  background-color: #fafafa;
  position: relative;
  min-height: 666px;

  .card-panel__col {
    margin-bottom: 23.3px;
  }

  .card-panel {
    height: 100px;
    width: 280px;
    cursor: pointer;
    font-size: 16px;
    position: relative;
    overflow: hidden;
    color: #aab;
    background: #fff9;
    box-shadow: 3px 3px 23.3px #7777;
    border-color: #123a;
    border-radius: 7px;
    display: block;

    :deep(.el-link__inner) {
      display: block;
    }

    .icon-user {
      color: #7e7;
    }

    .icon-goods {
      color: #77e;
    }

    .icon-money {
      color: #e77;
    }

    .icon-business {
      color: #48c;
    }

    &:hover {
      .card-panel-icon-wrapper {
        color: #777;
      }

      .icon-user {
        color: #3f3;
        background: #cfc;
      }

      .icon-goods {
        color: #33f;
        background: #ccf;
      }

      .icon-money {
        color: #f33;
        background: #fcc;
      }

      .icon-business {
        color: #18f;
        background: #777;
      }
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 9px 0 5px 13px;
      padding: 9px;
      transition: all 0.38s ease-out;
      border-radius: 1em;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px 20px 0;

      .card-panel-text {
        line-height: 18px;
        color: #114514;
        font-size: 18px;
        margin-bottom: 12px;
        text-align: center;
      }

      .card-panel-num {
        text-align: center;
        font-size: 20px;
      }
    }
  }

  .chart-container {
    background: #eeee;
  }
}
</style>
