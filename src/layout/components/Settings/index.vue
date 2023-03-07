<script setup lang="ts">
import { Sunny, Moon } from '@element-plus/icons-vue';
import { useSettingsStore } from '@/store/modules/settings';
import { useDark, useToggle } from '@vueuse/core';
import { onMounted } from 'vue';

const settingsStore = useSettingsStore();
const isDark = useDark();

function toggleTheme() {
  const isDark = useDark();
  useToggle(isDark);
}

onMounted(() => {
  window.document.body.setAttribute('layout', settingsStore.layout);
});

function changeLayout(layout: string) {
  settingsStore.changeSetting({ key: 'layout', value: layout });
  window.document.body.setAttribute('layout', settingsStore.layout);
}
</script>

<template>
  <div class="settings-container">
    <h3 class="text-base font-bold">{{ $t('settings.projectConfiguration') }}</h3>
    <el-divider />
    <div class="drawer-item">
      <span>{{ $t('settings.openTagsView') }}</span>
      <el-switch v-model="settingsStore.tagsView" class="drawer-switch" />
    </div>

    <div class="drawer-item">
      <span>{{ $t('settings.fixedHeader') }}</span>
      <el-switch v-model="settingsStore.fixedHeader" class="drawer-switch" />
    </div>

    <div class="drawer-item">
      <span>{{ $t('settings.sidebarLogo') }}</span>
      <el-switch v-model="settingsStore.sidebarLogo" class="drawer-switch" />
    </div>

    <el-divider>{{ $t('settings.theme') }}</el-divider>

    <div class="flex justify-center" @click.stop>
      <el-switch
        v-model="isDark"
        inline-prompt
        @change="toggleTheme"
        :active-icon="Sunny"
        :inactive-icon="Moon"
      />
    </div>

    <el-divider style="text-align: center">{{ $t('settings.navigationLayout') }}</el-divider>
    <ul class="layout">
      <el-tooltip :content="$t('settings.sideMode')" placement="bottom">
        <li
          :class="
            'layout-item layout-left ' +
            (settingsStore.layout === 'left' ? 'is-active' : '')
          "
          @click="changeLayout('left')"
        >
          <div />
          <div />
        </li>
      </el-tooltip>
      <el-tooltip :content="$t('settings.mixMode')" placement="bottom">
        <li
          :class="
            'layout-item layout-mix ' +
            (settingsStore.layout === 'mix' ? 'is-active' : '')
          "
          @click="changeLayout('mix')"
        >
          <div />
          <div />
        </li>
      </el-tooltip>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.settings-container {
  padding: 16px;
  font-size: 14px;

  .drawer-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    line-height: 22px;
  }

  .drawer-item {
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    padding: 12px 0;
  }

  .drawer-switch {
    float: right;
  }

  .layout {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    width: 100%;
    height: 50px;
    padding: 0;

    &-item {
      width: 18%;
      height: 45px;
      background: #f0f2f5;
      position: relative;
      overflow: hidden;
      cursor: pointer;
      border-radius: 4px;
    }
    &-item.is-active {
      border: 2px solid var(--el-color-primary);
    }
    &-left {
      div {
        &:nth-child(1) {
          width: 30%;
          height: 100%;
          background: #1b2a47;
        }

        &:nth-child(2) {
          width: 70%;
          height: 30%;
          top: 0;
          right: 0;
          background: #fff;
          box-shadow: 0 0 1px #888;
          position: absolute;
        }
      }
    }

    &-top {
      div {
        &:nth-child(1) {
          width: 100%;
          height: 30%;
          background: #1b2a47;
          box-shadow: 0 0 1px #888;
        }
      }
    }

    &-mix {
      div {
        &:nth-child(1) {
          width: 100%;
          height: 30%;
          background: #1b2a47;
          box-shadow: 0 0 1px #888;
        }

        &:nth-child(2) {
          width: 30%;
          height: 70%;
          bottom: 0;
          left: 0;
          background: #1b2a47;
          box-shadow: 0 0 1px #888;
          position: absolute;
        }
      }
    }
  }
}
</style>
