<template>
  <div v-if="getShow">
    <LoginFormTitle />
    <Form class="p-4 enter-x">
      <FormItem name="account" class="enter-x">
        <Input v-model:value="formData.account" size="large" placeholder="请输入登录账户" />
      </FormItem>
      <FormItem name="mobile" class="enter-x">
        <Input v-model:value="formData.account" size="large" placeholder="请输入手机号码" />
      </FormItem>
      <FormItem name="sms" class="enter-x">
        <Input v-model:value="formData.account" size="large" placeholder="请输入登录账户" />
      </FormItem>
      <Button type="primary" size="large" block class="enter-x" :loading="loading">重置</Button>
      <Button size="large" block class="mt-4 enter-x" @click="setLoginState(LoginStateEnum.LOGIN)">返回</Button>
    </Form>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, unref } from "vue"
  import LoginFormTitle from "./LoginFormTitle.vue"
  import { LoginStateEnum, useLogin } from "../useLogin"
  import { Form, FormItem, Input, Button } from "ant-design-vue"

  const { getCurrentState, setLoginState } = useLogin()

  const formData = ref({ account: "", password: "", policy: false })
  const loading = ref(false)

  const getShow = computed(() => unref(getCurrentState) === LoginStateEnum.RESET_PASSWORD)
</script>
