import React, { useState } from 'react';
import { inventoryService } from '../../services/inventoryService';
import { Dress, InventoryItem } from '../../types';
import { Save, Plus, Trash2, Image as ImageIcon, Loader2 } from 'lucide-react';

interface DressFormProps {
    initialData?: Dress;
    onSuccess: () => void;
    onCancel: () => void;
}

interface PhysicalItemDraft {
    size: string;
    color: string;
    sku: string;
}

export default function DressForm({ initialData, onSuccess, onCancel }: DressFormProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState<Omit<Dress, 'id' | 'createdAt'>>(initialData || {
        name: '',
        description: '',
        basePrice: 0,
        category: 'فساتين سهرة',
        imageUrl: '',
        cleaningBufferDays: 1,
    });
    const [items, setItems] = useState<PhysicalItemDraft[]>([{ size: 'M', color: '', sku: '' }]);

    const addItemRow = () => setItems(prev => [...prev, { size: 'M', color: '', sku: '' }]);
    const removeItemRow = (idx: number) => setItems(prev => prev.filter((_, i) => i !== idx));
    const updateItem = (idx: number, field: keyof PhysicalItemDraft, value: string) =>
        setItems(prev => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (initialData) {
                await inventoryService.updateDress(initialData.id, formData);
            } else {
                const dressId = await inventoryService.addDress(formData);
                await Promise.all(
                    items
                        .filter(item => item.size.trim() !== '')
                        .map(item =>
                            inventoryService.addInventoryItem({
                                dressId,
                                size: item.size,
                                color: item.color || undefined,
                                sku: item.sku || undefined,
                                status: 'available',
                            } as Omit<InventoryItem, 'id'>)
                        )
                );
            }
            onSuccess();
        } catch (err) {
            setError('فشل الحفظ. يرجى التحقق من البيانات والمحاولة مرة أخرى.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-10 space-y-10 border border-stone-100 shadow-xl max-w-2xl mx-auto text-right" dir="rtl">
            <header className="space-y-1">
                <h2 className="text-3xl font-serif font-medium text-stone-900">
                    {initialData ? 'تحديث التصميم' : 'تسجيل تصميم جديد'}
                </h2>
                <p className="text-stone-400 text-sm">أضف قطعة جديدة ومخزونها الفعلي في خطوة واحدة.</p>
            </header>

            {error && (
                <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 text-sm rounded-2xl">{error}</div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">اسم الفستان *</label>
                    <input
                        type="text" required value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-6 py-4 outline-none focus:border-stone-900 focus:bg-white transition-all font-serif text-lg text-right"
                        placeholder="مثال: فستان سهرة حريري أسود"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">الفئة *</label>
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-6 py-4 outline-none focus:border-stone-900 transition-all appearance-none cursor-pointer text-right"
                    >
                        <option>فساتين سهرة</option>
                        <option>كوكتيل</option>
                        <option>زفاف</option>
                        <option>إكسسوارات</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">السعر اليومي (ج.م) *</label>
                    <input
                        type="number" required min={0} value={formData.basePrice}
                        onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                        className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-6 py-4 outline-none focus:border-stone-900 transition-all text-right"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">فترة التنظيف (أيام) *</label>
                    <input
                        type="number" required min={0} max={14} value={formData.cleaningBufferDays}
                        onChange={(e) => setFormData({ ...formData, cleaningBufferDays: Number(e.target.value) })}
                        className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-6 py-4 outline-none focus:border-stone-900 transition-all text-right"
                    />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">رابط الصورة</label>
                    <div className="relative">
                        <ImageIcon className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
                        <input
                            type="url" value={formData.imageUrl ?? ''}
                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                            className="w-full pr-12 pl-6 py-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:border-stone-900 transition-all text-sm text-right"
                            placeholder="https://images.unsplash.com/..."
                        />
                    </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">الوصف</label>
                    <textarea
                        rows={2} value={formData.description ?? ''}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-6 py-4 outline-none focus:border-stone-900 transition-all text-sm resize-none text-right"
                        placeholder="تفاصيل التصميم، القماش، المناسبة..."
                    />
                </div>
            </div>

            {!initialData && (
                <div className="space-y-4 pt-4 border-t border-stone-100">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-widest">القطع الفعلية</h3>
                            <p className="text-xs text-stone-400 mt-0.5">أضف كل مقاس يتوفر لديك في المخزن.</p>
                        </div>
                        <button type="button" onClick={addItemRow}
                            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors px-4 py-2 border border-stone-200 rounded-xl">
                            <Plus className="w-3 h-3" /> إضافة مقاس
                        </button>
                    </div>
                    <div className="space-y-3">
                        {items.map((item, idx) => (
                            <div key={idx} className="flex gap-3 items-center">
                                <input
                                    placeholder="المقاس *" required value={item.size}
                                    onChange={(e) => updateItem(idx, 'size', e.target.value)}
                                    className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-stone-900 transition-all text-right"
                                />
                                <input
                                    placeholder="اللون" value={item.color}
                                    onChange={(e) => updateItem(idx, 'color', e.target.value)}
                                    className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-stone-900 transition-all text-right"
                                />
                                <input
                                    placeholder="رمز SKU" value={item.sku}
                                    onChange={(e) => updateItem(idx, 'sku', e.target.value)}
                                    className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-stone-900 transition-all text-right"
                                />
                                {items.length > 1 && (
                                    <button type="button" onClick={() => removeItemRow(idx)}
                                        className="p-2 text-stone-300 hover:text-rose-500 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex gap-4 pt-2">
                <button type="button" onClick={onCancel}
                    className="flex-1 py-4 border border-stone-200 rounded-2xl font-bold text-stone-400 text-[10px] uppercase tracking-widest hover:bg-stone-50 transition-all">
                    إلغاء
                </button>
                <button type="submit" disabled={loading}
                    className="flex-1 py-4 bg-stone-900 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-stone-800 transition-all shadow-xl shadow-stone-100 flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {initialData ? 'تحديث القطعة' : 'تسجيل وإضافة للمخزون'}
                </button>
            </div>
        </form>
    );
}
