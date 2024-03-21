/**
 * @file 项目配置模型
 * @module types/config
 * @description 项目配置模型
 */


import { RouterTransitionEnum, ThemeEnum } from "/@/enums/appEnum"
import { MenuModeEnum, MenuTypeEnum, MixSidebarTriggerEnum, TriggerEnum } from "/@/enums/menuEnum"

/** 头部配置模型 */
export interface HeaderSetting {
  bgColor: string;
  /** 是否固定头部 */
  fixed: boolean;
  show: boolean;
  theme: ThemeEnum;
  /** 是否显示全屏按钮 */
  showFullScreen: boolean;
  /** 是否显示锁定按钮 */
  useLockPage: boolean;
  /** 是否显示帮助中心按钮 */
  showDoc: boolean;
  /** 是否显示消息中心按钮 */
  showNotice: boolean;
  /** 是否显示菜单搜索按钮 */
  showSearch: boolean;
}

/** 菜单配置模型 */
export interface MenuSetting {
  bgColor: string;
  /** 是否固定菜单 */
  fixed: boolean;
  /** 是否折叠菜单 */
  collapsed: boolean;
  /** sidebar 菜单模式下，小屏幕尺寸，菜单是否隐藏，受程序控制，不受配置控制 */
  siderHidden: boolean;
  canDrag: boolean; // TODO 拖拽未实现,好像是一个废弃的功能
  show: boolean;
  hidden: boolean;  // TODO 这个东西好像没啥用
  /** 是否分类菜单，只在 mix-sidebar 模式下生效，其他模式默认 开启 */
  split: boolean;
  /** 菜单宽度 */
  menuWidth: number;
  mode: MenuModeEnum;
  type: MenuTypeEnum;
  theme: ThemeEnum;
  /** 菜单对齐方式，只在 top-menu 模式下生效，实际上没啥意义，正常情况应该全部左对齐 */
  topMenuAlign: "start" | "center" | "end"; // TODO 没有意义，后期删除
  trigger: TriggerEnum;
  /** 菜单展开是否开启 手风琴特效，只在 侧边栏菜单 生效 */
  accordion: boolean;
  /** 切换页面是否关闭混合菜单展开菜单 */
  closeMixSidebarOnChange: boolean;
  /** 菜单收缩状态下，是否显示菜单名 */
  collapsedShowTitle: boolean;
  mixSideTrigger: MixSidebarTriggerEnum;
  mixSideFixed: boolean;  // TODO 不知道这里实现了什么，具体逻辑需要看一眼
}

/** 页面切换动画配置模型 */
export interface TransitionSetting {
  /** 是否开启切换动画 */
  enable: boolean;
  basicTransition: RouterTransitionEnum;
  /** 是否打开页面切换loading */
  openPageLoading: boolean;
  /** 是否打开顶部进度条 */
  openNProgress: boolean; // TODO 建议移除，没有必要
}

/** 多标签页配置模型 */
export interface MultiTabsSetting {
  /** 是否开启多标签缓存，开启后多标签页会缓存一些信息，刷新后保留已打开的标签页 */
  cache: boolean;
  /** 是否显示多标签 */
  show: boolean;
  /** 是否显示快速操作,开启后会有一个快捷操作下拉列表 */
  showQuick: boolean;
  /** 标签页是否可拖拽 */
  canDrag: boolean;
  /** 是否显示刷新按钮 */
  showRedo: boolean;
  /** 是否显示折叠按钮 */
  showFold: boolean;  // TODO 不知道实现了什么，需要后补一下逻辑，看一下是否有必要
  /** 自动折叠 */
  autoCollapse: boolean; // TODO 好像没有实现，需要后补一下逻辑，看一下是否有必要
}


/** 项目配置模型 */
export interface ProjectConfig {
  headerSetting: HeaderSetting;
  menuSetting: MenuSetting;
  transitionSetting: TransitionSetting;
  multiTabsSetting: MultiTabsSetting;
}



