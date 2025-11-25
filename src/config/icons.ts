// 现代化图标系统
export const icons = {
  // 主要功能图标
  home: '⌂',
  chef: '◉',
  food: '◈',
  ingredient: '◆',
  recipe: '◐',
  favorite: '♥',
  search: '◎',
  settings: '⚙',
  
  // 菜系图标（更统一的风格）
  chinese: '◈',
  japanese: '◇',
  western: '◈',
  korean: '◈',
  thai: '◊',
  italian: '◈',
  french: '◇',
  indian: '◆',
  
  // 食材类别图标
  vegetables: '◆',
  meat: '◉',
  seafood: '◊',
  grains: '◈',
  dairy: '◇',
  fruits: '◐',
  spices: '◑',
  
  // 状态图标
  loading: '⏳',
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️',
  
  // 操作图标
  add: '➕',
  remove: '➖',
  edit: '✏️',
  delete: '🗑️',
  share: '📤',
  download: '⬇️',
  upload: '⬆️',
  
  // 特殊功能图标
  dice: '⚄',
  magic: '✦',
  fortune: '◉',
  community: '◎',
  gallery: '◫',
  sauce: '◈',
  
  // 情感图标
  happy: '◡',
  love: '♥',
  thinking: '◔',
  surprised: '◉',
  confused: '◑',
  
  // 装饰图标
  star: '★',
  fire: '◈',
  sparkles: '✦',
  trophy: '◈',
  medal: '◉',
}

// 图标组合（用于特殊场景）
export const iconCombos = {
  chefHat: '◉',
  cookingPot: '◈',
  kitchenKnife: '◈',
  mixingBowl: '◈',
  fryingPan: '◈',
}

// 根据类型获取图标
export function getIconByType(type: string): string {
  return icons[type as keyof typeof icons] || '📌'
}

// 根据菜系获取图标
export function getCuisineIcon(cuisine: string): string {
  const cuisineMap: Record<string, string> = {
    '川菜': '🦐',
    '粤菜': '🦐',
    '鲁菜': '🥟',
    '苏菜': '🦀',
    '浙菜': '🦐',
    '闽菜': '🦞',
    '湘菜': '◊',
    '徽菜': '🐷',
    '日料': '◇',
    '西餐': '◈',
    '韩料': '◈',
    '泰餐': '◊',
    '意餐': '◈',
    '法餐': '◇',
    '印度': '◆',
  }
  
  return cuisineMap[cuisine] || '◉'
}

// 根据食材类别获取图标
export function getIngredientIcon(category: string): string {
  const categoryMap: Record<string, string> = {
    'vegetables': '◆',
    'meat': '◉',
    'seafood': '◊',
    'grains': '◈',
    'dairy': '◇',
    'fruits': '◐',
    'spices': '◑',
    'mushrooms': '◆',
    'beans': '◆',
    'eggs': '◇',
  }
  
  return categoryMap[category] || '◆'
}
