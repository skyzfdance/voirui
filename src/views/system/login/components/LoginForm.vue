<template>
  <LoginFormTitle v-show="getShow" />
  <Form class="p-4 enter-x" v-show="getShow">
    <FormItem name="account" class="enter-x">
      <Input v-model:value="formData.account" size="large" placeholder="请输入登录账户" />
    </FormItem>
    <FormItem name="password" class="enter-x">
      <InputPassword v-model:value="formData.password" size="large" placeholder="请输入登录密码" visibility-toggle />
    </FormItem>

    <div class="flex justify-between mb-6 enter-x">
      <Checkbox v-model:checked="rememberMe">记住账号</Checkbox>
      <Button type="link" size="small" @click="setLoginState(LoginStateEnum.RESET_PASSWORD)">忘记密码？</Button>
    </div>

    <FormItem class="enter-x">
      <Button type="primary" size="large" block :loading="loading">登录</Button>
    </FormItem>

    <Row class="enter-x" :gutter="[16, 16]">
      <Col :md="8" :xs="24">
        <Button block @click="setLoginState(LoginStateEnum.MOBILE)">手机登录</Button>
      </Col>
      <Col :md="8" :xs="24">
        <Button block @click="setLoginState(LoginStateEnum.QR_CODE)">二维码登录</Button>
      </Col>
      <Col :md="8" :xs="24">
        <Button block @click="setLoginState(LoginStateEnum.REGISTER)">注册</Button>
      </Col>
    </Row>
  </Form>
</template>

<script setup lang="ts">
  import { computed, ref, unref } from "vue"
  import LoginFormTitle from "./LoginFormTitle.vue"
  import { LoginStateEnum, useLogin } from "../useLogin"
  import { Form, FormItem, Row, Col, Button, Input, InputPassword, Checkbox } from "ant-design-vue"

  const { getCurrentState, setLoginState } = useLogin()

  const formData = ref({ account: "", password: "" })
  const rememberMe = ref(false)
  const loading = ref(false)
  const getShow = computed(() => unref(getCurrentState) === LoginStateEnum.LOGIN)
</script>
