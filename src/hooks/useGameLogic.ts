import { useState, useEffect, useCallback } from 'react';
import { MAP_GRID, TILE_SIZE } from '../components/Map/Map';

export const useGameLogic = () => {
  const [pos, setPos] = useState({ x: TILE_SIZE, y: TILE_SIZE });
  const [isVictory, setIsVictory] = useState(false);

  const move = useCallback((dx: number, dy: number) => {
    setPos((prev) => {
      const newX = prev.x + dx;
      const newY = prev.y + dy;

      const gridX = Math.floor(newX / TILE_SIZE);
      const gridY = Math.floor(newY / TILE_SIZE);

      // Check boundaries
      if (gridY < 0 || gridY >= MAP_GRID.length || gridX < 0 || gridX >= MAP_GRID[0].length) {
        return prev;
      }

      const tile = MAP_GRID[gridY][gridX];

      // Collision with rocks
      if (tile === 1) {
        return prev;
      }

      // Check victory
      if (tile === 2) {
        setIsVictory(true);
      }

      return { x: newX, y: newY };
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      console.log('Tecla pressionada:', e.key);
      if (isVictory) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          move(0, -TILE_SIZE);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          move(0, TILE_SIZE);
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          move(-TILE_SIZE, 0);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          move(TILE_SIZE, 0);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move, isVictory]);

  return { pos, isVictory };
};
