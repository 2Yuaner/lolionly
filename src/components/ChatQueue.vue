<script setup lang="ts">
import { ref, onUpdated } from 'vue'
import bgChat from '@/assets/img/buttom/1782893542243.png'

interface Message {
  id: string | number
  type: 'left' | 'right'
  avatar: string
  nickname: string
  content: string
}

interface Props {
  messages?: Message[]
  maxHeight?: string
}

const props = withDefaults(defineProps<Props>(), {
  messages: () => [],
  maxHeight: 'none',
})

// ====== 自动下滑 ======
const listRef = ref<HTMLDivElement>()
let lastLength = 0

onUpdated(() => {
  const el = listRef.value
  if (!el) return
  if (props.messages.length !== lastLength) {
    lastLength = props.messages.length
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }
})
</script>

<template>
  <div
    ref="listRef"
    class="chat-queue"
    :style="{ maxHeight }"
  >
    <!-- 背景图层 -->
    <div class="chat-bg" :style="{ backgroundImage: `url(${bgChat})` }" />
    <div
      v-for="msg in messages"
      :key="msg.id"
      class="chat-msg"
      :class="msg.type"
    >
      <img
        :src="msg.avatar"
        class="chat-avatar"
        alt="avatar"
      />
      <div class="chat-body">
        <span class="chat-nick">{{ msg.nickname }}</span>
        <div class="chat-bubble">
          {{ msg.content }}
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="messages.length === 0" class="chat-empty">
      <slot name="empty">暂无消息...</slot>
    </div>

    <!-- 槽位：追加自定义内容 -->
    <slot name="footer" />
  </div>
</template>

<style scoped>
.chat-queue {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  scrollbar-width: none;
  padding: 8px 4px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 12px;
  position: relative;
}
.chat-queue::-webkit-scrollbar { display: none; }

/* ====== 单条消息 ====== */
.chat-msg {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  max-width: 90%;
  z-index: 1;
  position: relative;
}

/* 左侧消息 */
.chat-msg.left {
  align-self: flex-start;
  flex-direction: row;
}
.chat-msg.left .chat-body {
  align-items: flex-start;
}
.chat-msg.left .chat-bubble {
  background: rgba(255, 255, 255, 0.85);
  color: #374151;
  border-radius: 4px 12px 12px 12px;
}

/* 右侧消息 */
.chat-msg.right {
  align-self: flex-end;
  flex-direction: row-reverse;
}
.chat-msg.right .chat-body {
  align-items: flex-end;
}
.chat-msg.right .chat-bubble {
  background: linear-gradient(135deg, #f9a8d4, #93c5fd);
  color: #fff;
  border-radius: 12px 4px 12px 12px;
}

/* ====== 头像 ====== */
.chat-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  flex-shrink: 0;
  border: 2px solid rgba(249, 168, 212, 0.6);
  object-fit: cover;
  box-shadow: 0 0 8px rgba(249, 168, 212, 0.3);
}

/* ====== 昵称 & 气泡 ====== */
.chat-body {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.chat-nick {
  font-size: 11px;
  color: #fff;
  background: #10b981;
  padding: 1px 8px;
  border-radius: 10px;
  display: inline-block;
}

.chat-bubble {
  padding: 8px 12px;
  font-size: 13px;
  line-height: 1.6;
  word-break: break-word;
  backdrop-filter: blur(4px);
}

/* ====== 空状态 ====== */
.chat-empty {
  text-align: center;
  color: rgba(255, 255, 255, 0.4);
  font-size: 13px;
  padding: 24px 0;
  z-index: 1;
  position: relative;
}
</style>
