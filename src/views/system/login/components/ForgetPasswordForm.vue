<template>
  <div v-if="getShow">
    <LoginFormTitle />
    <Form class="p-4 enter-x" :model="formData" :rules="rules" @finish="handlereset">
      <FormItem name="account" class="enter-x">
        <Input v-model:value="formData.account" size="large" placeholder="请输入登录账户" />
      </FormItem>
      <FormItem name="mobile" class="enter-x">
        <Input v-model:value="formData.mobile" size="large" placeholder="请输入手机号码" />
      </FormItem>
      <FormItem name="sms" class="enter-x">
        <CountdownInput v-model:value="formData.sms" :params="getParams" size="large" placeholder="请输入验证码" />
      </FormItem>
      <Button type="primary" size="large" block class="enter-x" html-type="submit" :loading="loading">重置</Button>
      <Button size="large" block class="mt-4 enter-x" @click="setLoginState(LoginStateEnum.LOGIN)">返回</Button>
    </Form>
  </div>
</template>

<script setup lang="ts">
  import { type Rule } from "ant-design-vue/es/form/interface"
  import { computed, ref, unref } from "vue"
  import LoginFormTitle from "./LoginFormTitle.vue"
  import { LoginStateEnum, useLogin } from "../useLogin"
  import { Form, FormItem, Input, Button } from "ant-design-vue"
  import { CountdownInput } from "/@/components/Countdown"

  const { getCurrentState, setLoginState } = useLogin()

  const formData = ref({ account: "", mobile: "", sms: "" })
  const loading = ref(false)

  const getShow = computed(() => unref(getCurrentState) === LoginStateEnum.RESET_PASSWORD)

  const getParams = computed(() => {
    return unref(formData).mobile ? { mobile: unref(formData).mobile } : null
  })

  const rules: Record<string, Rule[]> = {
    account: [{ required: true, message: "请输入登录账户", trigger: "blur" }],
    mobile: [{ required: true, message: "请输入手机号码", trigger: "blur" }],
    sms: [{ required: true, message: "请输入验证码", trigger: "blur" }],
  }

  function handlereset() {
    console.log(1111)
  }
</script>
