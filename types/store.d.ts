/**
 * @file types/store.d.ts
 * @module types/store
 * @description 用于存储全局状态模型
 */

import { MenuModeEnum, MenuTypeEnum } from "/@/enums/menuEnum"
import { SizeType } from "/@/components/Table/types/table"

/** 迷你状态前置记录模型 */
export interface BeforeMiniState {
  menuCollapsed?: boolean;
  menuSplit?: boolean;
  menuMode?: MenuModeEnum;
  menuType?: MenuTypeEnum;
}

/**
 * 登录用户信息模型
 * @description 用于存储登录用户信息，只写入关键模型，其余信息可自行扩展，这里涉及到后端接口返回的数据模型，所以不做过多的定义
 */
export interface UserInfo {}


/** 站点信息模型 */
export interface SiteInfo {
  logo: string;
  siteName: string;
}

/** 表格组件工具栏配置模型 */
export interface TableSetting {
  size: Nullable<SizeType>;
  showIndexColumn: Nullable<boolean>;
  columns: Recordable<Nullable<Array<ColumnOptionsType>>>;
  showRowSelection: Nullable<boolean>;
}
