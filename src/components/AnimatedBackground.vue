<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const imageModules = import.meta.glob<{ default: string }>(
  '../assets/img/*.{jpeg,jpg,png}',
  { eager: true },
)
const allImages = Object.values(imageModules).map((m) => m.default)

const bottomImages = allImages.filter((_, i) => i % 2 === 0)
const starLayerSet = allImages.filter((_, i) => i % 2 === 1)
const starLayerImages = starLayerSet.length > 0 ? starLayerSet : allImages

const currentBottomIndex = ref(0)
const currentStarIndex = ref(0)

// ---------- Canvas ----------
const canvasRef = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let animId = 0
let canvasW = 0
let canvasH = 0

const loadedImages: HTMLImageElement[] = []

// 大颗下落星
interface Star {
  x: number
  y: number
  vx: number
  size: number
  speed: number
  rotation: number
  rotSpeed: number
  opacity: number
}

// 鼠标散发的小星
interface MouseStar {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  rotation: number
  rotSpeed: number
  life: number // 1→0，1 秒消散
}

const stars: Star[] = []
const mouseStars: MouseStar[] = []
let mouseX = -200
let mouseY = -200

function createStars(count: number) {
  stars.length = 0
  for (let i = 0; i < count; i++) {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.5 // 大致向下，略有左右
    const spd = 25 + Math.random() * 45
    stars.push({
      x: Math.random() * canvasW,
      y: Math.random() * canvasH,
      vx: Math.cos(angle) * spd,
      size: 12 + Math.random() * 28,
      speed: spd,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 2,
      opacity: 0.35 + Math.random() * 0.5,
    })
  }
}

// 樱花：5 片花瓣 + 花心
function sakuraPath(
  c: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  rot: number,
) {
  const petalCount = 5
  const petalLen = r * 0.72
  const petalW = r * 0.26

  c.beginPath()
  for (let i = 0; i < petalCount; i++) {
    const angle = (i / petalCount) * Math.PI * 2 - Math.PI / 2 + rot
    const px = cx + Math.cos(angle) * petalLen * 0.48
    const py = cy + Math.sin(angle) * petalLen * 0.48
    c.moveTo(px, py)
    c.ellipse(px, py, petalLen * 0.5, petalW, angle, 0, Math.PI * 2)
  }
}

function sakuraOutline(c: CanvasRenderingContext2D, cx: number, cy: number, r: number, rot: number) {
  sakuraPath(c, cx, cy, r, rot)
  c.lineJoin = 'round'
  c.lineWidth = 1.5
  c.stroke()
  // 花心小圆（空心）
  c.beginPath()
  c.arc(cx, cy, r * 0.1, 0, Math.PI * 2)
  c.stroke()
}

function drawCover(img: HTMLImageElement) {
  if (!ctx) return
  const iw = img.naturalWidth
  const ih = img.naturalHeight
  const scale = Math.max(canvasW / iw, canvasH / ih)
  const dw = iw * scale
  const dh = ih * scale
  const dx = (canvasW - dw) / 2
  const dy = (canvasH - dh) / 2
  ctx.drawImage(img, dx, dy, dw, dh)
}

let lastTime = 0

