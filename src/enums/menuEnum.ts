/** 菜单显示模式 */
export enum MenuModeEnum {
  /** 垂直模式 */
  VERTICAL = "vertical",
  /** 水平模式 */
  HORIZONTAL = "horizontal",
  /** 垂直靠右模式 */
  VERTICAL_RIGHT = "vertical-right",
  /** 内嵌模式 */
  INLINE = "inline",
}

/** 菜单样式类型 */
export enum MenuTypeEnum {
  /** 左侧菜单，到顶 */
  SIDEBAR = 'sidebar',
  /** 顶部混合菜单模式 */
  MIX_SIDEBAR = 'mix-sidebar',
  /** 左侧菜单，不到顶 */
  MIX = 'mix',
  /** 顶部菜单 */
  TOP_MENU = 'top-menu',
}

/** 菜单展开按钮显示位置 */
export enum TriggerEnum {
  /** 不显示 */
  NONE = 'NONE',
  /** 菜单底部 */
  FOOTER = 'FOOTER',
  /** 头部 */
  HEADER = 'HEADER',
}

/** 菜单展开按钮触发方式 */
export enum MixSidebarTriggerEnum {
  HOVER = 'hover',
  CLICK = 'click',
}