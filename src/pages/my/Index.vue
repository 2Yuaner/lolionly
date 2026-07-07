<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import bg1 from '@/assets/img/NR8AVjViQ1FBM05URXdNVGt5TkRVSW03dHBDb21iSkEhIQUAcXVuZ3o!.jpeg'
import bg2 from '@/assets/img/NR8AVjViQ1FBM05URXdNVGt5TkRVT203dHBWVkJ5SkEhIQUAcXVuZ3o!.jpeg'
import bg3 from '@/assets/img/NR8AVjViQ1FBM05URXdNVGt5TkRVTm03dHA2ODE4SkEhIQUAcXVuZ3o!.jpeg'
import bg4 from '@/assets/img/NR8AVjViQ1FBM05URXdNVGt5TkRVbm03dHBzVG11SlEhIQUAcXVuZ3o!.jpeg'
import bg5 from '@/assets/img/QQ20260319144034(83).jpeg'
import avatarImg from '@/assets/img/twicon-kotori.png'

// ====== 背景轮换 ======
const bgImages = [bg1, bg2, bg3, bg4, bg5]
const activeBgIndex = ref(0)
let bgTimer: ReturnType<typeof setInterval>

onMounted(() => {
  bgTimer = setInterval(() => {
    activeBgIndex.value = (activeBgIndex.value + 1) % bgImages.length
  }, 6000)
})
onUnmounted(() => clearInterval(bgTimer))

// ====== 飘落花瓣 ======
const petals = ref<{ id: number; left: number; fontSize: number; duration: number; delay: number; char: string }[]>([])
const petalChars = ['🌸', '💮', '🌺', '✿', '❀', '🌷', '🏵️']
let petalId = 0
let petalTimer: ReturnType<typeof setInterval>

function createPetal() {
  const id = ++petalId
  const p = {
    id,
    left: Math.random() * 100,
    fontSize: 16 + Math.random() * 24,
    duration: 8 + Math.random() * 10,
    delay: Math.random() * 3,
    char: petalChars[Math.floor(Math.random() * petalChars.length)],
  }
  petals.value.push(p)
  setTimeout(() => {
    petals.value = petals.value.filter((x) => x.id !== id)
  }, (p.duration + p.delay) * 1000 + 1000)
}

onMounted(() => {
  petalTimer = setInterval(createPetal, 2000)
  for (let i = 0; i < 5; i++) {
    setTimeout(createPetal, i * 600)
  }
})
onUnmounted(() => clearInterval(petalTimer))

