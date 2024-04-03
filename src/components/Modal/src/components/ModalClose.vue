<template>
  <div :class="getClass" class="flex items-center h-[95%]">
    <template v-if="canFullscreen">
      <Tooltip title="还原" placement="bottom" v-if="fullScreen">
        <FullscreenExitOutlined role="full" @click="handleFullScreen" />
      </Tooltip>
      <Tooltip title="最大化" placement="bottom" v-else>
        <FullscreenOutlined role="close" @click="handleFullScreen" />
      </Tooltip>
    </template>

    <Tooltip title="关闭" placement="bottom">
      <CloseOutlined @click="handleCancel" />
    </Tooltip>
  </div>
</template>

<script setup lang="ts">
  import { computed } from "vue"

  import { Tooltip } from "ant-design-vue"
  import { FullscreenExitOutlined, FullscreenOutlined, CloseOutlined } from "@ant-design/icons-vue"
  import { buildClass } from "/@/hooks/useClass"

  defineOptions({ inheritAttrs: false, name: "ModalClose" })

  const props = defineProps({
    /** 是否支持全屏 */
    canFullscreen: { type: Boolean, default: true },
    /** 当前全屏状态 */
    fullScreen: { type: Boolean, default: false },
  })

  const emits = defineEmits(["cancel", "fullscreen"])

  const prefixCls = buildClass("basic-modal-close")

  const getClass = computed(() => {
    return [prefixCls, `${prefixCls}--custom`, { [`${prefixCls}--can-full`]: props.canFullscreen }]
  })

  function handleCancel(e: MouseEvent) {
    emits("cancel", e)
  }

  function handleFullScreen(e: MouseEvent) {
    e?.stopPropagation?.()
    e?.preventDefault?.()
    emits("fullscreen")
  }
</script>

<style lang="less">
  @prefix-cls: @ant-prefix;
  .@{prefix-cls}-basic-modal-close {
    > span {
      @apply ml-12;
      font-size: 16px;
    }

    &--can-full {
      > span {
        @apply ml-3;
      }
    }

    &:not(&--can-full) {
      > span:nth-child(1) {
        &:hover {
          @apply font-bold;
        }
      }
    }

    & span:nth-child(1) {
      @apply inline-block;
      padding: 10px;

      &:hover {
        @apply text-primary;
      }
    }

    & span:last-child {
      &:hover {
        @apply text-red-500;
      }
    }
  }
</style>
