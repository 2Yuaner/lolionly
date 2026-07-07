<script setup lang="ts">
defineProps<{
  icon: string
  label: string
}>()

const emit = defineEmits<{
  dblclick: []
}>()
</script>

<template>
  <div class="desktop-icon" @dblclick="emit('dblclick')">
    <div class="desktop-icon-img">
      <span class="desktop-icon-emoji">{{ icon }}</span>
    </div>
    <span class="desktop-icon-label">{{ label }}</span>
  </div>
</template>

<style scoped>
.desktop-icon {
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  width: 76px; padding: 8px 4px; border-radius: 8px;
  cursor: pointer; user-select: none; transition: background 0.1s;
}
.desktop-icon:hover { background: rgba(180,210,245,0.4); }
.desktop-icon:active { background: rgba(180,210,245,0.7); }

.desktop-icon-img {
  width: 48px; height: 48px;
  display: flex; align-items: center; justify-content: center;
}
.desktop-icon-emoji {
  font-size: 36px; line-height: 1;
  filter: drop-shadow(0 2px 2px rgba(0,0,0,0.3));
}

.desktop-icon-label {
  color: #fff; font-size: 12px;
  font-family: 'Tahoma', 'Microsoft YaHei', sans-serif;
  text-align: center; line-height: 1.3; word-break: break-all;
  text-shadow: 0 1px 2px rgba(0,0,0,0.8), 0 0 4px rgba(0,0,0,0.5);
}
</style>
