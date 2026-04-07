import React from 'react';
import './VictoryScreen.css';

const VictoryScreen: React.FC = () => {
  return (
    <div className="victory-overlay">
      <div className="victory-card">
        <h1>🏆 VITÓRIA! 🏆</h1>
        <p className="message">Cinthia seu Filho Guilherme Azevedo VAI SER UM VENCEDOR</p>
        <div className="confetti-container">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="confetti"></div>
          ))}
        </div>
        <button onClick={() => window.location.reload()}>Jogar Novamente</button>
      </div>
    </div>
  );
};

export default VictoryScreen;
