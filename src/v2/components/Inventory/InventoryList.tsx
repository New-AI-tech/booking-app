import React, { useEffect, useState } from 'react';
import { inventoryService } from '../../services/inventoryService';
import { Dress } from '../../types';
import { Search, Filter, Loader2, Package } from 'lucide-react';

export default function InventoryList() {
    const [dresses, setDresses] = useState<Dress[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        inventoryService.fetchDresses().then(data => {
            setDresses(data);
            setLoading(false);
        });
    }, []);

    const filtered = dresses.filter(d => 
        d.name.toLowerCase().includes(search.toLowerCase()) || 
        d.category.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return (
        <div className="py-20 flex flex-col items-center justify-center gap-4 text-stone-400">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="font-serif italic italic text-sm">Organizing high-end collection...</p>
        </div>
    );

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl serif font-medium text-stone-900 mb-1">Our Collection</h2>
                    <p className="text-stone-500 text-sm">Fine evening wear and exclusive designs.</p>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
                        <input 
                            type="text" 
                            placeholder="Find a dress..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-12 pr-4 py-3 bg-white border border-stone-100 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-stone-900/5 transition-all w-64 shadow-sm"
                        />
                    </div>
                </div>
            </header>

            {filtered.length === 0 ? (
                <div className="py-20 text-center space-y-4 bg-stone-50 rounded-3xl border-2 border-dashed border-stone-200">
                    <Package className="w-10 h-10 text-stone-200 mx-auto" />
                    <p className="text-stone-500 font-serif italic text-lg">No pieces found matching your criteria.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {filtered.map(dress => (
                        <div key={dress.id} className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-stone-100 flex flex-col h-[500px]">
                            {/* Image Container */}
                            <div className="h-2/3 relative overflow-hidden">
                                <img 
                                    src={dress.imageUrl || `https://picsum.photos/seed/${dress.id}/800/1200`} 
                                    alt={dress.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute top-6 left-6">
                                    <span className="px-4 py-1.5 bg-white/95 backdrop-blur-sm rounded-full text-[10px] uppercase font-bold tracking-widest text-stone-900 shadow-sm">
                                        {dress.category}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-8 flex flex-col flex-1">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-2xl serif font-medium text-stone-900 group-hover:text-stone-700 transition-colors">{dress.name}</h3>
                                    <div className="text-right">
                                        <p className="text-xl font-serif font-bold text-stone-900">${dress.basePrice}</p>
                                        <p className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">Per Day</p>
                                    </div>
                                </div>
                                <p className="text-stone-500 text-sm line-clamp-2 italic font-serif flex-1">
                                    {dress.description || 'A timeless piece designed for moments of pure elegance and sophistication.'}
                                </p>
                                <div className="pt-6 mt-auto">
                                    <button className="w-full py-3 border border-stone-200 rounded-2xl text-[10px] uppercase tracking-widest font-bold text-stone-600 hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all">
                                        Check Availability
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
