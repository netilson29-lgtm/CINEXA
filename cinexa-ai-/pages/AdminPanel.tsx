
import React, { useEffect, useState } from 'react';
import { User, Generation, PaymentMethod } from '../types';
import { supabaseService } from '../services/supabaseService';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';

interface Props {
  user: User;
}

export const AdminPanel: React.FC<Props> = ({ user }) => {
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allGens, setAllGens] = useState<Generation[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loadingPay, setLoadingPay] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // New Method Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMethod, setNewMethod] = useState<Partial<PaymentMethod>>({
    name: '',
    detail: '',
    icon: '💳',
    isActive: true,
    bankName: '',
    accountNumber: '',
    beneficiary: ''
  });

  useEffect(() => {
    if (!user.isAdmin) {
        navigate('/');
        return;
    }
    loadData();
  }, [user, navigate]);

  const loadData = async () => {
    const u = await supabaseService.db.getAllUsers();
    const g = await supabaseService.db.getAllGenerations();
    const p = await supabaseService.db.getPaymentMethods();
    setAllUsers(u);
    setAllGens(g);
    setPaymentMethods(p);
  };

  const handleTogglePayment = (methodId: string) => {
    setPaymentMethods(prev => prev.map(p => 
        p.id === methodId ? { ...p, isActive: !p.isActive } : p
    ));
    setHasUnsavedChanges(true);
  };

  const handleInputChange = (id: string, field: keyof PaymentMethod, value: string) => {
    setPaymentMethods(prev => prev.map(p => 
        p.id === id ? { ...p, [field]: value } : p
    ));
    setHasUnsavedChanges(true);
  };

  const handleSaveChanges = async () => {
    if (!hasUnsavedChanges) return;

    const confirmed = window.confirm("Tem certeza que deseja salvar as alterações nos métodos de pagamento?");
    if (!confirmed) return;

    setLoadingPay(true);
    try {
        await Promise.all(paymentMethods.map(method => 
            supabaseService.db.updatePaymentMethod(method)
        ));
        setHasUnsavedChanges(false);
        alert("Configurações salvas com sucesso.");
    } catch (e) {
        alert("Erro ao salvar configurações.");
    } finally {
        setLoadingPay(false);
    }
  };

  const handleCreateMethod = async () => {
    if (!newMethod.name || !newMethod.detail) {
        alert("Preencha o nome e o detalhe.");
        return;
    }

    const method: PaymentMethod = {
        id: Math.random().toString(36).substr(2, 9),
        name: newMethod.name!,
        detail: newMethod.detail!,
        icon: newMethod.icon || '💳',
        isActive: true,
        bankName: newMethod.bankName || '',
        accountNumber: newMethod.accountNumber || '',
        beneficiary: newMethod.beneficiary || ''
    };

    await supabaseService.db.addPaymentMethod(method);
    await loadData();
    setShowAddModal(false);
    setNewMethod({ name: '', detail: '', icon: '💳', isActive: true, bankName: '', accountNumber: '', beneficiary: '' });
  };

  const handleDeleteMethod = async (id: string) => {
    if (window.confirm("Tem certeza que deseja remover este método de pagamento?")) {
        await supabaseService.db.deletePaymentMethod(id);
        await loadData();
    }
  };

  const totalRevenue = allUsers.reduce((acc, curr) => {
    if (curr.plan === 'PLUS') return acc + 29;
    if (curr.plan === 'PREMIUM') return acc + 99;
    return acc;
  }, 0);

  return (
    <div className="space-y-10 pb-10">
      <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white tracking-tight">Painel de Controle</h1>
          <div className="bg-red-500/10 text-red-400 px-4 py-1.5 rounded-full text-xs font-bold border border-red-500/20 uppercase tracking-widest">
            Acesso Global
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={allUsers.length} icon="👥" />
        <StatCard title="Gerações" value={allGens.length} icon="🎬" />
        <StatCard title="Receita (Est)" value={`$${totalRevenue}`} icon="💰" />
        <StatCard title="Uptime" value="99.9%" icon="⚡" />
      </div>

      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden relative">
        <div className="p-6 border-b border-white/5 bg-[#0a0a0a] flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
                <h3 className="font-bold text-white text-lg">Gateway de Pagamentos</h3>
                <p className="text-xs text-zinc-500">Gestão financeira e contas de recebimento.</p>
            </div>
            
            <div className="flex gap-2">
                <Button 
                    variant="secondary"
                    onClick={() => setShowAddModal(true)}
                    className="text-sm py-2"
                >
                    + Novo Método
                </Button>
                <Button 
                    onClick={handleSaveChanges} 
                    isLoading={loadingPay}
                    disabled={!hasUnsavedChanges}
                    className={`${hasUnsavedChanges ? 'bg-green-600 hover:bg-green-500 shadow-lg shadow-green-900/20' : 'bg-white/5 opacity-50 cursor-not-allowed'}`}
                >
                    {loadingPay ? 'Salvando...' : (hasUnsavedChanges ? 'Salvar Alterações' : 'Sincronizado')}
                </Button>
            </div>
        </div>

        <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {paymentMethods.map(method => (
                <div key={method.id} className={`relative p-6 rounded-2xl border transition-all duration-300 group ${method.isActive ? 'bg-white/5 border-white/10' : 'bg-red-900/5 border-red-500/10 opacity-60 grayscale-[0.5]'}`}>
                    
                    <button 
                        onClick={() => handleDeleteMethod(method.id)}
                        className="absolute top-2 right-2 text-zinc-600 hover:text-red-400 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remover Método"
                    >
                        🗑️
                    </button>

                    <div className="flex justify-between items-start pb-4 border-b border-white/5 mb-4">
                        <div className="flex items-center gap-4">
                            <input 
                                type="text" 
                                className="text-3xl bg-[#0a0a0a] p-3 rounded-xl shadow-inner w-16 text-center focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                value={method.icon}
                                onChange={(e) => handleInputChange(method.id, 'icon', e.target.value)}
                            />
                            <div>
                                <input 
                                    type="text" 
                                    className="font-bold text-white text-lg bg-transparent border-b border-transparent hover:border-white/20 focus:border-indigo-500 focus:outline-none w-full"
                                    value={method.name}
                                    onChange={(e) => handleInputChange(method.id, 'name', e.target.value)}
                                />
                                <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold ${method.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {method.isActive ? 'Ativo' : 'Inativo'}
                                </span>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer mr-8">
                            <input 
                                type="checkbox" 
                                className="sr-only peer" 
                                checked={method.isActive}
                                onChange={() => handleTogglePayment(method.id)}
                            />
                            <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] text-indigo-400 uppercase tracking-widest font-bold block mb-1">Banco / Rede</label>
                            <input 
                                type="text" 
                                className="glass-input w-full rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                                value={method.bankName || ''}
                                onChange={(e) => handleInputChange(method.id, 'bankName', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-[10px] text-indigo-400 uppercase tracking-widest font-bold block mb-1">Conta / IBAN</label>
                            <input 
                                type="text" 
                                className="glass-input w-full rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none"
                                value={method.accountNumber || ''}
                                onChange={(e) => handleInputChange(method.id, 'accountNumber', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-[10px] text-indigo-400 uppercase tracking-widest font-bold block mb-1">Titular</label>
                            <input 
                                type="text" 
                                className="glass-input w-full rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                                value={method.beneficiary || ''}
                                onChange={(e) => handleInputChange(method.id, 'beneficiary', e.target.value)}
                            />
                        </div>
                         <div>
                            <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold block mb-1">Info Checkout</label>
                            <input 
                                type="text" 
                                className="glass-input w-full rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none"
                                value={method.detail}
                                onChange={(e) => handleInputChange(method.id, 'detail', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* New Method Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#0f0f0f] rounded-2xl border border-white/10 w-full max-w-md p-6 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-6">Adicionar Método de Pagamento</h3>
                
                <div className="space-y-4 mb-6">
                    <div>
                        <label className="text-xs text-zinc-400 uppercase block mb-1">Nome do Método</label>
                        <input 
                            className="glass-input w-full rounded-lg p-2 text-white"
                            value={newMethod.name}
                            onChange={e => setNewMethod({...newMethod, name: e.target.value})}
                            placeholder="Ex: Western Union"
                        />
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        <div className="col-span-1">
                            <label className="text-xs text-zinc-400 uppercase block mb-1">Ícone</label>
                            <input 
                                className="glass-input w-full rounded-lg p-2 text-center"
                                value={newMethod.icon}
                                onChange={e => setNewMethod({...newMethod, icon: e.target.value})}
                                placeholder="💸"
                            />
                        </div>
                         <div className="col-span-3">
                            <label className="text-xs text-zinc-400 uppercase block mb-1">Detalhe (Subtítulo)</label>
                            <input 
                                className="glass-input w-full rounded-lg p-2 text-white"
                                value={newMethod.detail}
                                onChange={e => setNewMethod({...newMethod, detail: e.target.value})}
                                placeholder="Ex: Transferência Internacional"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs text-zinc-400 uppercase block mb-1">Banco / Rede</label>
                        <input 
                            className="glass-input w-full rounded-lg p-2 text-white"
                            value={newMethod.bankName}
                            onChange={e => setNewMethod({...newMethod, bankName: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="text-xs text-zinc-400 uppercase block mb-1">Conta / IBAN / Chave</label>
                        <input 
                            className="glass-input w-full rounded-lg p-2 text-white"
                            value={newMethod.accountNumber}
                            onChange={e => setNewMethod({...newMethod, accountNumber: e.target.value})}
                        />
                    </div>
                     <div>
                        <label className="text-xs text-zinc-400 uppercase block mb-1">Beneficiário</label>
                        <input 
                            className="glass-input w-full rounded-lg p-2 text-white"
                            value={newMethod.beneficiary}
                            onChange={e => setNewMethod({...newMethod, beneficiary: e.target.value})}
                        />
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button variant="secondary" onClick={() => setShowAddModal(false)} className="flex-1">Cancelar</Button>
                    <Button onClick={handleCreateMethod} className="flex-1">Adicionar</Button>
                </div>
            </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
            <div className="p-5 border-b border-white/5 bg-[#0a0a0a]">
                <h3 className="font-bold text-white">Últimos Registros</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-zinc-500 uppercase bg-white/5">
                        <tr>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Plan</th>
                            <th className="px-6 py-4">Credits</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {allUsers.slice(0, 5).map(u => (
                            <tr key={u.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 text-white font-medium">{u.email}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">{u.plan}</span>
                                </td>
                                <td className="px-6 py-4 text-zinc-300">{u.credits}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
            <div className="p-5 border-b border-white/5 bg-[#0a0a0a]">
                <h3 className="font-bold text-white">Log de Gerações</h3>
            </div>
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-zinc-500 uppercase bg-white/5">
                        <tr>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {allGens.slice(0, 5).map(g => (
                            <tr key={g.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 text-white">{g.type}</td>
                                <td className="px-6 py-4">
                                    <span className="text-emerald-400 font-medium text-xs">{g.status}</span>
                                </td>
                                <td className="px-6 py-4 text-zinc-400 font-mono text-xs">{new Date(g.createdAt).toLocaleTimeString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon }: any) => (
    <div className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
            <span className="text-5xl grayscale">{icon}</span>
        </div>
        <div className="flex items-center justify-between mb-4">
            <span className="text-zinc-500 text-xs uppercase tracking-widest font-bold">{title}</span>
            <span className="text-xl bg-white/5 p-2 rounded-lg">{icon}</span>
        </div>
        <div className="text-3xl font-bold text-white">{value}</div>
    </div>
);
