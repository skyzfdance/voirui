<template>
  <div :class="prefixCls" class="h-full overflow-auto">
    <BackTop :target="getTarget" />
    <RouterView>
      <template #default="{ Component, route }">
        <Transition name="fade-slide" mode="out-in" appear>
          <KeepAlive v-if="openCache" :include="getCaches">
            <component :is="Component" :key="route.fullPath" />
          </KeepAlive>
          <component v-else :is="Component" :key="route.fullPath" />
        </Transition>
      </template>
    </RouterView>
  </div>
</template>

<script setup lang="ts">
  import { BackTop } from "ant-design-vue"
  import { PREFIX_CLS } from "/@/config/project"
  import { computed } from "vue"

  defineOptions({ inheritAttrs: false, name: "DefaultLayoutContent" })

  const prefixCls = `${PREFIX_CLS}-content`

  const openCache = false // TODO: 是否开启缓存

  // TODO: 获取缓存列表
  const getCaches = computed((): string[] => {
    return []
  })

  function getTarget() {
    return document.querySelector(`.${prefixCls}`) as HTMLElement
  }
</script>

<style lang="less" scoped>
  .fade-slide-leave-active,
  .fade-slide-enter-active {
    transition: all 0.3s;
  }

  .fade-slide-enter-from {
    opacity: 0;
    transform: translateX(-30px);
  }

  .fade-slide-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }
</style>
