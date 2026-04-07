import React, { useState } from 'react';
import { Phone, PhoneOff, MicOff, X } from 'lucide-react';

const EphraDialer: React.FC = () => {
  const [number, setNumber] = useState('');
  const [isCalling, setIsCalling] = useState(false);

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

  const addDigit = (digit: string) => {
    if (number.length < 15) setNumber(prev => prev + digit);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 120px)' }}>
      <div style={{ width: '400px', backgroundColor: '#0a0a0a', padding: '40px', borderRadius: '30px', border: '1px solid #1a1a1a', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
        
        {/* Display do Número */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ color: '#8b5cf6', fontSize: '12px', fontWeight: 'bold', marginBottom: '10px', letterSpacing: '2px' }}>EPHRA VOIP SYSTEM</div>
          <div style={{ height: '50px', fontSize: '32px', fontWeight: 'bold', letterSpacing: '2px', color: '#fff' }}>
            {number || <span style={{ opacity: 0.2 }}>Digite o número</span>}
          </div>
        </div>

        {/* Teclado Numérico */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
          {keys.map(key => (
            <button 
              key={key}
              onClick={() => addDigit(key)}
              style={{ 
                height: '70px', 
                backgroundColor: '#111', 
                border: '1px solid #1a1a1a', 
                borderRadius: '50%', 
                color: '#fff', 
                fontSize: '24px', 
                fontWeight: '600', 
                cursor: 'pointer',
                transition: '0.2s'
              }}
            >
              {key}
            </button>
          ))}
        </div>

        {/* Ações de Chamada */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>
          <div style={{ backgroundColor: '#111', padding: '15px', borderRadius: '50%', cursor: 'pointer' }}>
            <MicOff size={24} color="#555" />
          </div>
          
          <button 
            onClick={() => setIsCalling(!isCalling)}
            style={{ 
              width: '80px', 
              height: '80px', 
              backgroundColor: isCalling ? '#e74c3c' : '#2ecc71', 
              borderRadius: '50%', 
              border: 'none', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              cursor: 'pointer',
              boxShadow: isCalling ? '0 0 20px rgba(231, 76, 60, 0.5)' : '0 0 20px rgba(46, 204, 113, 0.5)',
              transition: '0.3s'
            }}
          >
            {isCalling ? <PhoneOff size={32} color="#fff" /> : <Phone size={32} color="#fff" />}
          </button>

          <div 
            onClick={() => setNumber('')}
            style={{ backgroundColor: '#111', padding: '15px', borderRadius: '50%', cursor: 'pointer' }}
          >
            <X size={24} color="#555" />
          </div>
        </div>

        {/* Info de Integração */}
        <div style={{ marginTop: '40px', textAlign: 'center', padding: '15px', backgroundColor: 'rgba(139, 92, 246, 0.05)', borderRadius: '15px', border: '1px solid rgba(139, 92, 246, 0.1)' }}>
          <p style={{ margin: 0, fontSize: '11px', color: '#888' }}>Conectado via <span style={{ color: '#8b5cf6', fontWeight: 'bold' }}>TWILIO API v2.4</span></p>
          <p style={{ margin: '5px 0 0 0', fontSize: '10px', color: '#555' }}>Todas as chamadas são gravadas.</p>
        </div>
      </div>
    </div>
  );
};

export default EphraDialer;
