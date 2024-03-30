/**
 * @file useLogin.ts
 * @module views/system/login/useLogin
 * @description login组件公共数据仓库
 */

import { type ComputedRef, computed, ref } from "vue"

/** 组件显示器 */
export enum LoginStateEnum {
  LOGIN, // 表单登录组件
  REGISTER, // 注册账号表单组件
  RESET_PASSWORD, // 重置密码表单组件
  MOBILE, // 手机登录组件
  QR_CODE, // 二维码登录组件
}

const currentState = ref(LoginStateEnum.LOGIN)

/**
 * 登录组件公共数据仓库
 * @returns 
 */
export function useLogin(): {
  setLoginState: (state: LoginStateEnum) => void
  getCurrentState: ComputedRef<LoginStateEnum>
  resetLoginState: () => void
} {
  function setLoginState(state: LoginStateEnum) {
    currentState.value = state
  }

  const getCurrentState = computed(() => currentState.value)

  function resetLoginState() {
    currentState.value = LoginStateEnum.LOGIN
  }

  return { setLoginState, getCurrentState, resetLoginState }
}
