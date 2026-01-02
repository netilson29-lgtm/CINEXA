import React, { useState, useEffect } from 'react';
import { PLANS } from '../constants';
import { PlanType, User, PaymentMethod } from '../types';
import { Button } from '../components/Button';
import { supabaseService } from '../services/supabaseService';

interface Props {
  user: User;
}

export const Pricing: React.FC<Props> = ({ user }) => {
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeMethods, setActiveMethods] = useState<PaymentMethod[]>([]);
  
  useEffect(() => {
    const fetchMethods = async () => {
        const methods = await supabaseService.db.getPaymentMethods();
        const active = methods.filter(m => m.isActive);
        setActiveMethods(active);
        if (active.length > 0) {
            setPaymentMethod(active[0].id);
        }
    };
    fetchMethods();
  }, []);

  const initiateCheckout = (planId: PlanType) => {
    if (planId === PlanType.FREE) return;
    setSelectedPlan(planId);
  };

  const handlePayment = async () => {
    if (!selectedPlan) return;
    
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 2500));
    
    const plan = PLANS[selectedPlan];
    const newCredits = user.credits + plan.credits;
    
    await supabaseService.db.updateUserCredits(user.id, newCredits);
    
    setIsProcessing(false);
    setSelectedPlan(null);
    
    const methodUsed = activeMethods.find(m => m.id === paymentMethod);
    alert(`Pagamento Confirmado!\n\nVocê enviou o comprovativo para: ${methodUsed?.beneficiary}\n${plan.credits} créditos foram adicionados à sua conta.`);
    window.location.reload();
  };

  const selectedMethodDetails = activeMethods.find(m => m.id === paymentMethod);

  return (
    <div className="max-w-6xl mx-auto text-center relative py-10">
      <div className="mb-16">
          <h1 className="text-5xl font-bold text-white mb-6 tracking-tight">Planos & Preços</h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">Escolha o nível de poder computacional que você precisa para seus projetos de IA.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        {Object.values(PLANS).map((plan) => {
            const isCurrent = user.plan === plan.id;
            const isPremium = plan.id === PlanType.PREMIUM;
            
            return (
                <div key={plan.id} className={`relative glass-panel rounded-3xl p-8 flex flex-col transition-transform duration-300 hover:-translate-y-2 ${isPremium ? 'border-indigo-500/50 shadow-[0_0_40px_rgba(79,70,229,0.15)] z-10 scale-105 bg-[#0a0a0a]' : 'border-white/5 bg-transparent'}`}>
                    {isPremium && (
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-xs font-bold px-6 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                            Recomendado
                        </div>
                    )}
                    
                    <h3 className={`text-xl font-bold mb-2 ${isPremium ? 'text-indigo-400' : 'text-white'}`}>{plan.name}</h3>
                    <div className="text-5xl font-bold text-white mb-8 tracking-tighter">
                        {plan.price === 0 ? 'Free' : `$${plan.price}`}
                        {plan.price > 0 && <span className="text-lg font-normal text-zinc-500 ml-1">/mês</span>}
                    </div>

                    <ul className="text-left space-y-5 mb-10 flex-1 px-4">
                        <li className="flex items-center gap-4 text-zinc-300">
                            <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm">✓</span> 
                            <span className="font-semibold text-white">{plan.credits}</span> Créditos
                        </li>
                        <li className="flex items-center gap-4 text-zinc-300">
                            <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm">✓</span> 
                            Vídeos até <span className="font-semibold text-white">{plan.maxVideoDuration} min</span>
                        </li>
                        {plan.features.map((feature, i) => (
                            <li key={i} className="flex items-center gap-4 text-zinc-400">
                                <span className="w-6 h-6 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-sm">✓</span> 
                                {feature}
                            </li>
                        ))}
                    </ul>

                    <Button 
                        variant={isPremium ? 'primary' : 'secondary'} 
                        className={`w-full justify-center py-4 rounded-xl ${isCurrent ? 'opacity-50' : ''}`}
                        onClick={() => initiateCheckout(plan.id)}
                        disabled={isCurrent}
                    >
                        {isCurrent ? 'Seu Plano Atual' : (plan.price === 0 ? 'Plano Gratuito' : 'Começar Agora')}
                    </Button>
                </div>
            );
        })}
      </div>

      {/* Payment Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <div className="bg-[#0f0f0f] rounded-3xl border border-white/10 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-[fadeIn_0.3s_ease-out]">
                
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#050505]">
                    <div>
                        <h2 className="text-xl font-bold text-white">Checkout Seguro</h2>
                        <p className="text-sm text-zinc-400">Upgrade para {PLANS[selectedPlan].name}</p>
                    </div>
                    <button onClick={() => setSelectedPlan(null)} className="text-zinc-500 hover:text-white transition-colors">✕</button>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto custom-scrollbar">
                    {/* Summary */}
                    <div className="flex justify-between items-center mb-8">
                        <div className="text-3xl font-bold text-white">${PLANS[selectedPlan].price}</div>
                        <div className="text-zinc-500">Cobrado mensalmente</div>
                    </div>

                    {/* Payment Methods */}
                    <h3 className="text-zinc-500 font-bold text-xs uppercase tracking-widest mb-4">Selecione o Método</h3>
                    <div className="space-y-3 mb-8">
                        {activeMethods.map((method) => (
                            <div 
                                key={method.id}
                                onClick={() => setPaymentMethod(method.id)}
                                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-4 ${
                                    paymentMethod === method.id 
                                        ? 'bg-indigo-600/10 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.15)]' 
                                        : 'bg-white/5 border-white/5 hover:bg-white/10'
                                }`}
                            >
                                <div className="text-2xl">{method.icon}</div>
                                <div className="flex-1">
                                    <div className="text-white font-medium">{method.name}</div>
                                    <div className="text-zinc-500 text-xs">{method.detail}</div>
                                </div>
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                    paymentMethod === method.id ? 'border-indigo-500' : 'border-zinc-600'
                                }`}>
                                    {paymentMethod === method.id && <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full shadow-[0_0_8px_#6366f1]" />}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bank Transfer Details Box */}
                    {selectedMethodDetails && selectedMethodDetails.id !== 'card' && (
                        <div className="bg-zinc-900/50 rounded-xl border border-white/5 p-5 mb-4">
                            <h4 className="text-indigo-400 font-bold text-xs mb-4 uppercase tracking-wider flex items-center gap-2">
                                Dados Bancários
                            </h4>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span className="text-zinc-500">Instituição</span>
                                    <span className="text-white font-medium">{selectedMethodDetails.bankName}</span>
                                </div>
                                <div className="flex flex-col border-b border-white/5 pb-2">
                                    <span className="text-zinc-500 mb-1">Identificador / Conta</span>
                                    <div className="bg-black p-2 rounded border border-white/10 font-mono text-xs text-indigo-300 select-all">
                                        {selectedMethodDetails.accountNumber}
                                    </div>
                                </div>
                                <div className="flex justify-between pt-1">
                                    <span className="text-zinc-500">Beneficiário</span>
                                    <span className="text-white font-medium">{selectedMethodDetails.beneficiary}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/5 bg-[#050505]">
                    <Button 
                        onClick={handlePayment} 
                        isLoading={isProcessing}
                        className="w-full py-4 text-lg"
                        disabled={activeMethods.length === 0}
                    >
                        {isProcessing ? 'Processando...' : 
                            (paymentMethod === 'card' ? 'Pagar com Cartão' : 'Confirmar Transferência')
                        }
                    </Button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};