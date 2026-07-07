// ============================================================
// 视觉小说（Galgame）核心类型定义
// ============================================================

// ---------- 基础音频 ----------
export interface AudioInfo {
  /** 音频资源路径 */
  src: string
  /** 是否循环播放 */
  loop?: boolean
  /** 音量 0-1 */
  volume?: number
}

// ---------- 转场效果 ----------
export type TransitionEffect = 'fade' | 'slide' | 'dissolve' | 'none'

// ---------- 条件 / 剧情锁 ----------
export interface Condition {
  /** 条件类型 */
  type: 'flag' | 'variable' | 'affection'
  /** 变量名 */
  key: string
  /** 运算符 */
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte'
  /** 比较值 */
  value: string | number | boolean
}

// ---------- 剧情锁触发（节点进入时设置变量） ----------
export interface FlagEffect {
  /** 设置变量 */
  key: string
  /** 目标值 */
  value: string | number | boolean
}

// ---------- 角色定义 ----------
export interface CharacterDef {
  /** 角色唯一 ID */
  id: string
  /** 显示名称 */
  name: string
  /** 名字颜色（CSS 颜色值） */
  nameColor: string
  /** 模型类型 */
  modelType: 'live2d' | 'static'
  /** Live2D 模型路径（modelType === 'live2d' 时必填） */
  live2dModelPath?: string
  /** 静态图路径（modelType === 'static' 时必填） */
  staticImagePath?: string
  /** 表情映射：表情名 → 表情 key / 路径 */
  expressions: Record<string, string>
  /** 默认站位 */
  defaultPosition: 'left' | 'center' | 'right'
}

// ---------- 角色立绘状态 ----------
export interface CharacterPose {
  /** 对应 CharacterDef.id */
  characterId: string
  /** 站位 */
  position: 'left' | 'center' | 'right'
  /** 当前表情 key */
  expression: string
  /** 是否可见 */
  visible: boolean
}

// ---------- 发言者信息 ----------
export interface SpeakerInfo {
  /** 显示名称 */
  name: string
  /** 名字颜色（覆盖角色默认颜色） */
  color?: string
  /** 小头像（可选） */
  avatar?: string
  /** 对应角色 ID（用于高亮当前发言角色） */
  characterId?: string
}

// ---------- 节点边（连接下一个节点） ----------
export interface NovelEdge {
  /** 边 ID */
  id: string
  /** 边类型 */
  type: 'choice' | 'auto'
  /** 选项文本（choice 类型必填） */
  label?: string
  /** 目标节点 ID */
  target: string
  /** 条件列表：全部满足此边才可用 */
  conditions?: Condition[]
}

// ---------- 对话节点 ----------
export interface NovelNode {
  /** 节点唯一 ID */
  id: string
  /** 发言者（null 表示旁白） */
  speaker?: SpeakerInfo | null
  /** 对话文本 */
  text: string
  /** 背景 key / URL */
  background?: string
  /** 节点进入时的角色立绘状态 */
  characters?: CharacterPose[]
  /** 背景音乐 */
  bgm?: AudioInfo
  /** 音效（进入时播放一次） */
  sfx?: AudioInfo
  /** 转场效果 */
  transition?: TransitionEffect
  /** 进入此节点时触发的剧情锁变更 */
  onEnter?: FlagEffect[]
  /** 出边列表 */
  edges: NovelEdge[]
}

// ---------- 章节 ----------
export interface ChapterDef {
  /** 章节 ID */
  id: string
  /** 章节标题 */
  title: string
  /** 登场角色 */
  characters: CharacterDef[]
  /** 起始节点 ID */
  startNode: string
  /** 节点字典 */
  nodes: Record<string, NovelNode>
}

// ---------- 运行时状态 ----------
export interface GameState {
  /** 当前节点 ID */
  currentNodeId: string
  /** 剧情标记 / 变量 */
  flags: Record<string, string | number | boolean>
}
