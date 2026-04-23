import React, { useEffect, useState } from 'react';
import { fetchIncomeData } from '../services/incomeService';
import { IncomeData } from '../types';
import { TrendingUp, TrendingDown, DollarSign, Loader2, ChevronDown, PieChart, Activity, Wallet } from 'lucide-react';

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
                    fixedCosts: 8150, // Updated to match current service calculation
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
        }).format(value || 0);
    };

    const Row = ({ label, value, sub, bold }: { label: string; value: number; sub?: boolean; bold?: boolean }) => (
        <div className={`flex justify-between items-center py-4 ${sub ? 'pr-8 text-stone-500' : 'border-t border-stone-100'} ${bold ? 'bg-stone-50/50 -mx-8 px-8' : ''}`}>
            <span className={`text-sm ${sub ? 'text-xs' : bold ? 'font-bold text-stone-900' : 'font-semibold text-stone-800'}`}>
                {label}
            </span>
            <span className={`font-mono text-sm font-bold ${value < 0 ? 'text-rose-600' : 'text-stone-900'}`} dir="ltr">
                {formatCurrency(value)}
            </span>
        </div>
    );

    return (
        <div className="space-y-8 max-w-3xl mx-auto pb-20" dir="rtl">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-stone-200">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-stone-900 rounded-xl">
                            <PieChart className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-stone-900 tracking-tight">كشف الدخل التفصيلي</h2>
                    </div>
                    <p className="text-stone-500 text-sm font-medium mr-12">تقرير الأداء المالي المباشر من النظام</p>
                </div>
                
                <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-stone-200 shadow-sm">
                    <div className="relative">
                        <select value={month} onChange={(e) => setMonth(Number(e.target.value))}
                            className="pr-4 pl-9 py-2.5 bg-transparent text-sm font-bold text-stone-700 appearance-none outline-none cursor-pointer min-w-[120px]">
                            {months.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                        </select>
                        <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                    </div>
                    <div className="w-px h-6 bg-stone-200" />
                    <div className="relative">
                        <select value={year} onChange={(e) => setYear(Number(e.target.value))}
                            className="pr-4 pl-9 py-2.5 bg-transparent text-sm font-bold text-stone-700 appearance-none outline-none cursor-pointer min-w-[100px]">
                            {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                        <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                    </div>
                </div>
            </header>

            {loading ? (
                <div className="py-32 flex flex-col items-center gap-6 text-stone-300">
                    <div className="relative">
                        <Loader2 className="w-12 h-12 animate-spin text-stone-900" />
                        <Activity className="w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-stone-900" />
                    </div>
                    <p className="font-serif italic text-lg text-stone-500 animate-pulse">جاري تحليل البيانات المالية...</p>
                </div>
            ) : error ? (
                <div className="p-8 bg-rose-50 border border-rose-100 text-rose-600 rounded-3xl text-sm text-center font-medium shadow-sm">
                    {error}
                </div>
            ) : data ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white border border-stone-200 rounded-3xl p-7 space-y-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-stone-50 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110" />
                            <div className="relative flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-1">الإيرادات</p>
                                    <p className="text-3xl font-serif font-bold text-stone-900" dir="ltr">
                                        {formatCurrency(data.revenue)}
                                    </p>
                                </div>
                                <Wallet className="w-5 h-5 text-stone-300" />
                            </div>
                            <div className="pt-2 flex items-center gap-2">
                                <span className="px-2 py-1 bg-stone-100 rounded-lg text-[10px] font-bold text-stone-600 uppercase tracking-wider">
                                    {data.bookingCount || 0} عملية حجز
                                </span>
                            </div>
                        </div>

                        <div className={`border rounded-3xl p-7 space-y-4 shadow-sm relative overflow-hidden group transition-all ${(data.grossProfit || 0) >= 0 ? 'bg-emerald-50/50 border-emerald-100' : 'bg-rose-50/50 border-rose-100'}`}>
                            <div className="relative flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-1">إجمالي الربح</p>
                                    <p className={`text-3xl font-serif font-bold ${(data.grossProfit || 0) >= 0 ? 'text-emerald-700' : 'text-rose-600'}`} dir="ltr">
                                        {formatCurrency(data.grossProfit)}
                                    </p>
                                </div>
                                {(data.grossProfit || 0) >= 0 ? <TrendingUp className="w-6 h-6 text-emerald-500" /> : <TrendingDown className="w-6 h-6 text-rose-500" />}
                            </div>
                            <p className="text-[10px] text-stone-500 font-medium">الربح قبل خصم التكاليف الثابتة</p>
                        </div>

                        <div className={`border rounded-3xl p-7 space-y-4 shadow-sm relative overflow-hidden group transition-all ${(data.netProfit || 0) >= 0 ? 'bg-stone-900 border-stone-800' : 'bg-rose-600 border-rose-500'}`}>
                            <div className="relative flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 mb-1">صافي الأرباح</p>
                                    <p className="text-3xl font-serif font-bold text-white" dir="ltr">
                                        {formatCurrency(data.netProfit)}
                                    </p>
                                </div>
                                <DollarSign className="w-6 h-6 text-white/30" />
                            </div>
                            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-white/40 transition-all duration-1000" 
                                    style={{ width: `${Math.min(Math.max((data.netProfit / (data.revenue || 1)) * 100, 0), 100)}%` }} 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Detailed Financial Statement */}
                    <div className="bg-white rounded-[2rem] border border-stone-200 shadow-sm p-10 overflow-hidden">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-sm font-black uppercase tracking-[0.25em] text-stone-400">تحليل القوائم المالية</h3>
                            <span className="text-[10px] font-bold text-stone-300 uppercase tracking-widest" dir="ltr">{months[month-1]} {year}</span>
                        </div>

                        <div className="space-y-1">
                            <Row label="إجمالي إيرادات التأجير" value={data.revenue || 0} />
                            
                            <div className="py-2" />
                            
                            <div className="space-y-0.5">
                                <Row label="التكاليف التشغيلية المتغيرة" value={-(data.maintenanceCosts || 0)} />
                                <Row label="صيانة وإصلاح الفساتين (Maintenance Log)" value={-(data.maintenanceCosts || 0)} sub />
                            </div>

                            <div className="py-2" />
                            
                            <Row label="إجمالي الربح التشغيلي" value={data.grossProfit || 0} bold />

                            <div className="py-2" />

                            <div className="space-y-0.5">
                                <Row label="التكاليف التشغيلية الثابتة (Monthly Overhead)" value={-(data.fixedCosts || 0)} />
                                <Row label="الإيجار والرواتب والمرافق" value={-(data.fixedCosts || 0)} sub />
                            </div>

                            <div className="mt-8 pt-8 border-t-2 border-stone-900">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-black text-stone-900 text-base uppercase tracking-[0.2em]">صافي الربح النهائي</span>
                                    <span className={`font-mono font-bold text-3xl ${(data.netProfit || 0) >= 0 ? 'text-stone-900' : 'text-rose-600'}`} dir="ltr">
                                        {formatCurrency(data.netProfit)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${(data.netProfit || 0) >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">الحالة المالية للمنشأة: {(data.netProfit || 0) >= 0 ? 'مربحة' : 'خاسرة'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
