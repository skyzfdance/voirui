<template>
  <LoginFormTitle v-show="getShow" />
  <Form class="p-4 enter-x" v-if="getShow" :model="formData" :rules="rules" @finish="handlelogin">
    <FormItem name="account" class="enter-x">
      <Input v-model:value="formData.account" size="large" allow-clear placeholder="请输入登录账户" />
    </FormItem>
    <FormItem name="password" class="enter-x">
      <InputPassword v-model:value="formData.password" size="large" allow-clear placeholder="请输入登录密码" visibility-toggle />
    </FormItem>

    <div class="flex justify-between mb-6 enter-x">
      <Checkbox v-model:checked="memory">记住账号</Checkbox>
      <Button type="link" size="small" @click="setLoginState(LoginStateEnum.RESET_PASSWORD)">忘记密码？</Button>
    </div>

    <FormItem class="enter-x">
      <Button type="primary" size="large" block html-type="submit" :loading="loading">登录</Button>
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
  import { type Rule } from "ant-design-vue/es/form/interface"
  import { computed, onMounted, ref, unref } from "vue"
  import LoginFormTitle from "./LoginFormTitle.vue"
  import { LoginStateEnum, useLogin } from "../useLogin"
  import { Form, FormItem, Row, Col, Button, Input, InputPassword, Checkbox } from "ant-design-vue"
  import { getCache, removeCache, setCache } from "/@/utils/cache"
  import { CacheTypeEnum } from "/@/enums/cacheEnum"
  import { isObject } from "lodash-es"

  const { getCurrentState, setLoginState } = useLogin()

  const formData = ref({ account: "", password: "" })
  const memory = ref(false)
  const loading = ref(false)
  const getShow = computed(() => unref(getCurrentState) === LoginStateEnum.LOGIN)

  const rules: Record<string, Rule[]> = {
    account: [{ required: true, message: "请输入登录账户", trigger: "blur" }],
    password: [{ required: true, message: "请输入登录账户", trigger: "blur" }],
  }

  onMounted(() => {
    const accountCache = getCache(CacheTypeEnum.MEMORY_ACCOUNT_KEY)
    if (accountCache && isObject(accountCache)) {
      for (const key in accountCache) {
        if (Object.prototype.hasOwnProperty.call(accountCache, key)) {
          const element = accountCache[key]
          formData.value[key] = element
        }
      }
      memory.value = Object.keys(accountCache).length > 0
    }
  })

  async function handlelogin() {
    try {
      loading.value = true
      // 记录账号 或者 删除记录
      unref(memory) ? setCache(CacheTypeEnum.MEMORY_ACCOUNT_KEY, { account: unref(formData).account }) : removeCache(CacheTypeEnum.MEMORY_ACCOUNT_KEY)
    } catch (error) {
      console.error("login error")
    } finally {
      loading.value = false
    }
  }
</script>
