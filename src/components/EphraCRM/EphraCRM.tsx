import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, MessageSquare, Phone, 
  Settings, Camera, Search, Plus, 
  MessageCircle, LogOut, Layers, Rocket, Zap
} from 'lucide-react';
import { useEphraStore } from '../../store/EphraStore';
import AuthPage from './Auth/AuthPage';
import EphraBoard from './Pipeline/EphraBoard';
import EphraInbox from './Inbox/EphraInbox';
import EphraDialer from './Dialer/EphraDialer';
import LeadBase from './Leads/LeadBase';
import SettingsPage from './Settings/SettingsPage';
import EphraConnect from './Connect/EphraConnect';

const EphraCRM: React.FC = () => {
  const { user, logout, pipelines, activePipelineId, setActivePipeline, fetchData, isLoading, addPipeline, checkUser } = useEphraStore();
  const [activeTab, setActiveTab] = useState('pipeline');

  useEffect(() => {
    const init = async () => {
      await checkUser();
      fetchData();
    };
    init();
  }, [checkUser, fetchData]);

  if (!user) return <AuthPage />;
  if (isLoading && activePipelineId === null) return <div style={{ color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Carregando Operação Ephra...</div>;

  return (
    <div style={{ backgroundColor: '#050505', color: '#fff', minHeight: '100vh', display: 'flex', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Sidebar */}
      <div style={{ width: '280px', backgroundColor: '#0a0a0a', borderRight: '1px solid #1a1a1a', display: 'flex', flexDirection: 'column', padding: '30px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px', padding: '0 10px' }}>
          <div style={{ width: '40px', height: '40px', backgroundColor: '#8b5cf6', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)' }}>
            <Rocket color="#fff" size={24} />
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 'bold', letterSpacing: '1px' }}>EPHRA</h1>
        </div>

        <div style={{ padding: '15px', backgroundColor: '#111', borderRadius: '15px', marginBottom: '30px', border: '1px solid #1a1a1a' }}>
          <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>{user.name}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '5px' }}>
            <span style={{ fontSize: '11px', color: '#8b5cf6', backgroundColor: 'rgba(139, 92, 246, 0.1)', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>{user.role}</span>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { id: 'pipeline', label: 'Ephra Pipeline', icon: <LayoutDashboard size={20} /> },
            { id: 'inbox', label: 'Omnichannel Inbox', icon: <MessageSquare size={20} /> },
            { id: 'leads', label: 'Base de Leads', icon: <Users size={20} /> },
            { id: 'connect', label: 'Ephra Connect', icon: <Zap size={20} /> },
            { id: 'dialer', label: 'Ephra Dialer', icon: <Phone size={20} /> },
            { id: 'settings', label: 'Configurações', icon: <Settings size={20} /> },
          ].map((item) => (
            <div 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px', borderRadius: '12px', cursor: 'pointer',
                backgroundColor: activeTab === item.id ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                color: activeTab === item.id ? '#8b5cf6' : '#555',
                transition: 'all 0.3s',
                border: activeTab === item.id ? '1px solid rgba(139, 92, 246, 0.2)' : '1px solid transparent'
              }}
            >
              {item.icon}
              <span style={{ fontWeight: activeTab === item.id ? 'bold' : '500' }}>{item.label}</span>
            </div>
          ))}
        </nav>

        <button 
          onClick={logout}
          style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '10px', padding: '15px', backgroundColor: 'transparent', border: 'none', color: '#e74c3c', cursor: 'pointer', fontWeight: 'bold' }}
        >
          <LogOut size={20} /> Sair
        </button>
      </div>

      {/* Main Container */}
      <div style={{ flex: 1, padding: '40px', overflowX: 'auto', height: '100vh', display: 'flex', flexDirection: 'column' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '15px', top: '12px', color: '#333' }} />
              <input type="text" placeholder="Buscar..." style={{ backgroundColor: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '12px 20px 12px 45px', color: '#fff', width: '300px', outline: 'none' }} />
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ display: 'flex', backgroundColor: '#0a0a0a', padding: '5px', borderRadius: '12px', border: '1px solid #1a1a1a' }}>
                {Object.values(pipelines).map(p => (
                  <button key={p.id} onClick={() => setActivePipeline(p.id)} style={{ padding: '8px 15px', borderRadius: '8px', border: 'none', backgroundColor: activePipelineId === p.id ? '#1a1a1a' : 'transparent', color: activePipelineId === p.id ? '#fff' : '#555', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Layers size={14} /> {p.name}
                  </button>
                ))}
              </div>
              <button onClick={() => { const name = prompt('Nome do Pipeline:'); if (name) addPipeline(name); }} style={{ backgroundColor: '#111', border: '1px solid #222', color: '#555', padding: '10px', borderRadius: '12px', cursor: 'pointer' }}>
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <Camera size={20} color="#e1306c" />
            <MessageCircle size={20} color="#25d366" />
            <button style={{ backgroundColor: '#8b5cf6', color: '#fff', border: 'none', borderRadius: '12px', padding: '12px 25px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 10px 20px rgba(139, 92, 246, 0.2)' }}>
              <Plus size={18} style={{ marginRight: '8px' }} /> Novo Lead
            </button>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          {activeTab === 'pipeline' && <EphraBoard />}
          {activeTab === 'inbox' && <EphraInbox />}
          {activeTab === 'dialer' && <EphraDialer />}
          {activeTab === 'leads' && <LeadBase />}
          {activeTab === 'settings' && <SettingsPage />}
          {activeTab === 'connect' && <EphraConnect />}
        </div>
      </div>
    </div>
  );
};

export default EphraCRM;
