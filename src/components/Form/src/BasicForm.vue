<template>
  <Form v-bind="sourceProps" :class="getFormClass" ref="formElRef" :model="formModel" @keydown.enter="handleEnterPress">
    <Row>
      <slot name="formHeader"></slot>
      <template v-for="schema in getSchema" :key="schema.name">
        <FormItem :schema="schema" />
      </template>
      <slot name="formFooter"></slot>
    </Row>
  </Form>
</template>

<script setup lang="ts">
  import { Form, Row, type FormProps as AntFormProps } from "ant-design-vue"
  import { basicProps, formProps } from "./props"
  import { computed, ref, type SetupContext, unref, useAttrs } from "vue"
  import type { SchemaProps } from "./types/props"
  import { buildClass } from "/@/hooks/useClass"

  import FormItem from "./components/FormItem.vue"

  defineOptions({ name: "BasicForm", inheritAttrs: false })

  const props = defineProps(basicProps)

  const emits = defineEmits(["register", "submit"])

  const attrs: SetupContext["attrs"] = useAttrs()
  const prefixCls = buildClass("basic-form")

  const formElRef = ref<InstanceType<typeof Form> | null>(null)
  const formModel = ref<Recordable>({})

  // 返回 整个 props,但是要排除 formProps的部分
  const sourceProps = computed((): AntFormProps => {
    return Object.keys(props).reduce((prev, key) => {
      if (!Object.keys(formProps).includes(key)) {
        prev[key] = props[key]
      }
      return prev
    }, {})
  })

  const getFormClass = computed(() => [prefixCls, { [`${prefixCls}-compact`]: unref(props).compact }])

  const getSchema = computed((): SchemaProps[] => {
    return unref(props).schemas || []
  })

  function handleEnterPress() {
    console.log("回车事件执行")
  }
</script>
