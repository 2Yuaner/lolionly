<script setup lang="ts">
// 占位页面 - 后续实现
</script>

<template>
  <div class="placeholder-page">
    <slot>
      <p style="color: rgba(255,255,255,0.5); text-align: center; padding-top: 80px;">
        敬请期待...
      </p>
    </slot>
  </div>
</template>

<style scoped>
.placeholder-page {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}
</style>
