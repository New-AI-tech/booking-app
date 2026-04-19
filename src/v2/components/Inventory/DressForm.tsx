import React, { useState } from 'react';
import { inventoryService } from '../../services/inventoryService';
import { Dress } from '../../types';
import { Save, Plus, Trash2, Image as ImageIcon, Loader2 } from 'lucide-react';

interface DressFormProps {
    initialData?: Dress;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function DressForm({ initialData, onSuccess, onCancel }: DressFormProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Omit<Dress, 'id'>>(initialData || {
        name: '',
        description: '',
        basePrice: 0,
        category: 'Evening Wear',
        imageUrl: '',
        cleaningBufferDays: 1
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (initialData) {
                await inventoryService.updateDress(initialData.id, formData);
            } else {
                await inventoryService.addDress(formData);
            }
            onSuccess();
        } catch (error) {
            console.error('Save failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-10 space-y-10 border border-stone-100 shadow-xl max-w-2xl mx-auto animate-in slide-in-from-bottom-5 duration-500">
            <header className="space-y-1">
                <h2 className="text-3xl serif font-medium text-stone-900">{initialData ? 'Update Design' : 'Add New Design'}</h2>
                <p className="text-stone-400 text-sm">Register a new piece in the exclusive collection.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">Dress Name</label>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-6 py-4 outline-none focus:border-stone-900 focus:bg-white transition-all serif text-lg"
                        placeholder="e.g. Midnight Silk Gown"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">Category</label>
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-6 py-4 outline-none focus:border-stone-900 focus:bg-white transition-all appearance-none cursor-pointer"
                    >
                        <option>Evening Wear</option>
                        <option>Cocktail</option>
                        <option>Bridal</option>
                        <option>Accessories</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">Base Price ($)</label>
                    <input
                        type="number"
                        required
                        value={formData.basePrice}
                        onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                        className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-6 py-4 outline-none focus:border-stone-900 focus:bg-white transition-all"
                    />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">Image URL</label>
                    <div className="relative group">
                        <ImageIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
                        <input
                            type="url"
                            value={formData.imageUrl}
                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                            className="w-full pl-14 pr-6 py-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:border-stone-900 focus:bg-white transition-all text-sm"
                            placeholder="https://images.unsplash.com/..."
                        />
                    </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">Description</label>
                    <textarea
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-6 py-4 outline-none focus:border-stone-900 focus:bg-white transition-all text-sm resize-none"
                        placeholder="Detailed description of the style and material..."
                    />
                </div>
            </div>

            <div className="flex gap-4 pt-6">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 py-4 border border-stone-200 rounded-2xl font-bold text-stone-400 text-[10px] uppercase tracking-widest hover:bg-stone-50 transition-all"
                >
                    Discard
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-4 bg-stone-900 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-stone-800 transition-all shadow-xl shadow-stone-200 flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {initialData ? 'Update Piece' : 'Register Piece'}
                </button>
            </div>
        </form>
    );
}
