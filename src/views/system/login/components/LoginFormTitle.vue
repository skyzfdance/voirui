<template>
  <h2 class="mb-3 text-2xl font-bold text-center xl:text-3xl xl:text-left enter-x dark:text-white">{{ getFormTitle }}</h2>
</template>

<script setup lang="ts">
  import { computed, unref } from "vue"
  import { LoginStateEnum, useLogin } from "../useLogin"

  const { getCurrentState } = useLogin()

  const TITLE_ENUM = {
    [LoginStateEnum.LOGIN]: "账号密码登录",
    [LoginStateEnum.REGISTER]: "账号密码注册",
    [LoginStateEnum.RESET_PASSWORD]: "忘记密码",
    [LoginStateEnum.MOBILE]: "手机验证码登录",
    [LoginStateEnum.QR_CODE]: "二维码登录",
  }
  const getFormTitle = computed(() => TITLE_ENUM[unref(getCurrentState)])
</script>
