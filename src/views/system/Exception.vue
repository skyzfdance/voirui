<template>
  <div class="exception-container">
    <div class="exception-content">
      <div class="exception-icon">{{ errorConfig[currentCode]?.icon }}</div>
      <h1 class="exception-title">{{ currentCode }}</h1>
      <p class="exception-desc">{{ errorConfig[currentCode]?.desc }}</p>
      <a-button type="primary" @click="goHome">返回首页</a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue"
import { useRouter, useRoute } from "vue-router"

const router = useRouter()
const route = useRoute()

// 错误码配置
const errorConfig: Record<string, { icon: string; desc: string }> = {
  '403': {
    icon: '🚫',
    desc: '抱歉，您没有权限访问此页面'
  },
  '404': {
    icon: '😕',
    desc: '抱歉，您访问的页面不存在'
  },
  '500': {
    icon: '💥',
    desc: '抱歉，服务器出错了'
  }
}

// 当前错误码
const currentCode = computed(() => {
  const code = route.params.code as string || '404'
  return code
})

// 返回首页
const goHome = () => {
  router.push('/')
}

onMounted(() => {
  // 可以在这里添加一些统计逻辑
  console.log(`Error Page: ${currentCode.value}`)
})
</script>

<style scoped lang="less">
.exception-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 200px);
  background-color: #fff;
}

.exception-content {
  text-align: center;
  padding: 48px;
  
  .exception-icon {
    font-size: 72px;
    margin-bottom: 24px;
  }
  
  .exception-title {
    font-size: 72px;
    font-weight: 600;
    color: #434e59;
    margin-bottom: 24px;
    line-height: 1;
  }
  
  .exception-desc {
    font-size: 20px;
    color: rgba(0, 0, 0, 0.45);
    margin-bottom: 40px;
  }
}
</style>