// ====== Zerochan 画廊 ======
const zerochanImages = [
  'https://static.zerochan.net/Kanbe.Kotori.full.2808893.jpg',
  'https://static.zerochan.net/Kanbe.Kotori.full.635321.jpg',
  'https://static.zerochan.net/Kanbe.Kotori.full.212941.jpg',
  'https://static.zerochan.net/Kanbe.Kotori.full.611814.jpg',
  'https://static.zerochan.net/Kanbe.Kotori.full.3501798.png',
  'https://static.zerochan.net/Kanbe.Kotori.full.2808892.jpg',
  'https://static.zerochan.net/Kanbe.Kotori.full.61758.jpg',
  'https://static.zerochan.net/Kanbe.Kotori.full.2058345.jpg',
  'https://static.zerochan.net/Kanbe.Kotori.full.1018514.jpg',
  'https://static.zerochan.net/Kanbe.Kotori.full.2078875.jpg',
  'https://static.zerochan.net/Kanbe.Kotori.full.635318.jpg',
  'https://static.zerochan.net/Kanbe.Kotori.full.635324.jpg',
  'https://static.zerochan.net/Kanbe.Kotori.full.635327.jpg',
  'https://static.zerochan.net/Kanbe.Kotori.full.212944.jpg',
  'https://static.zerochan.net/Kanbe.Kotori.full.845026.jpg',
  'https://static.zerochan.net/Kanbe.Kotori.full.443879.jpg',
  'https://static.zerochan.net/Kanbe.Kotori.full.3501800.jpg',
  'https://static.zerochan.net/Kanbe.Kotori.full.483844.jpg',
  'https://static.zerochan.net/Kanbe.Kotori.full.1056520.jpg',
  'https://static.zerochan.net/Kanbe.Kotori.full.1207307.jpg',
  'https://static.zerochan.net/Kanbe.Kotori.full.1207311.jpg',
  'https://static.zerochan.net/Kanbe.Kotori.full.649242.jpg',
  'https://static.zerochan.net/Kanbe.Kotori.full.450086.jpg',
  'https://static.zerochan.net/Kanbe.Kotori.full.4309289.png',
  'https://static.zerochan.net/Kanbe.Kotori.full.649260.jpg',
  'https://static.zerochan.net/Kanbe.Kotori.full.649261.jpg',
  'https://static.zerochan.net/Kanbe.Kotori.full.2288946.jpg',
  'https://static.zerochan.net/Kanbe.Kotori.full.4309302.jpg',
  'https://static.zerochan.net/Kanbe.Kotori.full.649272.jpg',
  'https://static.zerochan.net/Kanbe.Kotori.full.55614.jpg',
  'https://static.zerochan.net/Kanbe.Kotori.full.1227870.jpg',
  'https://static.zerochan.net/Kanbe.Kotori.full.2810207.jpg',
  'https://static.zerochan.net/Kanbe.Kotori.full.2724965.png',
  'https://static.zerochan.net/Kanbe.Kotori.full.635316.jpg',
  'https://static.zerochan.net/Kanbe.Kotori.full.212936.jpg',
  'https://static.zerochan.net/Kanbe.Kotori.full.212947.jpg',
  'https://static.zerochan.net/Kanbe.Kotori.full.212958.jpg',
  'https://static.zerochan.net/Kanbe.Kotori.full.845025.jpg',
  'https://static.zerochan.net/Kanbe.Kotori.full.3501797.png',
  'https://static.zerochan.net/Kanbe.Kotori.full.1368569.jpg',
  'https://static.zerochan.net/Kanbe.Kotori.full.4697338.png',
  'https://static.zerochan.net/Kanbe.Kotori.full.222722.jpg',
  'https://static.zerochan.net/Kanbe.Kotori.full.690178.jpg',
  'https://static.zerochan.net/Kanbe.Kotori.full.2805525.jpg',
  'https://static.zerochan.net/Kanbe.Kotori.full.649246.jpg',
  'https://static.zerochan.net/Kanbe.Kotori.full.1927968.jpg',
  'https://static.zerochan.net/Kanbe.Kotori.full.649262.jpg',
  'https://static.zerochan.net/Kanbe.Kotori.full.4309296.png',
  'https://static.zerochan.net/Kanbe.Kotori.full.649269.jpg',
  'https://static.zerochan.net/Kanbe.Kotori.full.702520.jpg',
  'https://static.zerochan.net/Kanbe.Kotori.full.970044.jpg',
  'https://static.zerochan.net/Kanbe.Kotori.full.717399.jpg',
  'https://static.zerochan.net/Kanbe.Kotori.full.651358.jpg',
  'https://static.zerochan.net/Kanbe.Kotori.full.240747.jpg',
  'https://static.zerochan.net/Kanbe.Kotori.full.643694.jpg',
  'https://static.zerochan.net/Kanbe.Kotori.full.515448.jpg',
  'https://static.zerochan.net/Kanbe.Kotori.full.1357715.jpg',
  'https://static.zerochan.net/Kanbe.Kotori.full.4501687.png',
  'https://static.zerochan.net/Kanbe.Kotori.full.635326.jpg',
  'https://static.zerochan.net/Kanbe.Kotori.full.212933.jpg',
  'https://static.zerochan.net/Kanbe.Kotori.full.212939.jpg',
  'https://static.zerochan.net/Kanbe.Kotori.full.1489620.jpg',
  'https://static.zerochan.net/Kanbe.Kotori.full.1489626.jpg',
  'https://static.zerochan.net/Kanbe.Kotori.full.222714.jpg',
  'https://static.zerochan.net/Kanbe.Kotori.full.222716.jpg',
]

const BATCH = 12
const displayedCount = ref(0)
const loadedImages = ref<string[]>([])
const hasMore = ref(true)

function loadMore() {
  const end = Math.min(displayedCount.value + BATCH, zerochanImages.length)
  for (let i = displayedCount.value; i < end; i++) {
    loadedImages.value.push(zerochanImages[i])
  }
  displayedCount.value = end
  if (displayedCount.value >= zerochanImages.length) {
    hasMore.value = false
  }
}

// ====== 灯箱 ======
const lightboxVisible = ref(false)
const lightboxSrc = ref('')

function openLightbox(url: string) {
  lightboxSrc.value = url
  lightboxVisible.value = true
  document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  lightboxVisible.value = false
  document.body.style.overflow = ''
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') closeLightbox()
}

onMounted(() => {
  loadMore()
  document.addEventListener('keydown', onKeydown)
})
onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})

// ====== 图片加载失败隐藏 ======
function onImgError(e: Event) {
  const el = e.target as HTMLElement
  const parent = el.closest('.gallery-item') as HTMLElement | null
  if (parent) parent.style.display = 'none'
}
</script>

