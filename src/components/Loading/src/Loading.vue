<template>
  <section
    class="full-loading"
    :class="{ absolute, [`${theme}`]: !!theme }"
    :style="[background ? `background-color: ${background}` : '']"
    v-show="loading"
  >
    <Spin :tip="tips" :size="size" :spinning="loading" />
  </section>
</template>

<script setup lang="ts">
  import { Spin } from "ant-design-vue"
  import { SizeEnum } from "/@/enums/sizeEnum"

  defineOptions({ name: "Loading", inheritAttrs: false })

  defineProps({
    tips: { type: String, default: "加载中..." },
    size: { type: String as PropType<SizeEnum>, default: SizeEnum.LARGE, validator: (val: SizeEnum) => Object.values(SizeEnum).includes(val) },
    absolute: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    background: { type: String, default: "rgba(0, 0, 0, 0.7)" },
    theme: { type: String, default: "light" },
  })
</script>

<style lang="less" scoped>
  .full-loading {
    display: flex;
    position: fixed;
    z-index: 200;
    top: 0;
    left: 0;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: rgb(240 242 245 / 40%);

    &.absolute {
      position: absolute;
      z-index: 300;
      top: 0;
      left: 0;
    }
  }

  html[data-theme="dark"] {
    .full-loading:not(.light) {
      background-color: rgba(111, 111, 111, 0.7);
    }
  }

  .full-loading.dark {
    background-color: rgba(111, 111, 111, 0.7);
  }
</style>
