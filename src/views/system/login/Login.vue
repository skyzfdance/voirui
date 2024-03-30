<template>
  <div :class="prefixCls">
    <div class="absolute right-4 top-4 z-10 enter-x">
      <AppDarkModeToggle />
    </div>

    <div class="-enter-x xl:hidden">
      <AppLogo always-show-title />
    </div>

    <div class="container relative h-full py-2 mx-auto sm:px-10">
      <div class="flex h-full">
        <div class="hidden min-h-full pl-4 mr-4 xl:flex xl:flex-col xl:w-6/12">
          <div class="-enter-x">
            <AppLogo />
          </div>
          <div class="my-auto">
            <img :alt="getTitle" :src="logoBoxBg" class="w-1/2 -mt-16 -enter-x" />
            <div class="mt-10 font-medium text-white -enter-x">
              <span class="inline-block mt-4 text-3xl">{{ getTitle }}-后台管理系统</span>
            </div>
            <div class="mt-5 font-normal text-white dark:text-gray-500 -enter-x">输入您的个人详细信息开始使用！</div>
          </div>
        </div>

        <div class="flex w-full h-full py-5 xl:h-auto xl:py-0 xl:my-0 xl:w-6/12">
          <div :class="`${prefixCls}-form`" class="enter-x">
            <LoginForm />
            <RegisterForm />
            <ForgetPasswordForm />
            <MobileForm />
            <QrCodeForm />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import AppLogo from "/@/components/Application/AppLogo.vue"
  import AppDarkModeToggle from "/@/components/Application/AppDarkModeToggle.vue"
  import { buildClass } from "/@/hooks/useClass"
  import { computed } from "vue"
  import { useAppStore } from "/@/stores/modules/app"
  import logoBoxBg from "/@/assets/images/login-box-bg.svg"
  import { createAsyncComponent } from "/@/utils/createAsyncComponent"

  import LoginForm from "./components/LoginForm.vue"

  const RegisterForm = createAsyncComponent(() => import("./components/RegisterForm.vue"), { loading: false })
  const ForgetPasswordForm = createAsyncComponent(() => import("./components/ForgetPasswordForm.vue"), { loading: false })
  const MobileForm = createAsyncComponent(() => import("./components/MobileForm.vue"), { loading: false })
  const QrCodeForm = createAsyncComponent(() => import("./components/QrCodeForm.vue"), { loading: false })

  const prefixCls = buildClass("login")
  const appStore = useAppStore()

  const getTitle = computed(() => appStore.getSiteInfo?.siteName ?? import.meta.env.VITE_APP_TITLE)
</script>

<style lang="less">
  @import "/@/assets/less/entry.less";
  @prefix-cls: @ant-prefix;
  html[data-theme="dark"] {
    .@{prefix-cls}-login {
      @apply bg-slate-800;

      &:before {
        background-image: url("/@/assets/images/login-bg-dark.svg");
      }
    }
  }
  .@{prefix-cls}-login {
    @apply relative w-full h-full px-4 overflow-hidden;
    @media (max-width: 1280px) {
      @apply bg-slate-800;
      .@{prefix-cls}-login-form {
        @apply bg-white;
      }
    }
    &:before {
      content: "";
      @apply absolute top-0 left-0 w-full h-full bg-no-repeat;
      background-image: url("/@/assets/images/login-bg.svg");
      background-position: 100%;
      background-size: auto 100%;
      margin-left: -48%;
      @media (max-width: 1280px) {
        @apply hidden;
      }
    }

    .@{prefix-cls}-app-logo {
      @apply absolute top-3 h-8;
      &-title {
        @apply text-white text-base;
      }
      img {
        @apply w-8;
      }
    }

    .container {
      .@{prefix-cls}-app-logo {
        @apply flex h-20 w-2/3;

        &-title {
          @apply text-white text-2xl;
        }
        img {
          @apply w-12;
        }
      }
    }

    &-form {
      @apply relative w-full px-5 py-8 mx-auto my-auto rounded-md shadow-md xl:ml-16 xl:bg-transparent sm:px-8 xl:p-4 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-2/3;
    }
  }
</style>
