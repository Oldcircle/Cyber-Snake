import { Coordinate, Direction, GameSettings, Language, SkinConfig, ThemeConfig } from './types';

export const SETTINGS: GameSettings = {
  gridSize: 20,
  initialSpeed: 150, // ms per tick
  speedIncrement: 2, // ms decrease per food eaten
};

export const INITIAL_SNAKE: Coordinate[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];

export const INITIAL_DIRECTION = Direction.UP;

export const KEY_MAPPING: Record<string, Direction> = {
  ArrowUp: Direction.UP,
  w: Direction.UP,
  ArrowDown: Direction.DOWN,
  s: Direction.DOWN,
  ArrowLeft: Direction.LEFT,
  a: Direction.LEFT,
  ArrowRight: Direction.RIGHT,
  d: Direction.RIGHT,
};

// --- Customization ---

export const SKINS: Record<string, SkinConfig> = {
  CYBER: {
    id: 'CYBER',
    name: 'Cyber Cyan',
    headClass: 'bg-cyan-400 shadow-[0_0_15px_#22d3ee]',
    bodyClass: 'bg-purple-500 shadow-[0_0_10px_#a855f7]',
    foodClass: 'bg-green-400 shadow-[0_0_15px_#4ade80]',
    shadowColor: '#22d3ee'
  },
  GOLD: {
    id: 'GOLD',
    name: 'Midas Touch',
    headClass: 'bg-yellow-400 shadow-[0_0_15px_#facc15]',
    bodyClass: 'bg-yellow-600 shadow-[0_0_10px_#ca8a04]',
    foodClass: 'bg-red-500 shadow-[0_0_15px_#ef4444]',
    shadowColor: '#facc15'
  },
  MATRIX: {
    id: 'MATRIX',
    name: 'The Code',
    headClass: 'bg-green-500 shadow-[0_0_15px_#22c55e]',
    bodyClass: 'bg-green-800 shadow-[0_0_10px_#166534]',
    foodClass: 'bg-white shadow-[0_0_15px_#ffffff]',
    shadowColor: '#22c55e'
  },
  FLAME: {
    id: 'FLAME',
    name: 'Inferno',
    headClass: 'bg-orange-500 shadow-[0_0_15px_#f97316]',
    bodyClass: 'bg-red-600 shadow-[0_0_10px_#dc2626]',
    foodClass: 'bg-blue-400 shadow-[0_0_15px_#60a5fa]',
    shadowColor: '#f97316'
  }
};

export const THEMES: Record<string, ThemeConfig> = {
  DEFAULT: {
    id: 'DEFAULT',
    name: 'Deep Space',
    bgClass: 'bg-[#050510]',
    gridClass: 'border-white/5',
    borderClass: 'border-cyan-500/30'
  },
  RETRO: {
    id: 'RETRO',
    name: 'Retro Grid',
    bgClass: 'bg-[#1a0b2e]',
    gridClass: 'border-purple-500/20',
    borderClass: 'border-purple-500'
  },
  CLEAN: {
    id: 'CLEAN',
    name: 'Clean Slate',
    bgClass: 'bg-slate-900',
    gridClass: 'border-slate-700/30',
    borderClass: 'border-slate-600'
  }
};

// --- Translations ---

export const TRANSLATIONS = {
  en: {
    title: 'NEON SNAKE',
    subtitle: 'Cybernetic Neural Link',
    controls: {
      move: 'WASD / Arrows to Move',
      dash: 'SPACE to Dash',
      pause: 'ESC to Pause'
    },
    menu: {
      start: 'START GAME',
      resume: 'RESUME',
      dashboard: 'DASHBOARD',
      gameOver: 'SYSTEM FAILURE',
      reboot: 'REBOOT SYSTEM',
      finalScore: 'Final Score',
      newHighScore: 'NEW HIGH SCORE!',
      paused: 'PAUSED'
    },
    dashboard: {
      title: 'DASHBOARD',
      back: 'BACK TO GAME',
      tabs: {
        settings: 'SETTINGS',
        history: 'HISTORY'
      },
      settings: {
        language: 'Language',
        theme: 'Map Theme',
        skin: 'Snake Skin',
        clearData: 'Reset Data'
      },
      history: {
        empty: 'No records found.',
        date: 'Date',
        score: 'Score'
      }
    }
  },
  zh: {
    title: '霓虹贪吃蛇',
    subtitle: '赛博神经网络链接',
    controls: {
      move: 'WASD / 方向键 移动',
      dash: '按住空格键 加速',
      pause: 'ESC 暂停'
    },
    menu: {
      start: '开始游戏',
      resume: '继续游戏',
      dashboard: '控制台',
      gameOver: '系统崩溃',
      reboot: '重启系统',
      finalScore: '最终得分',
      newHighScore: '新纪录!',
      paused: '已暂停'
    },
    dashboard: {
      title: '控制台',
      back: '返回游戏',
      tabs: {
        settings: '设置',
        history: '历史记录'
      },
      settings: {
        language: '语言',
        theme: '地图主题',
        skin: '蛇皮肤',
        clearData: '清除数据'
      },
      history: {
        empty: '暂无记录',
        date: '日期',
        score: '得分'
      }
    }
  }
};
