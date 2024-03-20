<template>
  <span :class="[`${PREFIX_CLS}-basic-menu-item-content`, { ' justify-center': collapsed }]" class="flex items-center h-full">
    <Icon v-if="getIcon" :icon="getIcon" class="mr-2" :class="`${PREFIX_CLS}-basic-menu-item-content-wrapper__icon`" />
    <template v-if="!collapsed">{{ getName }}</template>
  </span>
</template>

<script setup lang="ts">
  import { PREFIX_CLS } from "/@/config/project"
  import Icon from "/@/components/Icon/Icon.vue"
  import { MergedRoute } from "/@/router/types"
  import { computed } from "vue"

  defineOptions({ inheritAttrs: false, name: "MenuItemContent" })

  const props = defineProps({
    item: {
      type: Object as PropType<MergedRoute>,
      default: () => ({}),
    },
    collapsed: { type: Boolean, default: false },
  })

  const getIcon = computed(() => {
    return props.item?.meta?.icon
  })

  const getName = computed(() => {
    return props.item?.meta?.title
  })
</script>
