import React, { useEffect, useState } from 'react';
import { inventoryService } from '../../services/inventoryService';
import { Dress } from '../../types';
import AvailabilityChecker from './AvailabilityChecker';
import DressForm from './DressForm';
import { Search, Plus, Loader2, Package } from 'lucide-react';

interface Props {
    isAdmin: boolean;
}

export default function InventoryList({ isAdmin }: Props) {
    const [dresses, setDresses] = useState<Dress[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [checkerDress, setCheckerDress] = useState<Dress | null>(null);

    const reload = async () => {
        setLoading(true);
        const data = await inventoryService.fetchDresses();
        setDresses(data);
        setLoading(false);
    };

    useEffect(() => { reload(); }, []);

    const filtered = dresses.filter(d =>
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.category.toLowerCase().includes(search.toLowerCase())
    );

    if (showForm) {
        return <DressForm onSuccess={() => { setShowForm(false); reload(); }} onCancel={() => setShowForm(false)} />;
    }

    if (checkerDress) {
        return (
            <div className="max-w-lg mx-auto space-y-8">
                <button onClick={() => setCheckerDress(null)}
                    className="text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors flex items-center gap-2">
                    ← Back to Collection
                </button>
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-stone-100 space-y-4">
                    <div className="flex items-center gap-4">
                        {checkerDress.imageUrl && (
                            <img src={checkerDress.imageUrl} alt={checkerDress.name}
                                className="w-20 h-20 object-cover rounded-2xl flex-shrink-0" />
                        )}
                        <div>
                            <h2 className="text-2xl font-serif text-stone-900">{checkerDress.name}</h2>
                            <p className="text-stone-400 text-sm">{checkerDress.category} · ${checkerDress.basePrice}/day</p>
                        </div>
                    </div>
                    <AvailabilityChecker dress={checkerDress} />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-serif font-medium text-stone-900 mb-1">The Collection</h2>
                    <p className="text-stone-400 text-sm">Fine evening wear and exclusive designs.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
                        <input type="text" placeholder="Search..." value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-12 pr-4 py-3 bg-white border border-stone-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-stone-900/5 w-56 shadow-sm" />
                    </div>
                    {isAdmin && (
                        <button onClick={() => setShowForm(true)}
                            className="flex items-center gap-2 px-5 py-3 bg-stone-900 text-white rounded-2xl text-[10px] uppercase tracking-widest font-bold hover:bg-stone-800 transition-all shadow-xl shadow-stone-200">
                            <Plus className="w-3.5 h-3.5" /> New Design
                        </button>
                    )}
                </div>
            </header>

            {loading ? (
                <div className="py-24 flex flex-col items-center gap-4 text-stone-300">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <p className="font-serif italic text-sm">Fetching collection...</p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="py-24 text-center space-y-4 bg-white rounded-3xl border-2 border-dashed border-stone-100">
                    <Package className="w-10 h-10 text-stone-200 mx-auto" />
                    <p className="text-stone-400 font-serif italic">No designs found.</p>
                    {isAdmin && (
                        <button onClick={() => setShowForm(true)}
                            className="text-[10px] font-bold uppercase tracking-widest text-stone-900 hover:underline">
                            Add the first design →
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {filtered.map(dress => (
                        <div key={dress.id}
                            className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-stone-100 flex flex-col">
                            <div className="h-64 relative overflow-hidden bg-stone-100">
                                <img
                                    src={dress.imageUrl || `https://picsum.photos/seed/${dress.id}/600/800`}
                                    alt={dress.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] uppercase font-bold tracking-widest shadow-sm">
                                        {dress.category}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6 flex flex-col flex-1 space-y-4">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-xl font-serif font-medium text-stone-900">{dress.name}</h3>
                                    <div className="text-right flex-shrink-0 ml-2">
                                        <p className="text-lg font-serif font-bold">${dress.basePrice}</p>
                                        <p className="text-[10px] text-stone-400 uppercase font-bold">/ day</p>
                                    </div>
                                </div>
                                {dress.description && (
                                    <p className="text-stone-500 text-sm line-clamp-2 italic font-serif">{dress.description}</p>
                                )}
                                <div className="mt-auto pt-4">
                                    <button onClick={() => setCheckerDress(dress)}
                                        className="w-full py-3 border border-stone-200 rounded-2xl text-[10px] uppercase tracking-widest font-bold text-stone-600 hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all">
                                        Check Availability & Book
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
