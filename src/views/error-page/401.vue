<!-- setup 无法设置组件名称，组件名称keepAlive必须 -->
<script lang="ts">
export default {
  name: 'Page401'
};
</script>

<script setup lang="ts">
import {reactive, toRefs} from 'vue';
import {useRouter} from 'vue-router';

const state = reactive({
  catGif: new URL(`../../assets/401_images/cat.gif`, import.meta.url),
});

const {catGif} = toRefs(state);

const router = useRouter();

function back() {
  router.back();
}
</script>

<template>
  <div class="errPage-container">
    <el-empty @click="back" description="401 Unauthorized 但是我们可以一起来看喵喵" image-size="420" :image=catGif style="position: relative; top: -100px">
    </el-empty>
  </div>
</template>

<style lang="scss" scoped>
.errPage-container {
  width: 800px;
  max-width: 100%;
  margin: 100px auto;

  .pan-back-btn {
    background: #008888;
    color: #ffeeee;
    border: none !important;
  }

  .backToHome {
    font-size: 14px;
    list-style: none;
    padding-bottom: 5px;

    a {
      color: #008489;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .text-jumbo {
    font-size: 52px;
    font-weight: 600;
    color: #424242;
  }

  .catIsWatchingYou {
    position: relative;
    width: 420px;
    height: 520px;
    top: -100px;
    //background-image: url("../../assets/401_images/cat.gif");
    //background-repeat: no-repeat;
  }
}
</style>