function frame(time: number) {
  if (!ctx) return
  const dt = Math.min((time - lastTime) / 1000, 0.1)
  lastTime = time

  const img = loadedImages[currentStarIndex.value]
  if (!img) {
    animId = requestAnimationFrame(frame)
    return
  }

  // 更新下落星
  for (const star of stars) {
    star.x += star.vx * dt
    star.y += star.speed * dt
    star.rotation += star.rotSpeed * dt
    if (star.y > canvasH + star.size) {
      star.y = -star.size
      star.x = Math.random() * canvasW
    }
    if (star.x < -star.size) star.x = canvasW + star.size
    if (star.x > canvasW + star.size) star.x = -star.size
  }

  // 更新鼠标星
  for (const ms of mouseStars) {
    ms.x += ms.vx * dt
    ms.y += ms.vy * dt
    ms.rotation += ms.rotSpeed * dt
    ms.life -= dt
  }
  // 移除已消散的
  for (let i = mouseStars.length - 1; i >= 0; i--) {
    if (mouseStars[i].life <= 0) mouseStars.splice(i, 1)
  }

  // ---------- 绘制 ----------
  ctx.clearRect(0, 0, canvasW, canvasH)

  // 大颗樱花：clip 显示第二图层
  for (const star of stars) {
    ctx.save()
    sakuraPath(ctx, star.x, star.y, star.size, star.rotation)
    ctx.clip()
    ctx.globalAlpha = star.opacity
    drawCover(img)
    ctx.restore()

    // 花瓣描边
    ctx.strokeStyle = 'rgba(255,255,255,0.12)'
    sakuraOutline(ctx, star.x, star.y, star.size, star.rotation)
  }

  // 鼠标樱花：clip 显示第二图层
  for (const ms of mouseStars) {
    const alpha = ms.life * ms.life * 0.75
    ctx.save()
    sakuraPath(ctx, ms.x, ms.y, ms.size, ms.rotation)
    ctx.clip()
    ctx.globalAlpha = alpha
    drawCover(img)
    ctx.restore()

    // 花瓣描边
    ctx.globalAlpha = alpha
    ctx.strokeStyle = '#f9a8d4'
    sakuraPath(ctx, ms.x, ms.y, ms.size, ms.rotation)
    ctx.lineJoin = 'round'
    ctx.lineWidth = 1.2
    ctx.stroke()
    // 小花心（空心）
    ctx.beginPath()
    ctx.arc(ms.x, ms.y, ms.size * 0.08, 0, Math.PI * 2)
    ctx.stroke()
    ctx.globalAlpha = 1
  }

  animId = requestAnimationFrame(frame)
}

function resizeCanvas() {
  const canvas = canvasRef.value
  if (!canvas) return
  canvasW = window.innerWidth
  canvasH = window.innerHeight
  canvas.width = canvasW * devicePixelRatio
  canvas.height = canvasH * devicePixelRatio
  canvas.style.width = canvasW + 'px'
  canvas.style.height = canvasH + 'px'
  ctx = canvas.getContext('2d')
  if (ctx) ctx.scale(devicePixelRatio, devicePixelRatio)
  for (const star of stars) {
    star.x = Math.random() * canvasW
    star.y = Math.random() * canvasH
  }
}

function spawnMouseStars() {
  const count = 1
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2
    const speed = 20 + Math.random() * 50
    mouseStars.push({
      x: mouseX,
      y: mouseY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 15,
      size: 10 + Math.random() * 14,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 3,
      life: 1,
    })
  }
}

let lastSpawnTime = 0
function onMouseMove(e: MouseEvent) {
  mouseX = e.clientX
  mouseY = e.clientY
  const now = performance.now()
  if (now - lastSpawnTime > 120) {
    lastSpawnTime = now
    spawnMouseStars()
  }
}

// 轮播 10s
let carouselTimer: ReturnType<typeof setInterval>

onMounted(async () => {
  for (const src of starLayerImages) {
    const img = new Image()
    img.src = src
    await new Promise<void>((resolve) => {
      img.onload = () => resolve()
      img.onerror = () => resolve()
    })
    loadedImages.push(img)
  }

  resizeCanvas()
  createStars(25)
  window.addEventListener('resize', resizeCanvas)
  window.addEventListener('mousemove', onMouseMove)

  carouselTimer = setInterval(() => {
    currentBottomIndex.value =
      (currentBottomIndex.value + 1) % bottomImages.length
    currentStarIndex.value =
      (currentStarIndex.value + 1) % starLayerImages.length
  }, 10_000)

  lastTime = performance.now()
  animId = requestAnimationFrame(frame)
})

onUnmounted(() => {
  cancelAnimationFrame(animId)
  clearInterval(carouselTimer)
  window.removeEventListener('resize', resizeCanvas)
  window.removeEventListener('mousemove', onMouseMove)
})

// 换图时不再重置星星，保持自然流动
</script>

<template>
  <div class="fixed inset-0 -z-10 overflow-hidden">
    <!-- 图层一：底层轮播 -->
    <div
      v-for="(img, index) in bottomImages"
      :key="'bg-' + index"
      class="absolute inset-0 bg-cover bg-center transition-opacity"
      :style="{
        backgroundImage: `url(${img})`,
        opacity: currentBottomIndex === index ? 1 : 0,
        transitionDuration: '2s',
      }"
    />

    <!-- 暗色遮罩 -->
    <div class="absolute inset-0 bg-black/30" />

    <!-- 图层二：Canvas — 樱花窗口 + 鼠标樱花 -->
    <canvas
      ref="canvasRef"
      class="absolute inset-0"
    />
  </div>
</template>
