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

interface EphraStore {
  user: any | null;
  leads: Record<string, Lead>;
  pipelines: Record<string, Pipeline>;
  activePipelineId: string | null;
  isLoading: boolean;
  connections: { whatsapp: boolean; instagram: boolean };
  conversations: Record<string, any[]>;
  
  // Auth Actions
  signUp: (email: string, pass: string, name: string, role: string) => Promise<void>;
  signIn: (email: string, pass: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkUser: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPass: string) => Promise<void>;
  
  // Data Actions ...
  fetchData: () => Promise<void>;
  moveLead: (leadId: string, fromStageId: string, toStageId: string, newIndex: number) => Promise<void>;
  addLead: (lead: Partial<Lead>, stageId: string) => Promise<void>;
  setActivePipeline: (id: string) => void;
  setConnection: (type: 'whatsapp' | 'instagram', status: boolean) => void;
  sendMessage: (leadId: string, text: string, sender?: 'me' | 'ai') => Promise<void>;
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

  signUp: async (email, password, name, role) => {
    set({ isLoading: true });
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role }
      }
    });
    if (error) {
      set({ isLoading: false });
      throw error;
    }
    set({ user: data.user, isLoading: false });
  },

  signIn: async (email, password) => {
    set({ isLoading: true });
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      set({ isLoading: false });
      throw error;
    }
    set({ user: data.user, isLoading: false });
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, leads: {}, pipelines: {}, activePipelineId: null });
  },

  checkUser: async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user) set({ user: data.user });
  },

  resetPassword: async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
    if (error) throw error;
  },

  updatePassword: async (newPassword) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
  },

  fetchData: async () => {
    set({ isLoading: true });
    try {
      const { data: pData } = await supabase.from('pipelines').select('*, stages(*)');
      if (!pData || pData.length === 0) {
        set({ isLoading: false });
        return;
      }

      const { data: lData } = await supabase.from('leads').select('*');
      const { data: mData } = await supabase.from('messages').select('*').order('created_at', { ascending: true });

      const leadsMap: Record<string, Lead> = {};
      lData?.forEach(l => leadsMap[l.id] = l);

      const pipelinesMap: Record<string, Pipeline> = {};
      pData.forEach(p => {
        pipelinesMap[p.id] = { ...p, stages: (p.stages || []).sort((a: any, b: any) => a.order_index - b.order_index) };
      });

      const convsMap: Record<string, any[]> = {};
      mData?.forEach(m => {
        if (!convsMap[m.lead_id]) convsMap[m.lead_id] = [];
        convsMap[m.lead_id].push(m);
      });

      set({ 
        leads: leadsMap, 
        pipelines: pipelinesMap, 
        conversations: convsMap,
        activePipelineId: pData[0]?.id, 
        isLoading: false 
      });
    } catch (e) { set({ isLoading: false }); }
  },

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

  setActivePipeline: (id) => set({ activePipelineId: id }),
  setConnection: (type, status) => set((state) => ({ connections: { ...state.connections, [type]: status } })),
}));
