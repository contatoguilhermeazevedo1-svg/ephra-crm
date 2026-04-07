import React from 'react';
import { Smartphone, Globe, Save, Lock } from 'lucide-react';

const SettingsPage: React.FC = () => {
  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '30px' }}>Configurações do Sistema Ephra</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        
        {/* API Connections */}
        <div style={{ backgroundColor: '#0a0a0a', padding: '30px', borderRadius: '20px', border: '1px solid #1a1a1a' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
            <div style={{ backgroundColor: '#8b5cf6', padding: '10px', borderRadius: '10px' }}><Globe size={20} /></div>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px' }}>Conexões Externas (API)</h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#555' }}>Gerencie suas chaves de integração para Omnichannel e VoIP.</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#888', marginBottom: '8px' }}>Twilio Account SID (Ligações)</label>
              <div style={{ position: 'relative' }}>
                <input type="password" value="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" style={{ width: '100%', backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px', padding: '12px 15px', color: '#fff', fontSize: '14px' }} disabled />
                <Lock size={16} style={{ position: 'absolute', right: '15px', top: '13px', color: '#333' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Team Settings */}
        <div style={{ backgroundColor: '#0a0a0a', padding: '30px', borderRadius: '20px', border: '1px solid #1a1a1a' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
            <div style={{ backgroundColor: '#2ecc71', padding: '10px', borderRadius: '10px' }}><Smartphone size={20} /></div>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px' }}>Segurança e Acesso</h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#555' }}>Controle de permissões para sua equipe de vendas.</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px', backgroundColor: '#111', borderRadius: '12px' }}>
            <div>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>Gravação de Chamadas Automática</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#555' }}>Todas as ligações do discador serão gravadas para auditoria.</p>
            </div>
          </div>
        </div>

        <button style={{ backgroundColor: '#8b5cf6', color: '#fff', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
          <Save size={20} /> Salvar Alterações
        </button>

      </div>
    </div>
  );
};

export default SettingsPage;
