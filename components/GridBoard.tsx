import React, { useMemo } from 'react';
import { Coordinate, SkinConfig, ThemeConfig } from '../types';

interface GridBoardProps {
  gridSize: number;
  snake: Coordinate[];
  food: Coordinate;
  isGameOver: boolean;
  skin: SkinConfig;
  theme: ThemeConfig;
}

export const GridBoard: React.FC<GridBoardProps> = ({ 
  gridSize, 
  snake, 
  food, 
  isGameOver,
  skin,
  theme
}) => {
  // Memoize the grid cells generation to avoid unnecessary recalculations
  const cells = useMemo(() => {
    return Array.from({ length: gridSize * gridSize });
  }, [gridSize]);

  // Helper to check what is in a cell
  const getCellClass = (index: number) => {
    const x = index % gridSize;
    const y = Math.floor(index / gridSize);

    const isFood = food.x === x && food.y === y;
    
    // Find if this coordinate is part of the snake
    const snakeIndex = snake.findIndex(segment => segment.x === x && segment.y === y);
    const isHead = snakeIndex === 0;
    const isBody = snakeIndex > 0;

    if (isHead) {
      return isGameOver 
        ? 'bg-red-600 shadow-[0_0_20px_#dc2626] z-20 scale-110' 
        : `${skin.headClass} z-20 scale-110`;
    }
    
    if (isBody) {
      // Fade the tail
      // const opacity = Math.max(0.3, 1 - snakeIndex / (snake.length + 5));
      // Opacity handled in style prop below for smoother gradient
      return `${skin.bodyClass} z-10`;
    }

    if (isFood) {
      return `${skin.foodClass} rounded-full animate-pulse z-10 scale-90`;
    }

    return `${theme.gridClass} border border-opacity-20`;
  };

  return (
    <div 
      className={`grid gap-px p-1 rounded-xl shadow-2xl relative overflow-hidden transition-colors duration-500 ${theme.bgClass} ${theme.borderClass} border`}
      style={{
        gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
        aspectRatio: '1/1',
        width: '100%',
        maxWidth: '500px'
      }}
    >
        {/* Subtle background grid effect */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

      {cells.map((_, index) => {
        const x = index % gridSize;
        const y = Math.floor(index / gridSize);
        
        // Inline style for opacity handling which is dynamic
        const snakeIndex = snake.findIndex(segment => segment.x === x && segment.y === y);
        
        let style: React.CSSProperties = {};
        if (snakeIndex > 0) {
           style.opacity = Math.max(0.4, 1 - snakeIndex / (snake.length + 2));
        }

        return (
          <div
            key={index}
            className={`w-full h-full transition-all duration-100 rounded-sm ${getCellClass(index)}`}
            style={style}
          />
        );
      })}
    </div>
  );
};