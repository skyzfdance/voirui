<template>
  <Tooltip :overlay-class-name="`${prefixCls}__warp`" :overlay-style="getOverlayStyle" :placement="placement">
    <template #title>
      <div :style="getTooltipStyle">
        <p v-for="(item, i) in titles" :key="i">
          <template v-if="showIndex">{{ i + 1 }}</template>
          {{ item }}
        </p>
      </div>
    </template>
    <span :class="prefixCls">
      <slot v-if="$slots.default"></slot>
      <InfoCircleOutlined v-else />
    </span>
  </Tooltip>
</template>

<script setup lang="ts">
  import type { TooltipPlacement } from "ant-design-vue/es/tooltip/Tooltip"
  import { type CSSProperties, computed, ref, onMounted } from "vue"
  import { PREFIX_CLS } from "/@/config/project"
  import { Tooltip } from "ant-design-vue"
  import { InfoCircleOutlined } from "@ant-design/icons-vue"
  import { isArray, isString } from "lodash-es"

  defineOptions({ inheritAttrs: false, name: "BasicHelp" })

  const props = defineProps({
    /** 提示文本 | 文本列表 */
    text: { type: [String, Array] as PropType<string | string[]>, default: "" },
    /** 提示位置 */
    placement: { type: String as PropType<TooltipPlacement>, default: "right" },
    /** 最大宽度 */
    maxWidth: { type: String, default: "600px" },
    /** 是否显示序号 */
    showIndex: { type: Boolean, default: false },
    /** 文字颜色 */
    color: { type: String, default: "#ffffff" },
    /** 字号大小 */
    fontSize: { type: String, default: "14px" },
  })

  const prefixCls = PREFIX_CLS + "-basic-help"

  const titles = ref<string[]>([])

  const getOverlayStyle = computed((): CSSProperties => ({ maxWidth: props.maxWidth }))

  const getTooltipStyle = computed((): CSSProperties => ({ color: props.color, fontSize: props.fontSize }))

  onMounted(() => {
    if (isString(props.text)) {
      titles.value = [props.text]
    } else if (isArray(props.text)) {
      titles.value = [...props.text]
    }
  })
</script>
