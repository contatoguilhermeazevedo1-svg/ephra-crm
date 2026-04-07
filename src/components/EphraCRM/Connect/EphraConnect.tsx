import React, { useState, useEffect } from 'react';
import { Camera, MessageCircle, QrCode, Zap, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEphraStore } from '../../../store/EphraStore';

const EphraConnect: React.FC = () => {
  const { connections, setConnection } = useEphraStore();
  const [connecting, setConnecting] = useState<'none' | 'whatsapp' | 'instagram'>('none');
  const [progress, setProgress] = useState(0);

  const startConnection = (type: 'whatsapp' | 'instagram') => {
    setConnecting(type);
    setProgress(0);
  };

  useEffect(() => {
    if (connecting !== 'none') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setConnection(connecting, true);
            setConnecting('none');
            return 100;
          }
          return prev + 10;
        });
      }, 200);
      return () => clearInterval(interval);
    }
  }, [connecting, setConnection]);

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#fff' }}>Ephra Connect</h1>
        <p style={{ color: '#555', marginTop: '10px' }}>Conecte seus canais oficiais para centralizar a operação de escala.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {/* WhatsApp Card */}
        <div style={{ backgroundColor: '#0a0a0a', padding: '40px', borderRadius: '30px', border: '1px solid #1a1a1a', textAlign: 'center', position: 'relative' }}>
          <div style={{ backgroundColor: '#25d366', width: '60px', height: '60px', borderRadius: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 25px', boxShadow: '0 0 30px rgba(37, 211, 102, 0.2)' }}>
            <MessageCircle color="#fff" size={32} />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>WhatsApp Business</h2>
          
          {connections.whatsapp ? (
            <div style={{ color: '#2ecc71', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontWeight: 'bold', padding: '15px' }}>
              <CheckCircle2 size={20} /> CONECTADO
              <button onClick={() => setConnection('whatsapp', false)} style={{ background: 'none', border: 'none', color: '#e74c3c', fontSize: '12px', cursor: 'pointer', marginLeft: '10px' }}>Desconectar</button>
            </div>
          ) : (
            <button 
              onClick={() => startConnection('whatsapp')}
              disabled={connecting !== 'none'}
              style={{ width: '100%', backgroundColor: '#111', border: '1px solid #222', color: '#fff', padding: '15px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              <QrCode size={18} style={{ marginRight: '10px' }} /> Escanear QR Code
            </button>
          )}
        </div>

        {/* Instagram Card */}
        <div style={{ backgroundColor: '#0a0a0a', padding: '40px', borderRadius: '30px', border: '1px solid #1a1a1a', textAlign: 'center' }}>
          <div style={{ backgroundColor: '#e1306c', width: '60px', height: '60px', borderRadius: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 25px', boxShadow: '0 0 30px rgba(225, 48, 108, 0.2)' }}>
            <Camera color="#fff" size={32} />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>Instagram Direct</h2>
          
          {connections.instagram ? (
            <div style={{ color: '#2ecc71', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontWeight: 'bold', padding: '15px' }}>
              <CheckCircle2 size={20} /> CONECTADO
              <button onClick={() => setConnection('instagram', false)} style={{ background: 'none', border: 'none', color: '#e74c3c', fontSize: '12px', cursor: 'pointer', marginLeft: '10px' }}>Desconectar</button>
            </div>
          ) : (
            <button 
              onClick={() => startConnection('instagram')}
              disabled={connecting !== 'none'}
              style={{ width: '100%', backgroundColor: '#111', border: '1px solid #222', color: '#fff', padding: '15px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              <Zap size={18} style={{ marginRight: '10px' }} /> Vincular Conta
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {connecting !== 'none' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ textAlign: 'center', width: '300px' }}>
              <div style={{ position: 'relative', width: '180px', height: '180px', backgroundColor: '#fff', margin: '0 auto 40px', borderRadius: '20px', padding: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <QrCode size={120} color="#000" />
                <motion.div animate={{ y: [0, 150, 0] }} transition={{ duration: 2, repeat: Infinity }} style={{ position: 'absolute', top: '15px', left: '15px', width: '150px', height: '2px', backgroundColor: '#8b5cf6' }} />
              </div>
              <h3 style={{ color: '#fff' }}>Sincronizando {connecting}... {progress}%</h3>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EphraConnect;