<template>
  <div class="my-page">
    <!-- 背景轮换 -->
    <div class="bg-container">
      <img
        v-for="(src, i) in bgImages"
        :key="i"
        :src="src"
        class="bg-image"
        :class="{ active: i === activeBgIndex }"
        alt=""
      />
    </div>

    <!-- 飘落花瓣 -->
    <span
      v-for="p in petals"
      :key="p.id"
      class="petal"
      :style="{
        left: p.left + '%',
        fontSize: p.fontSize + 'px',
        animationDuration: p.duration + 's',
        animationDelay: p.delay + 's',
      }"
    >{{ p.char }}</span>

    <!-- 公告条 -->
    <div class="announcement">
      <div class="announcement-inner">
        ✦ サイト工事中 ✦ 欢迎来到神户小鸟的爱的个人主页 ✦ このサイトは準備中です ✦ よろしくお願いします ✦
      </div>
    </div>

    <!-- 主容器 -->
    <div class="main-container">
      <!-- Header -->
      <div class="header">
        <div class="header-decoration">
          <span class="deco-line" />
          <span class="deco-diamond">◆</span>
          <span class="deco-line" />
        </div>
        <div class="avatar-wrapper">
          <img class="avatar" :src="avatarImg" alt="神户小鸟" />
        </div>
        <h1 class="site-title">神户小鸟的爱</h1>
        <p class="subtitle">ＫＯＢＥ ・ ＫＯＴＯＲＩ</p>
        <div class="status-badge">
          <span class="status-dot" />建设中...
        </div>
      </div>

      <!-- 关于我 -->
      <div class="card">
        <div class="card-title"><span class="icon">🌸</span> 关于我</div>
        <p class="about-text">
          这里是 <strong>神户小鸟的爱的</strong> 个人站点。<br />
          一个热爱二次元、编程和美好事物的地方。<br />
          サイトはまだまだ準備中ですが、ゆっくり見ていってくださいね ✨
        </p>
      </div>

      <!-- 兴趣爱好 -->
      <div class="card">
        <div class="card-title"><span class="icon">🎀</span> 兴趣爱好</div>
        <div class="tags">
          <span class="tag">动漫 Anime</span>
          <span class="tag">漫画 Manga</span>
          <span class="tag">游戏 Game</span>
          <span class="tag">编程 Coding</span>
          <span class="tag">音乐 Music</span>
          <span class="tag">绘画 Illust</span>
          <span class="tag">VOCALOID</span>
          <span class="tag">轻小说</span>
        </div>
      </div>

      <!-- 画廊 -->
      <div class="card">
        <div class="card-title"><span class="icon">🖼️</span> 图廊 ｜ Gallery</div>
        <p class="gallery-intro">
          Images from <a href="https://www.zerochan.net/" target="_blank" rel="noopener">Zerochan</a> — 点击图片查看大图
        </p>
        <div class="gallery">
          <div
            v-for="(url, i) in loadedImages"
            :key="i"
            class="gallery-item"
          >
            <span class="source-tag">Zerochan</span>
            <img :src="url" alt="神户小鸟" loading="lazy" @error="onImgError" @click="openLightbox(url)" />
            <div class="overlay">神户小鸟</div>
          </div>
        </div>
        <div class="load-more-wrap">
          <button class="load-more-btn" :disabled="!hasMore" @click="loadMore">
            {{ hasMore ? '加载更多' : '已全部加载' }}
          </button>
        </div>
      </div>

      <!-- 链接 -->
      <div class="card">
        <div class="card-title"><span class="icon">🔗</span> 链接</div>
        <div class="links-container">
          <a href="https://space.bilibili.com/49882167?spm_id_from=333.1007.0.0" target="_blank" rel="noopener" class="link-btn">📺 Bilibili</a>
          <a href="https://www.liblib.art/userpage/7ef147d5040b4a6e84fc286451070cdc/publisha" target="_blank" rel="noopener" class="link-btn">🎨 Liblib</a>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p>Made with <span class="heart">❤</span> by 神户小鸟 · 2026</p>
        <p class="footer-sub">Images courtesy of Zerochan.net</p>
        <p class="footer-icp">
          <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener">津ICP备2025036903号-1</a>
        </p>
      </div>
    </div>

    <!-- 灯箱 -->
    <Teleport to="body">
      <div v-if="lightboxVisible" class="lightbox" @click="closeLightbox">
        <span class="lightbox-close">&times;</span>
        <img :src="lightboxSrc" alt="" @click.stop />
      </div>
    </Teleport>

    <!-- 回到顶部 -->
    <a href="#" class="back-to-top" title="回到顶部">↑</a>
  </div>
