import type { TableSetting, UserInfo } from "/#/store"
import type { ProjectConfig } from "/#/config"
import type { RouteLocationNormalized } from "vue-router"
import { DEFAULT_CACHE_TIME } from "/@/config/project"
import { Memory } from "./memory"
import {
  PROJ_CFG_KEY,
  ROLES_KEY,
  TOKEN_KEY,
  USER_INFO_KEY,
  MULTIPLE_TABS_KEY,
  TABLE_SETTING_KEY,
} from "/@/enums/cacheEnum"


interface BasicStore {
  [TOKEN_KEY]: string | number | null | undefined;
  [USER_INFO_KEY]: UserInfo;
  [ROLES_KEY]: string[];
  [PROJ_CFG_KEY]: ProjectConfig;
  [MULTIPLE_TABS_KEY]: RouteLocationNormalized[];
  [TABLE_SETTING_KEY]: Partial<TableSetting>;
}

type LocalStore = BasicStore;
type SessionStore = BasicStore;
export type BasicKeys = keyof BasicStore;
type LocalKeys = keyof LocalStore;
type SessionKeys = keyof SessionStore;

const localMemory = new Memory(DEFAULT_CACHE_TIME)
const sessionMemory = new Memory(DEFAULT_CACHE_TIME)

export class Persistent {
  static getLocal<T>(key: LocalKeys) {
    return localMemory.get(key)?.value as Nullable<T>
  }

}