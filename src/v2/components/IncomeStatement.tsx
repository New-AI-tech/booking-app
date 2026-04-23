import React, { useEffect, useState } from 'react';
import { fetchIncomeData } from '../services/incomeService';
import { IncomeData } from '../types';
import { TrendingUp, TrendingDown, DollarSign, Loader2, ChevronDown, FileText, Activity, Calendar } from 'lucide-react';

export default function IncomeStatement() {
    const now = new Date();
    const [month, setMonth] = useState(now.getMonth() + 1);
    const [year, setYear] = useState(now.getFullYear());
    const [data, setData] = useState<IncomeData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        setLoading(true);
        setError('');
        fetchIncomeData(month, year)
            .then((res) => {
                setData(res || {
                    revenue: 0,
                    maintenanceCosts: 0,
                    fixedCosts: 8150,
                    grossProfit: 0,
                    netProfit: -8150,
                    bookingCount: 0
                });
            })
            .catch((err) => {
                console.error('Financial data fetch error:', err);
                if (err.code === 'failed-precondition') {
                    setError('النظام يقوم بتحديث الفهارس، يرجى الانتظار دقيقتين.');
                } else {
                    setError('فشل في تحميل البيانات المالية.');
                }
            })
            .finally(() => setLoading(false));
    }, [month, year]);

    const months = [
        'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
        'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('ar-EG', {
            style: 'currency',
            currency: 'EGP',
            minimumFractionDigits: 2
        }).format(Math.abs(value || 0));
    };

    const Row = ({ label, value, sub, bold, isNegative }: { label: string; value: number; sub?: boolean; bold?: boolean; isNegative?: boolean }) => (
        <div className={`flex justify-between items-center py-4 ${sub ? 'pr-8 text-stone-500' : 'border-t border-stone-100'} ${bold ? 'bg-stone-50/50 -mx-8 px-8' : ''}`}>
            <span className={`text-sm ${sub ? 'text-xs' : bold ? 'font-bold text-stone-900' : 'font-semibold text-stone-800'}`}>
                {label}
            </span>
            <span className={`font-mono text-sm font-bold ${isNegative || value < 0 ? 'text-rose-600' : 'text-stone-900'}`} dir="ltr">
                {isNegative || value < 0 ? '-' : ''}{formatCurrency(value)}
            </span>
        </div>
    );

    return (
        <div className="space-y-8 max-w-4xl mx-auto pb-20 animate-in" dir="rtl">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-stone-200 pb-8">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-stone-900 rounded-xl">
                        <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-stone-900">كشف الدخل</h2>
                        <p className="text-stone-500 text-sm mt-1">التقرير المالي الشهري المفصل.</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-stone-200 shadow-sm">
                    <div className="relative">
                        <select value={month} onChange={(e) => setMonth(Number(e.target.value))}
                            className="pr-4 pl-9 py-2 bg-transparent text-sm font-bold text-stone-700 appearance-none outline-none cursor-pointer min-w-[120px]">
                            {months.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                        </select>
                        <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                    </div>
                    <div className="w-px h-6 bg-stone-200" />
                    <div className="relative">
                        <select value={year} onChange={(e) => setYear(Number(e.target.value))}
                            className="pr-4 pl-9 py-2 bg-transparent text-sm font-bold text-stone-700 appearance-none outline-none cursor-pointer min-w-[90px]">
                            {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                        <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                    </div>
                </div>
            </header>

            {loading ? (
                <div className="py-32 flex flex-col items-center gap-4 text-stone-400">
                    <Loader2 className="w-10 h-10 animate-spin" />
                    <p className="text-lg font-medium">جاري معالجة البيانات...</p>
                </div>
            ) : error ? (
                <div className="p-8 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-center font-medium">
                    {error}
                </div>
            ) : data ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-white border border-stone-200 rounded-2xl p-8 space-y-4">
                            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em]">الإيرادات</p>
                            <p className="text-3xl font-bold text-stone-900" dir="ltr">{formatCurrency(data.revenue)}</p>
                            <div className="pt-2 border-t border-stone-100 flex justify-between text-xs font-bold text-stone-400">
                                <span>عدد الحجوزات</span>
                                <span className="text-stone-900">{data.bookingCount}</span>
                            </div>
                        </div>

                        <div className={`border rounded-2xl p-8 space-y-4 ${data.grossProfit >= 0 ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
                            <div className="flex justify-between items-start">
                                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em]">إجمالي الربح</p>
                                {data.grossProfit >= 0 ? <TrendingUp className="w-5 h-5 text-emerald-500" /> : <TrendingDown className="w-5 h-5 text-rose-500" />}
                            </div>
                            <p className={`text-3xl font-bold ${data.grossProfit >= 0 ? 'text-emerald-700' : 'text-rose-600'}`} dir="ltr">
                                {formatCurrency(data.grossProfit)}
                            </p>
                        </div>

                        <div className={`border rounded-2xl p-8 space-y-4 ${data.netProfit >= 0 ? 'bg-stone-900 border-stone-800' : 'bg-rose-600 border-rose-500'}`}>
                            <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">صافي الأرباح</p>
                            <p className="text-3xl font-bold text-white" dir="ltr">{formatCurrency(data.netProfit)}</p>
                            <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-white transition-all duration-1000" 
                                    style={{ width: `${Math.min(Math.max((data.netProfit / (data.revenue || 1)) * 100, 0), 100)}%` }} 
                                />
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2 bg-white border border-stone-200 rounded-2xl p-10">
                        <div className="flex items-center gap-2 mb-8 text-stone-400">
                            <Activity className="w-4 h-4" />
                            <h3 className="text-xs font-bold uppercase tracking-widest">التفاصيل المالية</h3>
                        </div>

                        <div className="space-y-1">
                            <Row label="إجمالي إيرادات التأجير" value={data.revenue || 0} />
                            
                            <div className="py-2" />
                            
                            <div className="space-y-0.5">
                                <Row label="التكاليف التشغيلية المتغيرة" value={data.maintenanceCosts || 0} isNegative />
                                <Row label="صيانة وإصلاح الفساتين" value={data.maintenanceCosts || 0} sub isNegative />
                            </div>

                            <div className="py-4" />
                            
                            <Row label="إجمالي الربح التشغيلي" value={data.grossProfit || 0} bold />

                            <div className="py-2" />

                            <div className="space-y-0.5">
                                <Row label="المصاريف التشغيلية الثابتة" value={data.fixedCosts || 0} isNegative />
                                <Row label="إيجار، رواتب، ومرافق" value={data.fixedCosts || 0} sub isNegative />
                            </div>

                            <div className="mt-10 pt-10 border-t-2 border-stone-900">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <span className="font-bold text-stone-900 text-lg">صافي الربح النهائي</span>
                                        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-1">الحالة: {data.netProfit >= 0 ? 'أداء إيجابي' : 'أداء سلبي'}</p>
                                    </div>
                                    <span className={`font-mono font-bold text-3xl ${data.netProfit >= 0 ? 'text-stone-900' : 'text-rose-600'}`} dir="ltr">
                                        {formatCurrency(data.netProfit)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
