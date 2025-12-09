export type Coordinate = {
  x: number;
  y: number;
};

export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

export enum GameStatus {
  IDLE = 'IDLE',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  GAME_OVER = 'GAME_OVER',
}

export interface GameSettings {
  gridSize: number;
  initialSpeed: number;
  speedIncrement: number;
}

export type Language = 'en' | 'zh';

export type AppView = 'GAME' | 'DASHBOARD';

export interface GameRecord {
  id: string;
  score: number;
  date: number; // timestamp
}

export interface SkinConfig {
  id: string;
  name: string;
  headClass: string;
  bodyClass: string;
  foodClass: string;
  shadowColor: string; // for custom box-shadow construction if needed
}

export interface ThemeConfig {
  id: string;
  name: string;
  bgClass: string;
  gridClass: string;
  borderClass: string;
}