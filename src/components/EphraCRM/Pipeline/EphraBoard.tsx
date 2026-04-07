import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import { useEphraStore } from '../../../store/EphraStore';
import { MessageSquare, Phone, Camera, MessageCircle, Plus, X, Sparkles, TrendingUp } from 'lucide-react';

const EphraBoard: React.FC = () => {
  const { leads, pipelines, activePipelineId, moveLead, addLead, addStage } = useEphraStore();
  const pipeline = activePipelineId ? pipelines[activePipelineId] : null;
  const [showAddLead, setShowAddLead] = useState<string | null>(null);
  const [newLeadName, setNewLeadName] = useState('');
  const [newStageTitle, setNewStageTitle] = useState('');
  const [showAddStage, setShowAddStage] = useState(false);

  if (!pipeline) return null;

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;
    moveLead(draggableId, source.droppableId, destination.droppableId, destination.index);
  };

  const handleAddLead = (stageId: string) => {
    if (!newLeadName.trim()) return;
    addLead({
      name: newLeadName,
      value: 'R$ 0,00',
      source: 'WhatsApp',
      tags: ['Novo'],
    }, stageId);
    setNewLeadName('');
    setShowAddLead(null);
  };

  const handleAddStage = () => {
    if (!newStageTitle.trim() || !activePipelineId) return;
    addStage(activePipelineId, newStageTitle, '#8b5cf6');
    setNewStageTitle('');
    setShowAddStage(false);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: 'flex', gap: '20px', minWidth: '1200px', height: 'calc(100vh - 200px)', padding: '10px 0', overflowX: 'auto' }}>
        {pipeline.stages.map((stage) => (
          <Droppable key={stage.id} droppableId={stage.id}>
            {(provided) => (
              <div 
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{ flex: 1, minWidth: '320px', backgroundColor: '#0a0a0a', borderRadius: '20px', padding: '20px', border: '1px solid #1a1a1a', display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: `2px solid ${stage.color}`, paddingBottom: '10px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: stage.color, textTransform: 'uppercase' }}>{stage.title}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Plus size={14} color="#555" style={{ cursor: 'pointer' }} onClick={() => setShowAddLead(stage.id)} />
                    <span style={{ fontSize: '11px', color: '#555', backgroundColor: '#111', padding: '2px 8px', borderRadius: '10px' }}>
                      {stage.lead_ids?.length || 0}
                    </span>
                  </div>
                </div>

                {showAddLead === stage.id && (
                  <div style={{ backgroundColor: '#111', padding: '15px', borderRadius: '15px', marginBottom: '15px', border: '1px solid #8b5cf6' }}>
                    <input autoFocus placeholder="Nome do Lead..." value={newLeadName} onChange={(e) => setNewLeadName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddLead(stage.id)} style={{ width: '100%', background: 'none', border: 'none', color: '#fff', outline: 'none', fontSize: '14px', marginBottom: '10px' }} />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                      <X size={14} color="#555" style={{ cursor: 'pointer' }} onClick={() => setShowAddLead(null)} />
                      <Plus size={14} color="#8b5cf6" style={{ cursor: 'pointer' }} onClick={() => handleAddLead(stage.id)} />
                    </div>
                  </div>
                )}

                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {stage.lead_ids?.map((leadId, index) => {
                    const lead = leads[leadId];
                    if (!lead) return null;
                    return (
                      <Draggable key={lead.id} draggableId={lead.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{ 
                              ...provided.draggableProps.style,
                              backgroundColor: snapshot.isDragging ? '#1a1a1a' : '#111',
                              padding: '18px',
                              borderRadius: '15px',
                              border: lead.ai_insights?.vibeScore! > 80 ? '1px solid #f1c40f' : '1px solid #222',
                              boxShadow: snapshot.isDragging ? '0 20px 40px rgba(0,0,0,0.5)' : 'none',
                              transition: 'background-color 0.2s'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                              <span style={{ fontSize: '10px', backgroundColor: lead.source === 'Instagram' ? 'rgba(225, 48, 108, 0.1)' : 'rgba(37, 211, 102, 0.1)', color: lead.source === 'Instagram' ? '#e1306c' : '#25d366', padding: '3px 8px', borderRadius: '5px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                {lead.source === 'Instagram' ? <Camera size={10} /> : <MessageCircle size={10} />}
                                {lead.source}
                              </span>
                              {lead.ai_insights?.vibeScore && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'rgba(241, 196, 15, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                                  <Sparkles size={10} color="#f1c40f" />
                                  <span style={{ fontSize: '10px', color: '#f1c40f', fontWeight: 'bold' }}>{lead.ai_insights.vibeScore}%</span>
                                </div>
                              )}
                            </div>

                            <h4 style={{ margin: '0 0 5px 0', fontSize: '15px', color: '#fff' }}>{lead.name}</h4>
                            <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: '#8b5cf6' }}>{lead.value}</p>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
                              {lead.tags.map(tag => (
                                <span key={tag} style={{ fontSize: '9px', backgroundColor: '#222', color: '#888', padding: '2px 6px', borderRadius: '4px', border: '1px solid #333' }}>{tag}</span>
                              ))}
                            </div>
                            
                            <div style={{ display: 'flex', gap: '10px', marginTop: '18px', paddingTop: '15px', borderTop: '1px solid #1a1a1a' }}>
                              <MessageSquare size={14} color="#444" />
                              <Phone size={14} color="#444" />
                              <TrendingUp size={14} color={lead.ai_insights?.vibeScore! > 70 ? '#2ecc71' : '#444'} style={{ marginLeft: 'auto' }} />
                            </div>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}

        <div style={{ minWidth: '300px', display: 'flex', flexDirection: 'column' }}>
          {showAddStage ? (
            <div style={{ backgroundColor: '#0a0a0a', padding: '20px', borderRadius: '20px', border: '1px solid #8b5cf6' }}>
              <input autoFocus placeholder="Nome da Etapa..." value={newStageTitle} onChange={(e) => setNewStageTitle(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddStage()} style={{ width: '100%', background: 'none', border: 'none', color: '#fff', outline: 'none', fontSize: '14px', marginBottom: '15px' }} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={handleAddStage} style={{ flex: 1, backgroundColor: '#8b5cf6', color: '#fff', border: 'none', padding: '8px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Salvar</button>
                <button onClick={() => setShowAddStage(false)} style={{ flex: 1, backgroundColor: '#111', color: '#555', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}>Cancelar</button>
              </div>
            </div>
          ) : (
            <div onClick={() => setShowAddStage(true)} style={{ height: '100px', border: '2px dashed #1a1a1a', borderRadius: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#333', cursor: 'pointer', transition: '0.2s' }}>
              <Plus size={24} style={{ marginBottom: '5px' }} />
              <p style={{ fontSize: '12px', fontWeight: 'bold' }}>Nova Etapa</p>
            </div>
          )}
        </div>
      </div>
    </DragDropContext>
  );
};

export default EphraBoard;
