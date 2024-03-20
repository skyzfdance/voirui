<template>
  <Dropdown placement="bottom">
    <div class="flex justify-end items-center cursor-pointer">
      <Avatar size="small" class="mr-2" />
      <span class="ml-2">admin</span>
    </div>
    <template #overlay>
      <Menu @click="handleMenuClick">
        <MenuItem key="doc">
          <template #icon><FileSearchOutlined /></template>帮助文档
        </MenuItem>
        <MenuItem key="passWord">
          <template #icon><LockOutlined /></template>修改密码
        </MenuItem>
        <MenuDivider />
        <MenuItem key="logout">
          <template #icon><LoginOutlined /></template>退出登录
        </MenuItem>
      </Menu>
    </template>
  </Dropdown>
</template>

<script setup lang="ts">
  import type { MenuInfo } from "ant-design-vue/lib/menu/src/interface"
  import { Dropdown, Avatar, Menu, MenuItem, MenuDivider } from "ant-design-vue"
  import { FileSearchOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons-vue"

  function handleMenuClick({ key }: MenuInfo) {
    console.log(key)
  }
</script>
