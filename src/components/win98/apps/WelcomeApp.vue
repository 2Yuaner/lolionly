<!-- 占位应用：欢迎窗口，可被外部替换 -->
<script setup lang="ts">
defineProps<{
  windowProps?: Record<string, unknown>
}>()
</script>

<template>
  <div class="welcome-app">
    <div class="welcome-banner">🖥️</div>
    <h1>欢迎使用 WinXP 桌面</h1>
    <p>双击桌面图标打开应用 · 点击任务栏切换窗口</p>
    <div class="welcome-links">
      <span>双击"我的电脑"查看系统信息</span>
      <span>双击"记事本"写点东西</span>
      <span>试试 Internet Explorer 打开网页</span>
    </div>
  </div>
</template>

<style scoped>
.welcome-app {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; height: 100%; padding: 32px;
  text-align: center; color: #3a3a3a;
}
.welcome-banner { font-size: 72px; margin-bottom: 16px; }
h1 { font-size: 22px; font-weight: 700; color: #1e3a8a; margin-bottom: 8px; }
p { font-size: 14px; color: #666; margin-bottom: 20px; }
.welcome-links { display: flex; flex-direction: column; gap: 6px; }
.welcome-links span {
  font-size: 13px; color: #3168d5; cursor: pointer; text-decoration: underline;
}
.welcome-links span:hover { color: #1e4db3; }
</style>
