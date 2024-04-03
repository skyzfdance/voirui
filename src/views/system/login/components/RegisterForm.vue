<template>
  <div v-if="getShow">
    <LoginFormTitle />
    <Form class="p-4 enter-x" :model="formData" :rules="rules" @finish="handleRegister">
      <FormItem name="account" class="enter-x">
        <Input v-model:value="formData.account" size="large" allowClear placeholder="请输入登录账户" />
      </FormItem>
      <FormItem name="mobile" class="enter-x">
        <Input v-model:value="formData.mobile" size="large" allowClear :maxlength="13" placeholder="请输入手机号码" />
      </FormItem>
      <FormItem name="sms" class="enter-x">
        <CountdownInput v-model:value="formData.sms" :params="getParams" size="large" placeholder="请输入验证码" />
      </FormItem>
      <FormItem name="password" class="enter-x">
        <InputPassword v-model:value="formData.password" size="large" allowClear placeholder="请输入登录密码" />
      </FormItem>
      <FormItem name="confirmPassword" class="enter-x">
        <InputPassword v-model:value="formData.confirmPassword" size="large" allowClear placeholder="请确认登录密码" />
      </FormItem>
      <FormItem class="enter-x" name="policy">
        <Checkbox v-model:checked="formData.policy" size="small">我已阅读并同意<a href="#">《隐私政策》</a></Checkbox>
      </FormItem>
      <Button type="primary" size="large" block class="enter-x" html-type="submit" :loading="loading">注册账户</Button>
      <Button size="large" block class="mt-4 enter-x" @click="setLoginState(LoginStateEnum.LOGIN)"> 返回 </Button>
    </Form>
  </div>
</template>

<script setup lang="ts">
  import { type Rule } from "ant-design-vue/es/form/interface"
  import { computed, ref, unref } from "vue"
  import LoginFormTitle from "./LoginFormTitle.vue"
  import { LoginStateEnum, useLogin } from "../useLogin"
  import { Form, FormItem, Input, InputPassword, Checkbox, Button } from "ant-design-vue"
  import { CountdownInput } from "/@/components/Countdown"

  const { getCurrentState, setLoginState } = useLogin()

  const formData = ref({ account: "", mobile: "", sms: "", password: "", confirmPassword: "", policy: false })
  const loading = ref(false)

  const getShow = computed(() => unref(getCurrentState) === LoginStateEnum.REGISTER)

  const getParams = computed(() => {
    return unref(formData).mobile ? { mobile: unref(formData).mobile } : null
  })

  const rules: Record<string, Rule[]> = {
    account: [{ required: true, message: "请输入登录账户", trigger: "blur" }],
    mobile: [{ required: true, message: "请输入手机号码", trigger: "blur" }],
    sms: [{ required: true, message: "请输入验证码", trigger: "blur" }],
    password: [{ required: true, message: "请输入登录密码", trigger: "blur" }],
    confirmPassword: [
      {
        validator: async (_, value) => {
          if (!value) return Promise.reject("请确认登录密码")
          if (value !== formData.value.password) return Promise.reject("两次输入密码不一致")
          return Promise.resolve()
        },
        trigger: "blur",
      },
    ],
    policy: [{ validator: async (_, value) => (value ? Promise.resolve() : Promise.reject("请同意隐私政策")), trigger: ["blur", "change"] }],
  }

  function handleRegister() {}
</script>