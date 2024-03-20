/**
 * @file 用户信息模块
 * @module store/user
 * @description 用户信息模块，存储用户信息、用户权限、用户设置等
 */

import { defineStore } from "pinia"
import { store } from ".."


interface UserState {
  // 用户信息
  userInfo: UserInfo;
  // 用户权限
  userAuths: string[];
  // 用户设置
  userSetting: UserSetting;

}

export const useUserStore = defineStore("app-user", {
  state: () => ({}),
  getters: {},
  actions: {},
})

export function useUserStoreWithOut() {
  return useUserStore(store)
}
