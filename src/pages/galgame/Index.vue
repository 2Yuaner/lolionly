<script setup lang="ts">
import BgStack from '@/components/BgStack.vue'

// galgame 子页面导航
const navItems = [
  { name: '开始游戏', url: '/galgame/play' },
  { name: '章节选择', url: '/galgame/chapters' },
  { name: '回想', url: '/galgame/gallery' },
]
</script>

<template>
  <BgStack :nav-items="navItems" :hide-background="$route.matched.length > 1">
    <RouterView v-slot="{ Component }">
      <div class="galgame-view">
        <component :is="Component" v-if="Component" />
        <div v-else class="home-content">
          <h1>神户小鸟的爱</h1>
          <p>ここは私の小さな世界</p>
        </div>
      </div>
    </RouterView>
  </BgStack>
</template>

<style scoped>
.galgame-view {
  width: 100%;
  height: 100%;
}

.home-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #fff;
  text-align: center;
  padding: 0 24px;
}

.home-content h1 {
  font-size: clamp(20px, 4vw, 36px);
  font-weight: 700;
  text-shadow:
    0 0 12px rgba(249, 168, 212, 0.8),
    0 0 24px rgba(147, 197, 253, 0.6),
    0 0 48px rgba(192, 132, 252, 0.4);
  margin-bottom: 12px;
}

.home-content p {
  font-size: clamp(14px, 2.5vw, 20px);
  color: rgba(255, 255, 255, 0.7);
  text-shadow: 0 0 8px rgba(147, 197, 253, 0.5);
}
</style>
