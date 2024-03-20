<template>
  <Teleport to="body">
    <Transition name="zoom-fade" mode="out-in">
      <div
        id="layout-header-search-modal"
        class="flex justify-center fixed z-[800] top-0 left-0 w-full h-full pt-14 bg-black/25"
        @click.stop
        v-if="visible"
      >
        <div class="relative w-[632px] mt-0 mx-auto mb-auto bg-white rounded-2xl shadow-2xl" ref="target">
          <div class="flex justify-between items-center pt-3.5 px-3.5 pb-0">
            <Input class="w-full h-12 rounded-md text-xl text-[#1c1e21]" placeholder="搜索" ref="inputRef" allow-clear @change="handleSearch">
              <template #prefix>
                <SearchOutlined />
              </template>
            </Input>
          </div>

          <div class="flex items-center justify-center w-full h-28 text-[#969faf]" v-show="getIsNotData">暂无搜索结果</div>

          <ul v-show="!getIsNotData" ref="scrollWrap" class="max-h-[472px] mx-auto my-0 px-3.5 pb-5 overflow-auto">
            <li
              v-for="(item, index) in searchResult"
              :key="item.path"
              :data-index="index"
              @mouseenter="handleMouseenter"
              @click="handleEnter"
              class="item search-modal-result-item"
              :class="{ active: activeIndex === index }"
            >
              <div class="ml-2">
                <Icon :icon="item.icon" class="text-xl" />
              </div>
              <div class="flex-1">{{ item.name }}</div>
              <div class="mr-2 opacity-0" :class="{ 'opacity-1': activeIndex === index }">
                <EnterOutlined class="text-xl" />
              </div>
            </li>
          </ul>

          <div
            class="flex relative items-center h-11 px-4 bg-white rounded-br-2xl rounded-bl-2xl text-xs text-gray-500 border-t border-t-gray-500/50"
          >
            <div class="footer-item">
              <EnterOutlined />
            </div>
            <span class="mr-3.5">确认</span>
            <div class="footer-item">
              <ArrowUpOutlined />
            </div>
            <div class="footer-item">
              <ArrowDownOutlined />
            </div>
            <span class="mr-3.5">切换</span>
            <div class="footer-item">
              <Icon icon="vaadin:esc-a" />
            </div>
            <span>关闭</span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
  import { Input } from "ant-design-vue"
  import { SearchOutlined, EnterOutlined, ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons-vue"
  import { computed, nextTick, ref, unref, watch } from "vue"
  import { useMenuSearch } from "./useMenuSearch"
  import { onClickOutside } from "@vueuse/core"
  import Icon from "/@/components/Icon/Icon.vue"
  import { onKeyStroke } from "@vueuse/core"

  defineOptions({ inheritAttrs: false, name: "LayoutHeaderSearchModal" })

  const props = defineProps({
    visible: { type: Boolean, default: false },
  })

  const emits = defineEmits(["close"])
  const inputRef = ref<Nullable<HTMLElement>>(null)
  const scrollWrap = ref<Nullable<HTMLElement>>(null)

  // 点击外部关闭
  const target = ref<Nullable<HTMLElement>>(null)
  onClickOutside(target, () => handleClose())

  const { handleSearch, keyword, searchResult, handleMouseenter, handleEnter, handleClose, activeIndex, handleUp, handleDown } = useMenuSearch(
    scrollWrap,
    emits,
  )

  const getIsNotData = computed(() => !unref(keyword) || !unref(searchResult).length)

  watch(
    () => props.visible,
    (val) => {
      val
        ? nextTick(() => {
            unref(inputRef)?.focus()
            createEvents()
          })
        : null
    },
  )

  /**
   * 创建键盘事件
   * @description 这玩意儿有问题，注册完了，没法销毁，所以只能在这里创建，只让他在这个组件内生效，等有空，还是自己写一个吧
   */
  function createEvents() {
    const target = document.querySelector("#layout-header-search-modal")
    if (!target) return

    // 注册键盘回车事件
    onKeyStroke("Enter", handleEnter, { dedupe: true, target })

    // 注册键盘方向 ↑ 键，选中上一个
    onKeyStroke("ArrowUp", handleUp, { target })

    // 注册键盘方向 ↓ 键，选中下一个
    onKeyStroke("ArrowDown", handleDown, { target })

    // 注册键盘ESC事件
    onKeyStroke("Escape", handleClose, { dedupe: true, target })
  }
</script>

<style lang="less" scoped>
  .zoom-fade-enter-active,
  .zoom-fade-leave-active {
    transition:
      transform 0.2s,
      opacity 0.3s ease-out;
  }

  .zoom-fade-enter-from {
    opacity: 0;
    transform: scale(0.92);
  }

  .zoom-fade-leave-to {
    opacity: 0;
    transform: scale(1.06);
  }

  .item {
    @apply flex items-center relative w-full h-14 mt-2 pb-1 pl-3 rounded bg-white cursor-pointer shadow text-black/80 text-sm;
    &.active {
      @apply bg-primary text-white;
    }
  }

  .footer-item {
    @apply flex items-center justify-center w-5 mr-1 rounded;
    padding-bottom: 2px;
    height: 18px;
    box-shadow:
      inset 0 -2px 0 0 #cdcde6,
      inset 0 0 1px 1px #fff,
      0 1px 2px 1px rgb(30 35 90 / 40%);
  }
</style>
