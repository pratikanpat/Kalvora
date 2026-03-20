'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Check, Trash2, Loader2, IndianRupee } from 'lucide-react';
import toast from 'react-hot-toast';

interface Milestone {
    id: string;
    project_id: string;
    label: string;
    amount: number;
    due_date: string | null;
    paid_at: string | null;
    created_at: string;
}

interface Props {
    projectId: string;
    grandTotal: number;
}

const DEFAULT_PRESETS = [
    { label: 'Advance', pct: 30 },
    { label: 'Mid-project', pct: 40 },
    { label: 'Final', pct: 30 },
];

export default function PaymentMilestones({ projectId, grandTotal }: Props) {
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);

    // New milestone form
    const [newLabel, setNewLabel] = useState('');
    const [newAmount, setNewAmount] = useState('');
    const [newDueDate, setNewDueDate] = useState('');
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        loadMilestones();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectId]);

    const loadMilestones = async () => {
        const { data } = await supabase
            .from('payment_milestones')
            .select('*')
            .eq('project_id', projectId)
            .order('created_at', { ascending: true });
        setMilestones(data || []);
        setLoading(false);
    };

    const createDefaults = async () => {
        setAdding(true);
        const inserts = DEFAULT_PRESETS.map(p => ({
            project_id: projectId,
            label: p.label,
            amount: Math.round(grandTotal * (p.pct / 100)),
        }));
        const { error } = await supabase.from('payment_milestones').insert(inserts);
        if (error) {
            toast.error('Failed to create milestones');
        } else {
            toast.success('Milestones created');
            await loadMilestones();
        }
        setAdding(false);
    };

    const addMilestone = async () => {
        if (!newLabel.trim() || !newAmount) return;
        setAdding(true);
        const { error } = await supabase.from('payment_milestones').insert({
            project_id: projectId,
            label: newLabel.trim(),
            amount: parseFloat(newAmount),
            due_date: newDueDate || null,
        });
        if (error) {
            toast.error('Failed to add milestone');
        } else {
            toast.success('Milestone added');
            setNewLabel('');
            setNewAmount('');
            setNewDueDate('');
            setShowForm(false);
            await loadMilestones();
        }
        setAdding(false);
    };

    const markPaid = async (id: string) => {
        const { error } = await supabase
            .from('payment_milestones')
            .update({ paid_at: new Date().toISOString() })
            .eq('id', id);
        if (error) {
            toast.error('Failed to mark as paid');
        } else {
            setMilestones(prev => prev.map(m => m.id === id ? { ...m, paid_at: new Date().toISOString() } : m));
            toast.success('Marked as paid');
        }
    };

    const deleteMilestone = async (id: string) => {
        const { error } = await supabase.from('payment_milestones').delete().eq('id', id);
        if (error) {
            toast.error('Failed to delete');
        } else {
            setMilestones(prev => prev.filter(m => m.id !== id));
        }
    };

    const formatCurrency = (a: number) =>
        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(a);

    const totalPaid = milestones.filter(m => m.paid_at).reduce((s, m) => s + Number(m.amount), 0);
    const totalPending = milestones.filter(m => !m.paid_at).reduce((s, m) => s + Number(m.amount), 0);

    if (loading) return null;

    return (
        <div className="glass-card p-6 mb-6 animate-fade-in" style={{ animationDelay: '250ms' }}>
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-[10px] font-bold text-[#5a5a70] uppercase tracking-[0.15em]">
                    Payment Milestones
                </h3>
                {milestones.length > 0 && (
                    <div className="flex items-center gap-3 text-xs">
                        <span className="text-emerald-400">Paid: {formatCurrency(totalPaid)}</span>
                        <span className="text-amber-400">Pending: {formatCurrency(totalPending)}</span>
                    </div>
                )}
            </div>

            {milestones.length === 0 ? (
                <div className="text-center py-6">
                    <p className="text-[#5a5a70] text-sm mb-4">No payment milestones yet</p>
                    <button
                        onClick={createDefaults}
                        disabled={adding}
                        className="btn-primary text-sm py-2 mx-auto"
                    >
                        {adding ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
                        Create Default Milestones (30/40/30)
                    </button>
                </div>
            ) : (
                <div className="space-y-2">
                    {milestones.map((m) => (
                        <div
                            key={m.id}
                            className={`flex items-center justify-between py-3 px-4 rounded-xl border transition-all ${
                                m.paid_at
                                    ? 'bg-emerald-500/5 border-emerald-500/20'
                                    : 'bg-[#12121a]/50 border-[#1a1a2e]'
                            }`}
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${m.paid_at ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                                <div className="min-w-0">
                                    <span className="text-white text-sm font-medium">{m.label}</span>
                                    {m.due_date && (
                                        <span className="text-[#5a5a70] text-xs ml-2">
                                            Due: {new Date(m.due_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </span>
                                    )}
                                    {m.paid_at && (
                                        <span className="text-emerald-400/60 text-xs ml-2">
                                            ✓ Paid {new Date(m.paid_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <span className="text-white text-sm font-semibold">{formatCurrency(Number(m.amount))}</span>
                                {!m.paid_at && (
                                    <button
                                        onClick={() => markPaid(m.id)}
                                        className="p-1.5 rounded-lg hover:bg-emerald-500/15 text-emerald-400 transition-colors"
                                        title="Mark as Paid"
                                    >
                                        <Check size={14} />
                                    </button>
                                )}
                                <button
                                    onClick={() => deleteMilestone(m.id)}
                                    className="p-1.5 rounded-lg hover:bg-red-500/15 text-[#5a5a70] hover:text-red-400 transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add milestone form */}
            {milestones.length > 0 && !showForm && (
                <button
                    onClick={() => setShowForm(true)}
                    className="mt-3 flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300 transition-colors"
                >
                    <Plus size={14} /> Add Milestone
                </button>
            )}

            {showForm && (
                <div className="mt-4 p-4 rounded-xl bg-[#12121a]/50 border border-[#1a1a2e] space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input
                            type="text"
                            placeholder="Label (e.g. Advance)"
                            value={newLabel}
                            onChange={(e) => setNewLabel(e.target.value)}
                            className="input-field text-sm"
                        />
                        <div className="relative">
                            <IndianRupee size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5a5a70]" />
                            <input
                                type="number"
                                placeholder="Amount"
                                value={newAmount}
                                onChange={(e) => setNewAmount(e.target.value)}
                                className="input-field text-sm pl-8"
                            />
                        </div>
                        <input
                            type="date"
                            value={newDueDate}
                            onChange={(e) => setNewDueDate(e.target.value)}
                            className="input-field text-sm"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={addMilestone} disabled={adding} className="btn-primary text-xs py-2">
                            {adding ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                            Add
                        </button>
                        <button onClick={() => setShowForm(false)} className="btn-secondary text-xs py-2">
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