</template>

<style scoped>
.my-page {
  font-family: 'Microsoft YaHei', 'Hiragino Sans GB', 'Noto Sans SC', sans-serif;
  background: #1a0a2e;
  color: #e0d0f0;
  overflow-x: hidden;
  min-height: 100vh;
  position: relative;
}

/* ====== 背景轮换 ====== */
.bg-container {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  z-index: -1;
}
.bg-container::before {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(10, 4, 30, 0.75);
  backdrop-filter: blur(3px);
  z-index: 1;
}
.bg-image {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 1.5s ease-in-out;
}
.bg-image.active { opacity: 1; }

/* ====== 飘落花瓣 ====== */
.petal {
  position: fixed;
  top: -60px;
  z-index: 999;
  pointer-events: none;
  animation: petal-fall linear forwards;
  opacity: 0.7;
}
@keyframes petal-fall {
  0%   { transform: translateY(0) rotate(0deg) scale(1); opacity: 0.9; }
  80%  { opacity: 0.6; }
  100% { transform: translateY(105vh) rotate(720deg) scale(0.3); opacity: 0; }
}

/* ====== 公告条 ====== */
.announcement {
  text-align: center;
  font-size: 0.9em;
  color: #b8a0d0;
  padding: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  letter-spacing: 2px;
  overflow: hidden;
  white-space: nowrap;
  position: relative;
  z-index: 1;
}
.announcement-inner {
  display: inline-block;
  animation: scroll-left 15s linear infinite;
}
@keyframes scroll-left {
  0%   { transform: translateX(60vw); }
  100% { transform: translateX(-100%); }
}

/* ====== 主容器 ====== */
.main-container {
  position: relative;
  z-index: 1;
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px 80px;
}

/* ====== Header ====== */
.header {
  text-align: center;
  padding: 60px 20px 40px;
  position: relative;
}
.header-decoration {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 24px;
}
.deco-line {
  width: 80px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #ff7eb3, transparent);
  border-radius: 2px;
  display: inline-block;
  flex-shrink: 0;
}
.deco-diamond {
  color: #ff7eb3;
  font-size: 12px;
  animation: diamond-pulse 2s ease-in-out infinite;
  flex-shrink: 0;
}
@keyframes diamond-pulse {
  0%, 100% { opacity: 0.4; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
}
.avatar-wrapper {
  display: inline-block;
  position: relative;
  border-radius: 50%;
  padding: 4px;
  background: linear-gradient(135deg, #ff7eb3, #ff758c, #c471ed, #12c2e9);
  background-size: 300% 300%;
  animation: rotate-border 4s ease infinite;
  box-shadow: 0 0 40px rgba(255, 126, 179, 0.4);
}
@keyframes rotate-border {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.avatar {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
  border: 3px solid rgba(255, 255, 255, 0.15);
}
.site-title {
  font-size: 2.4em;
  font-weight: 700;
  margin-top: 24px;
  background: linear-gradient(135deg, #ff7eb3, #c471ed, #12c2e9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 4px;
}
.subtitle {
  font-size: 0.95em;
  color: #b8a0d0;
  margin-top: 8px;
  letter-spacing: 6px;
}
.status-badge {
  display: inline-block;
  margin-top: 16px;
  padding: 6px 20px;
  border: 1px solid rgba(255, 126, 179, 0.4);
  border-radius: 20px;
  font-size: 0.85em;
  color: #ff7eb3;
  letter-spacing: 2px;
}
.status-dot {
  display: inline-block;
  width: 8px; height: 8px;
  border-radius: 50%;
  background: #ff7eb3;
  margin-right: 8px;
  animation: dot-pulse 1.5s ease-in-out infinite;
}
@keyframes dot-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.6); }
}

/* ====== 卡片 ====== */
.card {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 32px;
  margin-bottom: 28px;
  transition: border-color 0.4s, box-shadow 0.4s;
}
.card:hover {
  border-color: rgba(255, 126, 179, 0.25);
  box-shadow: 0 4px 30px rgba(255, 126, 179, 0.1);
}
.card-title {
  font-size: 1.3em;
  font-weight: 600;
  color: #ffb8d0;
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.card-title .icon { font-size: 1.2em; }

/* ====== 关于我 ====== */
.about-text {
  line-height: 2;
  color: #c8b8e0;
  font-size: 1.05em;
}
.about-text strong { color: #ff7eb3; }

/* ====== 兴趣标签 ====== */
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.tag {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.9em;
  border: 1px solid rgba(255, 126, 179, 0.3);
  color: #ffb0c8;
  background: rgba(255, 126, 179, 0.08);
  transition: all 0.3s;
}
.tag:hover {
  background: rgba(255, 126, 179, 0.18);
  border-color: #ff7eb3;
  transform: translateY(-2px);
}

/* ====== 画廊 ====== */
.gallery-intro {
  color: #8a7aa0;
  font-size: 0.85em;
  margin-bottom: 20px;
  letter-spacing: 1px;
}
.gallery-intro a { color: #ff7eb3; }
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}
.gallery-item {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 3 / 4;
  background: rgba(255, 255, 255, 0.03);
  cursor: pointer;
  transition: transform 0.4s, box-shadow 0.4s;
}
.gallery-item:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 12px 40px rgba(255, 126, 179, 0.25);
}
.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.6s;
}
.gallery-item:hover img { transform: scale(1.08); }
.gallery-item .overlay {
  position: absolute;
  bottom: 0; left: 0;
  width: 100%;
  padding: 16px 12px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.75));
  opacity: 0;
  transition: opacity 0.4s;
  color: #fff;
  font-size: 0.85em;
  letter-spacing: 1px;
}
.gallery-item:hover .overlay { opacity: 1; }
.source-tag {
  position: absolute;
  top: 10px; right: 10px;
  padding: 3px 10px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.6);
  color: #ffb8d0;
  font-size: 0.7em;
  letter-spacing: 1px;
  backdrop-filter: blur(4px);
  z-index: 1;
}

