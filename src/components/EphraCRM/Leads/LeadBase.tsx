import React from 'react';
import { Filter, Download, MoreHorizontal, Phone, Camera, MessageCircle } from 'lucide-react';
import { useEphraStore } from '../../../store/EphraStore';

const LeadBase: React.FC = () => {
  const { leads } = useEphraStore();
  const leadList = Object.values(leads);

  return (
    <div style={{ padding: '20px', backgroundColor: '#0a0a0a', borderRadius: '20px', border: '1px solid #1a1a1a' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>Base de Leads ({leadList.length})</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button style={{ backgroundColor: '#111', color: '#fff', border: '1px solid #333', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={16} /> Filtrar
          </button>
          <button style={{ backgroundColor: '#111', color: '#fff', border: '1px solid #333', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={16} /> Exportar CSV
          </button>
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #1a1a1a', color: '#555', fontSize: '13px', textTransform: 'uppercase' }}>
            <th style={{ padding: '15px' }}>Nome do Lead</th>
            <th style={{ padding: '15px' }}>Contato</th>
            <th style={{ padding: '15px' }}>TAGS</th>
            <th style={{ padding: '15px' }}>Origem</th>
            <th style={{ padding: '15px' }}>Valor</th>
            <th style={{ padding: '15px' }}>Última Atividade</th>
            <th style={{ padding: '15px' }}></th>
          </tr>
        </thead>
        <tbody>
          {leadList.map((lead) => (
            <tr key={lead.id} style={{ borderBottom: '1px solid #111', fontSize: '14px', transition: '0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0d0d0d'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
              <td style={{ padding: '15px', fontWeight: 'bold' }}>{lead.name}</td>
              <td style={{ padding: '15px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <Phone size={14} color="#2ecc71" />
                  <span style={{ color: '#888', fontSize: '12px' }}>{lead.phone || 'N/A'}</span>
                </div>
              </td>
              <td style={{ padding: '15px' }}>
                <div style={{ display: 'flex', gap: '5px' }}>
                  {lead.tags.map(tag => (
                    <span key={tag} style={{ fontSize: '10px', backgroundColor: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </td>
              <td style={{ padding: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {lead.source === 'Instagram' ? <Camera size={14} color="#e1306c" /> : <MessageCircle size={14} color="#25d366" />}
                  {lead.source}
                </div>
              </td>
              <td style={{ padding: '15px', fontWeight: 'bold', color: '#f1c40f' }}>{lead.value}</td>
              <td style={{ padding: '15px', color: '#555' }}>{lead.last_activity}</td>
              <td style={{ padding: '15px' }}><MoreHorizontal size={18} color="#333" style={{ cursor: 'pointer' }} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeadBase;
