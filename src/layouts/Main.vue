<template>
  <Layout :class="`${PREFIX_CLS}-default-layout`" class="w-screen h-screen overflow-hidden">
    <Sider collapsible v-model:collapsed="collapsed" :trigger="null" :collapsed-width="48"><SiderLayout :collapsed="collapsed" /></Sider>
    <Layout :class="`${PREFIX_CLS}-main`">
      <Header><HeaderLayout :collapsed="collapsed" @change-collapsed="(flag: boolean) => (collapsed = flag)" /></Header>
      <Content>
        <ContentLayout />
      </Content>
    </Layout>
  </Layout>
</template>

<script setup lang="ts">
  import { Layout } from "ant-design-vue"
  import { PREFIX_CLS } from "/@/config/project"
  import SiderLayout from "./sider/index.vue"
  import HeaderLayout from "./header/index.vue"
  import ContentLayout from "./content/index.vue"
  import { ref } from "vue"

  const Sider = Layout.Sider
  const Header = Layout.Header
  const Content = Layout.Content

  defineOptions({ name: "DefaultLayoutMain" })

  const collapsed = ref<boolean>(false)
</script>

<style lang="less">
  @prefix-cls: @ant-prefix;

  .@{prefix-cls}-default-layout {
    .@{prefix-cls}-main {
      .@{prefix-cls}-layout-header {
        background-color: theme("colors.white");
        height: theme("height.12");
        line-height: theme("height.12");
        padding: 0;
      }
    }
  }
</style>