.load-more-wrap {
  text-align: center;
  margin-top: 20px;
}
.load-more-btn {
  padding: 12px 40px;
  border-radius: 25px;
  border: 1px solid rgba(255, 126, 179, 0.4);
  background: rgba(255, 126, 179, 0.1);
  color: #ffb8d0;
  font-size: 0.95em;
  cursor: pointer;
  letter-spacing: 2px;
  transition: all 0.3s;
}
.load-more-btn:hover {
  background: rgba(255, 126, 179, 0.22);
  border-color: #ff7eb3;
  box-shadow: 0 4px 20px rgba(255, 126, 179, 0.2);
}
.load-more-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  pointer-events: none;
}

/* ====== 链接 ====== */
.links-container {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  justify-content: center;
}
.link-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  border-radius: 25px;
  text-decoration: none;
  font-size: 0.95em;
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #d0c0e8;
  background: rgba(255, 255, 255, 0.04);
  transition: all 0.3s;
  letter-spacing: 1px;
}
.link-btn:hover {
  background: rgba(255, 126, 179, 0.12);
  border-color: rgba(255, 126, 179, 0.5);
  color: #ffb8d0;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 126, 179, 0.2);
}

/* ====== Footer ====== */
.footer {
  text-align: center;
  padding: 40px 20px;
  color: #6a5a80;
  font-size: 0.85em;
  letter-spacing: 2px;
}
.footer .heart { color: #ff7eb3; }
.footer-sub {
  font-size: 0.75em;
  margin-top: 4px;
}
.footer-icp {
  margin-top: 8px;
  font-size: 0.75em;
}
.footer-icp a {
  color: #6a5a80;
  text-decoration: none;
}

/* ====== 灯箱 ====== */
.lightbox {
  display: flex;
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.88);
  z-index: 10000;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.lightbox img {
  max-width: 90vw;
  max-height: 90vh;
  border-radius: 8px;
  box-shadow: 0 0 60px rgba(255, 126, 179, 0.3);
}
.lightbox-close {
  position: absolute;
  top: 20px; right: 30px;
  color: #fff;
  font-size: 2em;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.3s;
}
.lightbox-close:hover { opacity: 1; }

/* ====== 回到顶部 ====== */
.back-to-top {
  position: fixed;
  bottom: 30px; right: 30px;
  width: 44px; height: 44px;
  border-radius: 50%;
  background: rgba(255, 126, 179, 0.2);
  border: 1px solid rgba(255, 126, 179, 0.4);
  color: #ffb8d0;
  font-size: 1.3em;
  cursor: pointer;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  text-decoration: none;
}
.back-to-top:hover {
  background: rgba(255, 126, 179, 0.35);
  transform: translateY(-3px);
}

/* ====== 响应式 ====== */
@media (max-width: 600px) {
  .site-title { font-size: 1.6em; letter-spacing: 2px; }
  .avatar { width: 100px; height: 100px; }
  .card { padding: 20px 16px; }
  .gallery { grid-template-columns: repeat(2, 1fr); gap: 10px; }
}
</style>
