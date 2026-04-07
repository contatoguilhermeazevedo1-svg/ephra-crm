import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface Lead {
  id: string;
  name: string;
  value: string;
  source: string;
  tags: string[];
  last_activity: string;
  phone?: string;
  email?: string;
  ai_insights?: {
    summary: string;
    vibeScore: number;
    nextAction: string;
    qualificationStatus: string;
  };
}

export interface Stage {
  id: string;
  title: string;
  lead_ids: string[];
  color: string;
}

export interface Pipeline {
  id: string;
  name: string;
  stages: Stage[];
}

export interface Message {
  id: string;
  lead_id: string;
  text: string;
  sender: 'lead' | 'me' | 'ai';
  created_at: string;
}

interface EphraStore {
  user: any | null;
  leads: Record<string, Lead>;
  pipelines: Record<string, Pipeline>;
  activePipelineId: string | null;
  isLoading: boolean;
  connections: { 
    whatsapp: boolean; 
    instagram: boolean;
    meta_phone_id?: string;
    meta_token?: string;
  };
  conversations: Record<string, Message[]>;
  
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string, name: string, role: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkUser: () => Promise<void>;
  fetchData: () => Promise<void>;
  saveMetaConfig: (phoneId: string, token: string) => Promise<void>;
  sendMessage: (leadId: string, text: string, sender?: 'me' | 'ai') => Promise<void>;
  moveLead: (leadId: string, fromStageId: string, toStageId: string, newIndex: number) => Promise<void>;
  addLead: (lead: Partial<Lead>, stageId: string) => Promise<void>;
  setActivePipeline: (id: string) => void;
  addPipeline: (name: string) => Promise<void>;
  addStage: (pipelineId: string, title: string, color: string) => Promise<void>;
}

export const useEphraStore = create<EphraStore>((set, get) => ({
  user: null,
  leads: {},
  pipelines: {},
  activePipelineId: null,
  isLoading: false,
  connections: { whatsapp: false, instagram: false },
  conversations: {},

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    set({ user: data.user });
  },

  signUp: async (email, password, name, role) => {
    const { data, error } = await supabase.auth.signUp({
      email, password, options: { data: { name, role } }
    });
    if (error) throw error;
    set({ user: data.user });
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, leads: {}, pipelines: {}, activePipelineId: null });
  },

  checkUser: async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user) set({ user: data.user });
  },

  saveMetaConfig: async (phoneId, token) => {
    const { user } = get();
    if (!user) return;
    
    // Salvar na tabela do usuário (perfil ou tabela dedicada)
    const { error } = await supabase
      .from('whatsapp_instances')
      .upsert([{ 
        user_id: user.id, 
        instance_name: 'Meta Cloud API', 
        api_key: token, 
        webhook_url: phoneId, // Usando phoneId temporariamente como identificador
        status: 'connected'
      }]);
    
    if (error) throw error;
    set(state => ({ connections: { ...state.connections, whatsapp: true, meta_phone_id: phoneId, meta_token: token } }));
  },

  fetchData: async () => {
    set({ isLoading: true });
    try {
      const { data: pData } = await supabase.from('pipelines').select('*, stages(*)');
      const { data: lData } = await supabase.from('leads').select('*');
      const { data: mData } = await supabase.from('messages').select('*').order('created_at', { ascending: true });
      const { data: cData } = await supabase.from('whatsapp_instances').select('*').limit(1);

      const leadsMap: Record<string, Lead> = {};
      lData?.forEach(l => leadsMap[l.id] = l);

      const pipelinesMap: Record<string, Pipeline> = {};
      pData?.forEach(p => {
        pipelinesMap[p.id] = { ...p, stages: (p.stages || []).sort((a: any, b: any) => a.order_index - b.order_index) };
      });

      const convsMap: Record<string, Message[]> = {};
      mData?.forEach(m => {
        if (!convsMap[m.lead_id]) convsMap[m.lead_id] = [];
        convsMap[m.lead_id].push(m);
      });

      set({ 
        leads: leadsMap, 
        pipelines: pipelinesMap, 
        conversations: convsMap,
        activePipelineId: pData?.[0]?.id || null, 
        connections: { ...get().connections, whatsapp: cData?.[0]?.status === 'connected' },
        isLoading: false 
      });
    } catch (e) { set({ isLoading: false }); }
  },

  // ... rest of actions ...
  moveLead: async (leadId, fromStageId, toStageId, newIndex) => {
    const { pipelines, activePipelineId } = get();
    if (!activePipelineId) return;
    const pipeline = pipelines[activePipelineId];
    const newStages = pipeline.stages.map(s => {
      if (s.id === fromStageId) return { ...s, lead_ids: (s.lead_ids || []).filter(id => id !== leadId) };
      if (s.id === toStageId) {
        const ids = [...(s.lead_ids || [])];
        ids.splice(newIndex, 0, leadId);
        return { ...s, lead_ids: ids };
      }
      return s;
    });
    set({ pipelines: { ...pipelines, [activePipelineId]: { ...pipeline, stages: newStages } } });
    const fS = newStages.find(s => s.id === fromStageId);
    const tS = newStages.find(s => s.id === toStageId);
    await Promise.all([
      supabase.from('stages').update({ lead_ids: fS?.lead_ids }).eq('id', fromStageId),
      supabase.from('stages').update({ lead_ids: tS?.lead_ids }).eq('id', toStageId)
    ]);
  },

  addLead: async (leadData, stageId) => {
    const { data: nL } = await supabase.from('leads').insert([{
      name: leadData.name,
      value: leadData.value || 'R$ 0,00',
      source: leadData.source || 'WhatsApp',
      tags: leadData.tags || ['Novo'],
      ai_insights: { summary: 'Aguardando interação...', vibeScore: 50, nextAction: 'Iniciar contato', qualificationStatus: 'Pendente' }
    }]).select().single();
    if (!nL) return;
    const { pipelines, activePipelineId, leads } = get();
    if (!activePipelineId) return;
    const stage = pipelines[activePipelineId].stages.find(s => s.id === stageId);
    const nIds = [nL.id, ...(stage?.lead_ids || [])];
    await supabase.from('stages').update({ lead_ids: nIds }).eq('id', stageId);
    set({
      leads: { ...leads, [nL.id]: nL },
      pipelines: { ...pipelines, [activePipelineId]: { ...pipelines[activePipelineId], stages: pipelines[activePipelineId].stages.map(s => s.id === stageId ? { ...s, lead_ids: nIds } : s) } }
    });
  },

  sendMessage: async (leadId, text, sender = 'me') => {
    const { data: nM } = await supabase.from('messages').insert([{ lead_id: leadId, text, sender }]).select().single();
    if (nM) set((state) => ({ conversations: { ...state.conversations, [leadId]: [...(state.conversations[leadId] || []), nM] } }));
  },

  addPipeline: async (name) => {
    const { data: nP } = await supabase.from('pipelines').insert([{ name }]).select().single();
    if (nP) await get().fetchData();
  },

  addStage: async (pipelineId, title, color) => {
    await supabase.from('stages').insert([{ pipeline_id: pipelineId, title, color, order_index: 99 }]);
    await get().fetchData();
  },

  setActivePipeline: (id) => set({ activePipelineId: id })
}));
