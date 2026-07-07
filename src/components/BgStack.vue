<script setup lang="ts">
import background1 from '@/assets/background/backgroud1.png'
import background2 from '@/assets/background/backgroud2.png'
import navBg from '@/assets/background/nav-bg.png'

interface NavItem {
  name: string
  url: string
}

interface Props {
  navItems?: NavItem[]
  hideBackground?: boolean
}

withDefaults(defineProps<Props>(), {
  navItems: () => [],
  hideBackground: false,
})
</script>

<template>
  <div class="bg-stack">
    <!-- 背景图层 -->
    <template v-if="!hideBackground">
      <img :src="background2" class="bg-layer bg-bottom" alt="background" />
      <img :src="background1" class="bg-layer bg-top" alt="background" />
    </template>

    <!-- 前景内容 -->
    <div class="bg-overlay">
      <!-- 导航列表槽位 -->
      <div v-if="(navItems.length > 0 || $slots.nav) && !hideBackground" class="bg-nav">
        <img :src="navBg" class="nav-bg-img" alt="nav background" />
        <ul class="nav-list">
          <li v-for="item in navItems" :key="item.url" class="nav-item">
            <router-link :to="item.url">{{ item.name }}</router-link>
          </li>
          <slot name="nav" />
        </ul>
      </div>
      <!-- 默认插槽（RouterView 等） -->
      <div class="bg-content">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-stack {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.bg-layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 100%;
}

.bg-bottom {
  z-index: 1;
}

.bg-top {
  z-index: 2;
}

.bg-overlay {
  position: relative;
  z-index: 10;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

/* 导航 —— 绝对定位悬浮在底部 */
.bg-nav {
  position: absolute;
  bottom: 10vh;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: auto;
  z-index: 20;
  width: clamp(300px, 80vw, 700px);
  display: flex;
  flex-direction: column;
  align-items: center;

  /* === 水面倒影 === */
  -webkit-box-reflect: below 6px
    linear-gradient(
      to bottom,
      transparent 0%,
      transparent 20%,
      rgba(0, 30, 60, 0.2) 55%,
      rgba(0, 30, 60, 0.5) 100%
    );
}

.nav-bg-img {
  width: clamp(200px, 55vw, 30vw);
  height: auto;
  display: block;
}

.nav-list {
  display: flex;
  gap: clamp(16px, 4vw, 40px);
  list-style: none;
  margin: 4px 0 0 0;
  padding: 0;
  justify-content: center;
  align-items: center;
}

/* === item 之间的分隔符 === */
.nav-item {
  display: flex;
  align-items: center;
}

.nav-item:not(:last-child)::after {
  content: '◆';
  color: rgba(255, 255, 255, 0.7);
  font-size: clamp(18px, 2.5vw, 26px);
  font-weight: bold;
  text-shadow:
    0 0 4px rgba(3, 232, 53, 0.8),
    0 0 8px rgba(0, 117, 235, 0.5);
  margin-left: clamp(16px, 4vw, 40px);
}

.nav-item a {
  color: #2ecc71;
  text-decoration: none;
  font-size: clamp(12px, 1.6vw, 16px);
  font-weight: 500;
  text-shadow:
    -1px -1px 0 #fff,
     1px -1px 0 #fff,
    -1px  1px 0 #fff,
     1px  1px 0 #fff,
    0 0 4px rgba(0, 150, 255, 0.9),
    0 0 8px rgba(0, 150, 255, 0.6),
    0 0 14px rgba(0, 150, 255, 0.4);
  transition: color 0.2s;
}

.nav-item a:hover {
  color: #f9a8d4;
}

/* 内容区 —— 占满全部空间 */
.bg-content {
  pointer-events: auto;
  width: 100%;
  height: 100%;
}
</style>
