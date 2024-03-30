<template>
  <div v-if="getShow">
    <LoginFormTitle />
    <div class="enter-x min-w-64 min-h-64 flex justify-center items-center">
      <QRCode :value="qrurl" :icon="defaultLogo" :status="status" :size="256" @refresh="onRefresh" />
    </div>
    <Divider class="enter-x">请使用XX软件扫码二维码后，按操作提示完成登录即可</Divider>
    <Button size="large" block class="mt-4 enter-x" @click="handleBackLogin">返回</Button>
  </div>
</template>

<script setup lang="ts">
  import LoginFormTitle from "./LoginFormTitle.vue"
  import { computed, ref, unref } from "vue"
  import { LoginStateEnum, useLogin } from "../useLogin"
  import { QRCode, Divider, Button } from "ant-design-vue"
  import defaultLogo from "/@/assets/images/logo.svg"

  const { getCurrentState, setLoginState } = useLogin()

  const qrurl = ref<string>("https://next.antdv.com/components/qrcode-cn")
  const status = ref<"active" | "loading" | "expired" | "scanned">("scanned")

  const getShow = computed(() => unref(getCurrentState) === LoginStateEnum.QR_CODE)

  function onRefresh() {
    console.log("onRefresh")
  }

  function handleBackLogin() {
    // TODO 停止定时器
    // TODO 重置二维码状态
    setLoginState(LoginStateEnum.LOGIN)
  }
</script>
