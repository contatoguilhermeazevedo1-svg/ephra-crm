import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, User, Zap
} from 'lucide-react';
import { useEphraStore } from '../../../store/EphraStore';
import { motion, AnimatePresence } from 'framer-motion';

const EphraInbox: React.FC = () => {
  const { leads, conversations, connections, sendMessage } = useEphraStore();
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [msgInput, setMsgInput] = useState('');
  const [showAI, setShowAI] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const isConnected = connections.whatsapp || connections.instagram;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, selectedLeadId]);

  if (!isConnected) {
    return (
      <div style={{ height: 'calc(100vh - 150px)', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', color: '#555', textAlign: 'center' }}>
        <Zap size={64} style={{ marginBottom: '20px', opacity: 0.2 }} />
        <h2>Nenhum Canal Conectado</h2>
        <p style={{ maxWidth: '400px', marginTop: '10px' }}>Conecte seu WhatsApp ou Instagram no Ephra Connect.</p>
      </div>
    );
  }

  const selectedLead = selectedLeadId ? leads[selectedLeadId] : null;
  const currentMessages = selectedLeadId ? conversations[selectedLeadId] || [] : [];

  const handleSend = async (text: string, sender: 'me' | 'ai' = 'me') => {
    if (!text.trim() || !selectedLeadId) return;
    await sendMessage(selectedLeadId, text, sender);
    if (sender === 'me') setMsgInput('');
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 120px)', backgroundColor: '#0a0a0a', borderRadius: '20px', border: '1px solid #1a1a1a', overflow: 'hidden' }}>
      
      <div style={{ width: '300px', borderRight: '1px solid #1a1a1a', display: 'flex', flexDirection: 'column', backgroundColor: '#050505' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #1a1a1a' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold' }}>Conversas</h2>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {Object.values(leads).map(lead => (
            <div 
              key={lead.id}
              onClick={() => setSelectedLeadId(lead.id)}
              style={{ 
                padding: '15px 20px', 
                borderBottom: '1px solid #111', 
                cursor: 'pointer',
                backgroundColor: selectedLeadId === lead.id ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                display: 'flex', gap: '12px', alignItems: 'center'
              }}
            >
              <div style={{ width: '40px', height: '40px', backgroundColor: '#222', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', border: lead.ai_insights?.vibeScore && lead.ai_insights.vibeScore > 80 ? '2px solid #f1c40f' : 'none' }}>
                <User size={18} color="#8b5cf6" />
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: 'bold', fontSize: '13px', display: 'block' }}>{lead.name}</span>
                <span style={{ fontSize: '11px', color: '#555' }}>{lead.source}</span>
              </div>
              {lead.ai_insights?.vibeScore && <span style={{ fontSize: '10px', color: '#f1c40f' }}>{lead.ai_insights.vibeScore}%</span>}
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {selectedLead ? (
          <>
            <div style={{ padding: '15px 25px', borderBottom: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0d0d0d' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold' }}>{selectedLead.name}</h3>
                <button onClick={() => setShowAI(!showAI)} style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)', border: '1px solid #8b5cf6', color: '#8b5cf6', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}>AI Copilot</button>
              </div>
            </div>

            <div style={{ flex: 1, padding: '25px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {currentMessages.map(msg => (
                <div key={msg.id} style={{ alignSelf: msg.sender === 'lead' ? 'flex-start' : 'flex-end', maxWidth: '70%', backgroundColor: msg.sender === 'lead' ? '#1a1a1a' : '#8b5cf6', padding: '12px 18px', borderRadius: '15px' }}>
                  <p style={{ margin: 0, fontSize: '14px' }}>{msg.text}</p>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div style={{ padding: '20px 25px', backgroundColor: '#0d0d0d', borderTop: '1px solid #1a1a1a' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: '#1a1a1a', padding: '10px 15px', borderRadius: '12px' }}>
                <input type="text" value={msgInput} onChange={(e) => setMsgInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend(msgInput)} placeholder="Mensagem..." style={{ flex: 1, backgroundColor: 'transparent', border: 'none', color: '#fff', outline: 'none' }} />
                <button onClick={() => handleSend(msgInput)} style={{ backgroundColor: '#8b5cf6', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer' }}><Send size={18} color="#fff" /></button>
              </div>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#333' }}>Selecione uma conversa.</div>
        )}
      </div>

      <AnimatePresence>
        {showAI && selectedLead && selectedLead.ai_insights && (
          <motion.div initial={{ width: 0 }} animate={{ width: '300px' }} style={{ borderLeft: '1px solid #1a1a1a', backgroundColor: '#050505', padding: '25px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '20px' }}>Ephra AI Insights</h3>
            <div style={{ backgroundColor: '#0a0a0a', padding: '15px', borderRadius: '15px', marginBottom: '20px' }}>
              <p style={{ fontSize: '12px', color: '#888' }}>VIBE SCORE: {selectedLead.ai_insights.vibeScore}%</p>
              <p style={{ fontSize: '13px', marginTop: '10px' }}>{selectedLead.ai_insights.summary}</p>
            </div>
            <div style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)', padding: '15px', borderRadius: '15px' }}>
              <p style={{ fontSize: '11px', color: '#8b5cf6', fontWeight: 'bold' }}>PRÓXIMA AÇÃO</p>
              <p style={{ fontSize: '13px', marginTop: '5px' }}>{selectedLead.ai_insights.nextAction}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EphraInbox;
