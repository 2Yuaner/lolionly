<script setup lang="ts">
import bgButtom from '@/assets/img/buttom/1782891811518.png'

function px(v: number | string) { return typeof v === 'number' ? v + 'px' : v }

withDefaults(defineProps<{
  top?: number | string
  right?: number | string
  bottom?: number | string
  left?: number | string
}>(), { top: 0, right: '20%', bottom: '10%', left: 0 })
</script>

<template>
  <div class="frame-container">
    <!-- 上边框 -->
    <div class="frame-top" :style="{ height: px(top) }">
      <div class="frame-corner frame-corner-tl" />
      <div class="frame-line-h">
        <div class="frame-slot">
          <slot name="top" />
        </div>
      </div>
      <div class="frame-corner frame-corner-tr" />
    </div>

    <!-- 中间区域 -->
    <div class="frame-middle">
      <!-- 左边框 -->
      <div class="frame-left" :style="{ width: px(left) }">
        <div class="frame-line-v">
          <div class="frame-slot">
            <slot name="left" />
          </div>
        </div>
      </div>

      <!-- 内容区 -->
      <div class="frame-content">
        <slot />
      </div>

      <!-- 右边框 -->
      <div class="frame-right" :style="{ width: px(right) }">
        <div class="frame-line-v">
          <div class="frame-slot">
            <slot name="right" />
          </div>
        </div>
      </div>
    </div>

    <!-- 下边框 -->
    <div class="frame-bottom" :style="{ height: px(bottom), '--bg-image': `url(${bgButtom})` }">
      <div class="frame-corner frame-corner-bl" />
      <div class="frame-bottom-inner">
        <!-- 内容槽位 -->
        <div class="frame-line-h">
          <div class="frame-slot">
            <slot name="bottom" />
          </div>
        </div>
      </div>
      <div class="frame-corner frame-corner-br" />
    </div>
  </div>
</template>

<style scoped>
.frame-container {
  position: relative;
  z-index: 10;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  pointer-events: none;
}

/* ====== 四边 ====== */
.frame-top,
.frame-bottom {
  display: flex;
  flex-shrink: 0;
}

.frame-bottom {
  position: relative;
  overflow: hidden;
}

.frame-bottom::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: var(--bg-image);
  background-repeat: repeat;
  background-size: auto 100%;
  background-position: center;
  opacity: 0.35;
  pointer-events: none;
  z-index: 0;
}

.frame-middle {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.frame-left,
.frame-right {
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
}

/* ====== 内容区 ====== */
.frame-content {
  flex: 1;
  overflow: hidden;
  pointer-events: auto;
  display: flex;
  flex-direction: column;
}

/* ====== 角落菱形装饰 ====== */
.frame-corner {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  background:
    linear-gradient(135deg, #f9a8d4 40%, transparent 40%),
    linear-gradient(225deg, #f9a8d4 40%, transparent 40%),
    linear-gradient(315deg, #f9a8d4 40%, transparent 40%),
    linear-gradient(45deg, #f9a8d4 40%, transparent 40%);
}

.frame-corner-tl { transform: rotate(0deg); }
.frame-corner-tr { transform: rotate(90deg); }
.frame-corner-bl { transform: rotate(-90deg); }
.frame-corner-br { transform: rotate(180deg); }

/* ====== 边框线 ====== */
.frame-line-h,
.frame-line-v {
  flex: 1;
  position: relative;
  pointer-events: auto;
  min-height: 0;
  overflow: hidden;
}

/* 内容槽位 */
.frame-slot {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: stretch;
  justify-content: flex-start;
}

/* 横线：画在外侧（紧贴内容区） */
.frame-line-h::after {
  content: '';
  position: absolute;
  left: -8px;
  right: -8px;
  height: 2px;
  background: linear-gradient(90deg,
      #f9a8d4 0%, #93c5fd 30%, #f9a8d4 70%, #93c5fd 100%);
  box-shadow: 0 0 6px rgba(249, 168, 212, 0.5);
}
.frame-top .frame-line-h::after { bottom: 0; }
.frame-bottom-inner .frame-line-h::after { top: 0; }

/* ====== 底部装饰区 ====== */
.frame-bottom-inner {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

/* 竖线 */
.frame-line-v::after {
  content: '';
  position: absolute;
  top: -8px;
  bottom: -8px;
  width: 2px;
  background: linear-gradient(180deg,
      #f9a8d4 0%, #93c5fd 30%, #f9a8d4 70%, #93c5fd 100%);
  box-shadow: 0 0 6px rgba(249, 168, 212, 0.5);
}
.frame-left .frame-line-v::after { right: 0; }
.frame-right .frame-line-v::after { left: 0; }
</style>
