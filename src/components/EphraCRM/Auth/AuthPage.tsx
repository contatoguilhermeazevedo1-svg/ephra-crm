import React, { useState, useEffect } from 'react';
import { useEphraStore } from '../../../store/EphraStore';
import { Mail, Lock, User, Rocket, AlertCircle, CheckCircle2, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const AuthPage: React.FC = () => {
  const [view, setView] = useState<'login' | 'signup' | 'forgot' | 'update'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'SDR' | 'Closer' | 'Director'>('SDR');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const { signIn, signUp, resetPassword, updatePassword, isLoading } = useEphraStore();

  // Detectar se o usuário veio de um link de recuperação de senha
  useEffect(() => {
    if (window.location.hash.includes('type=recovery')) {
      setView('update');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      if (view === 'login') {
        await signIn(email, password);
      } else if (view === 'signup') {
        await signUp(email, password, name, role);
        setSuccess('Verifique seu e-mail para confirmar o cadastro!');
      } else if (view === 'forgot') {
        await resetPassword(email);
        setSuccess('Link de recuperação enviado para o seu e-mail!');
      } else if (view === 'update') {
        await updatePassword(password);
        setSuccess('Senha atualizada com sucesso! Faça login.');
        setView('login');
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro.');
    }
  };

  return (
    <div style={{ backgroundColor: '#050505', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Inter, sans-serif' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{ width: '450px', backgroundColor: '#0a0a0a', padding: '50px', borderRadius: '30px', border: '1px solid #1a1a1a', boxShadow: '0 25px 50px rgba(139, 92, 246, 0.1)' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ width: '60px', height: '60px', backgroundColor: '#8b5cf6', borderRadius: '15px', margin: '0 auto 20px', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 0 30px rgba(139, 92, 246, 0.4)' }}>
            <Rocket color="#fff" size={32} />
          </div>
          <h1 style={{ color: '#fff', fontSize: '28px', fontWeight: 'bold', margin: 0 }}>EPHRA CRM</h1>
          <p style={{ color: '#555', marginTop: '10px' }}>
            {view === 'login' && 'Acesse sua conta corporativa.'}
            {view === 'signup' && 'Crie sua conta de alta performance.'}
            {view === 'forgot' && 'Recupere seu acesso à operação.'}
            {view === 'update' && 'Defina sua nova senha de acesso.'}
          </p>
        </div>

        {error && (
          <div style={{ backgroundColor: 'rgba(231, 76, 60, 0.1)', border: '1px solid #e74c3c', color: '#e74c3c', padding: '15px', borderRadius: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {success && (
          <div style={{ backgroundColor: 'rgba(46, 204, 113, 0.1)', border: '1px solid #2ecc71', color: '#2ecc71', padding: '15px', borderRadius: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}>
            <CheckCircle2 size={18} /> {success}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {view === 'signup' && (
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '15px', top: '15px', color: '#555' }} />
              <input type="text" placeholder="Nome Completo" value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', backgroundColor: '#111', border: '1px solid #222', padding: '15px 15px 15px 45px', borderRadius: '12px', color: '#fff', outline: 'none' }} required />
            </div>
          )}

          {view !== 'update' && (
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '15px', top: '15px', color: '#555' }} />
              <input type="email" placeholder="Email Corporativo" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', backgroundColor: '#111', border: '1px solid #222', padding: '15px 15px 15px 45px', borderRadius: '12px', color: '#fff', outline: 'none' }} required />
            </div>
          )}

          {view !== 'forgot' && (
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '15px', top: '15px', color: '#555' }} />
              <input type="password" placeholder={view === 'update' ? 'Nova Senha' : 'Senha'} value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', backgroundColor: '#111', border: '1px solid #222', padding: '15px 15px 15px 45px', borderRadius: '12px', color: '#fff', outline: 'none' }} required />
            </div>
          )}

          {view === 'signup' && (
            <div style={{ display: 'flex', gap: '10px' }}>
              {(['SDR', 'Closer', 'Director'] as const).map(r => (
                <button key={r} type="button" onClick={() => setRole(r)} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #222', backgroundColor: role === r ? '#8b5cf6' : '#111', color: role === r ? '#fff' : '#555', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>{r}</button>
              ))}
            </div>
          )}

          <button type="submit" disabled={isLoading} style={{ backgroundColor: '#8b5cf6', color: '#fff', border: 'none', padding: '18px', borderRadius: '15px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', opacity: isLoading ? 0.7 : 1 }}>
            {isLoading ? 'Aguarde...' : 
             view === 'login' ? 'Acessar CRM' : 
             view === 'signup' ? 'Criar Conta' : 
             view === 'forgot' ? 'Enviar Link' : 'Redefinir Senha'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {view === 'login' && (
            <>
              <span onClick={() => setView('forgot')} style={{ color: '#555', cursor: 'pointer', fontSize: '14px' }}>Esqueceu sua senha?</span>
              <p style={{ color: '#555', fontSize: '14px' }}>Não tem acesso? <span onClick={() => setView('signup')} style={{ color: '#8b5cf6', cursor: 'pointer', fontWeight: 'bold' }}>Cadastre-se</span></p>
            </>
          )}
          {(view === 'signup' || view === 'forgot') && (
            <p style={{ color: '#555', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', cursor: 'pointer' }} onClick={() => setView('login')}>
              <ChevronLeft size={16} /> Voltar para o Login
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
