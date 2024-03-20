export type Key = string | number;


export interface MenuState {
  selectedKeys: Key[];
  openKeys: Key[];
}