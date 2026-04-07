import React from 'react';
import Map from '../Map/Map';
import Player from '../Player/Player';
import VictoryScreen from '../VictoryScreen/VictoryScreen';
import { useGameLogic } from '../../hooks/useGameLogic';
import './Game.css';

const Game: React.FC = () => {
  const { pos, isVictory } = useGameLogic();

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>A Jornada de Guilherme</h1>
        <p>Use as SETAS ou WASD para se mover e encontre a Coroa!</p>
      </div>
      <div className="game-viewport">
        <Map />
        <Player x={pos.x} y={pos.y} />
      </div>
      {isVictory && <VictoryScreen />}
    </div>
  );
};

export default Game;
