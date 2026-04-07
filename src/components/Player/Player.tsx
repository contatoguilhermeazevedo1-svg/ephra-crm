import React from 'react';
import './Player.css';

const Player: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  return (
    <div 
      className="player" 
      style={{ 
        transform: `translate(${x}px, ${y}px)` 
      }}
    >
      <div className="player-body">
        <div className="player-head"></div>
        <div className="player-sword"></div>
        <div className="player-shield"></div>
      </div>
    </div>
  );
};

export default Player;
