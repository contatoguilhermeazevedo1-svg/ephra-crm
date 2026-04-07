import React, { useState } from 'react';
import { Camera, MessageCircle, ShieldCheck, Zap, CheckCircle2, Key, Smartphone, ExternalLink, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEphraStore } from '../../../store/EphraStore';

const EphraConnect: React.FC = () => {
  const { connections, saveMetaConfig, isLoading } = useEphraStore();
  const [phoneId, setPhoneId] = useState('');
  const [token, setToken] = useState('');
  const [showMetaForm, setShowMetaForm] = useState(false);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveMetaConfig(phoneId, token);
      setShowMetaForm(false);
      alert('WhatsApp conectado com sucesso à sua operação!');
    } catch (e) {
      alert('Erro ao conectar. Verifique os dados e tente novamente.');
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#fff' }}>Ephra Connect</h1>
        <p style={{ color: '#555', marginTop: '10px' }}>Ative os canais oficiais da sua empresa para centralizar o atendimento.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {/* WhatsApp Card */}
        <div style={{ backgroundColor: '#0a0a0a', padding: '40px', borderRadius: '30px', border: '1px solid #1a1a1a', position: 'relative' }}>
          <div style={{ backgroundColor: '#25d366', width: '60px', height: '60px', borderRadius: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '25px', boxShadow: '0 0 30px rgba(37, 211, 102, 0.2)' }}>
            <MessageCircle color="#fff" size={32} />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>WhatsApp Cloud API</h2>
          <p style={{ color: '#555', fontSize: '14px', marginBottom: '30px' }}>Conexão oficial e gratuita da Meta (1.000 msgs/mês).</p>
          
          {connections.whatsapp ? (
            <div style={{ color: '#2ecc71', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold', backgroundColor: 'rgba(46, 204, 113, 0.1)', padding: '15px', borderRadius: '12px' }}>
              <CheckCircle2 size={20} /> STATUS: CONECTADO
            </div>
          ) : (
            <button 
              onClick={() => setShowMetaForm(true)}
              style={{ width: '100%', backgroundColor: '#8b5cf6', color: '#fff', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
            >
              <Zap size={18} /> Configurar Conexão
            </button>
          )}
        </div>

        {/* Instagram Card */}
        <div style={{ backgroundColor: '#0a0a0a', padding: '40px', borderRadius: '30px', border: '1px solid #1a1a1a' }}>
          <div style={{ backgroundColor: '#e1306c', width: '60px', height: '60px', borderRadius: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '25px', boxShadow: '0 0 30px rgba(225, 48, 108, 0.2)' }}>
            <Camera color="#fff" size={32} />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>Instagram Direct</h2>
          <p style={{ color: '#555', fontSize: '14px', marginBottom: '30px' }}>Integração via Messenger API para Instagram.</p>
          <button style={{ width: '100%', backgroundColor: '#111', border: '1px solid #222', color: '#555', padding: '15px', borderRadius: '12px', fontWeight: 'bold', cursor: 'not-allowed' }}>Em Breve</button>
        </div>
      </div>

      {/* Meta Configuration Modal */}
      {showMetaForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ width: '100%', maxWidth: '500px', backgroundColor: '#0a0a0a', padding: '40px', borderRadius: '30px', border: '1px solid #8b5cf6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Configurar WhatsApp</h2>
              <button onClick={() => setShowMetaForm(false)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '20px' }}>✕</button>
            </div>

            <p style={{ fontSize: '13px', color: '#888', marginBottom: '25px', lineHeight: '1.6' }}>
              Acesse o <a href="https://developers.facebook.com/" target="_blank" rel="noreferrer" style={{ color: '#8b5cf6' }}>Meta Developers</a> para obter suas chaves.
            </p>

            <form onSubmit={handleConnect} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#555', marginBottom: '8px', fontWeight: 'bold' }}>PHONE NUMBER ID</label>
                <div style={{ position: 'relative' }}>
                  <Smartphone size={16} style={{ position: 'absolute', left: '15px', top: '14px', color: '#333' }} />
                  <input type="text" placeholder="Ex: 1092837465..." value={phoneId} onChange={(e) => setPhoneId(e.target.value)} style={{ width: '100%', backgroundColor: '#111', border: '1px solid #222', padding: '15px 15px 15px 45px', borderRadius: '12px', color: '#fff', outline: 'none' }} required />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#555', marginBottom: '8px', fontWeight: 'bold' }}>PERMANENT ACCESS TOKEN</label>
                <div style={{ position: 'relative' }}>
                  <Key size={16} style={{ position: 'absolute', left: '15px', top: '14px', color: '#333' }} />
                  <input type="password" placeholder="Cole seu token aqui..." value={token} onChange={(e) => setToken(e.target.value)} style={{ width: '100%', backgroundColor: '#111', border: '1px solid #222', padding: '15px 15px 15px 45px', borderRadius: '12px', color: '#fff', outline: 'none' }} required />
                </div>
              </div>

              <button type="submit" disabled={isLoading} style={{ backgroundColor: '#8b5cf6', color: '#fff', border: 'none', padding: '18px', borderRadius: '15px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
                {isLoading ? 'Conectando...' : 'Ativar Integração'}
              </button>
            </form>

            <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#111', borderRadius: '12px', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <HelpCircle size={18} color="#555" />
              <p style={{ fontSize: '12px', color: '#555', margin: 0 }}>Precisa de ajuda? Assista o tutorial de configuração.</p>
            </div>
          </motion.div>
        </div>
      )}

      <div style={{ marginTop: '60px', padding: '30px', backgroundColor: 'rgba(139, 92, 246, 0.05)', borderRadius: '20px', border: '1px solid rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <ShieldCheck color="#8b5cf6" size={32} />
        <div>
          <h4 style={{ margin: 0, fontSize: '16px' }}>Privacidade Garantida</h4>
          <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#555' }}>O Ephra CRM não armazena suas mensagens em servidores externos, apenas no seu próprio Supabase.</p>
        </div>
      </div>
    </div>
  );
};

export default EphraConnect;
