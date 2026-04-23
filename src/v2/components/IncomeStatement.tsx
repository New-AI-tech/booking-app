import React, { useEffect, useState } from 'react';
import { fetchIncomeData } from '../services/incomeService';
import { IncomeData } from '../types';
import { 
    TrendingUp, 
    TrendingDown, 
    DollarSign, 
    Loader2, 
    ChevronDown, 
    FileText, 
    Activity, 
    Wallet,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
} from 'lucide-react';

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
        }).format(value || 0);
    };

    const Row = ({ label, value, sub, bold, isNegative }: { label: string; value: number; sub?: boolean; bold?: boolean; isNegative?: boolean }) => (
        <div className={`flex justify-between items-center py-4 ${sub ? 'pr-8 text-stone-500' : 'border-t border-stone-100'} ${bold ? 'bg-stone-50/50 -mx-8 px-8 rounded-xl' : ''}`}>
            <div className="flex items-center gap-3">
                {sub && <div className="w-1.5 h-1.5 rounded-full bg-stone-200" />}
                <span className={`text-sm ${sub ? 'text-xs' : bold ? 'font-bold text-stone-900' : 'font-semibold text-stone-800'}`}>
                    {label}
                </span>
            </div>
            <span className={`font-mono text-sm font-bold ${isNegative || value < 0 ? 'text-rose-600' : 'text-stone-900'}`} dir="ltr">
                {formatCurrency(value)}
            </span>
        </div>
    );

    return (
        <div className="space-y-8 max-w-4xl mx-auto pb-24" dir="rtl">
            {/* Header Section */}
            <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-8 bg-white border border-stone-200 rounded-[2.5rem] shadow-sm">
                <div className="flex items-center gap-5">
                    <div className="p-4 bg-stone-900 rounded-2xl shadow-lg shadow-stone-200">
                        <FileText className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-serif font-bold text-stone-900 tracking-tight">كشف الدخل الموحد</h2>
                        <div className="flex items-center gap-2 mt-1 text-stone-500 text-sm font-medium">
                            <Activity className="w-4 h-4 text-emerald-500" />
                            <span>تحديث تلقائي من قاعدة البيانات</span>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-3 bg-stone-50 p-2 rounded-2xl border border-stone-100">
                    <div className="relative">
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                        <select value={month} onChange={(e) => setMonth(Number(e.target.value))}
                            className="pr-10 pl-8 py-2.5 bg-transparent text-sm font-bold text-stone-700 appearance-none outline-none cursor-pointer min-w-[140px]">
                            {months.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                        </select>
                        <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                    </div>
                    <div className="w-px h-8 bg-stone-200" />
                    <div className="relative">
                        <select value={year} onChange={(e) => setYear(Number(e.target.value))}
                            className="pr-4 pl-9 py-2.5 bg-transparent text-sm font-bold text-stone-700 appearance-none outline-none cursor-pointer min-w-[110px]">
                            {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                        <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                    </div>
                </div>
            </header>

            {loading ? (
                <div className="py-40 flex flex-col items-center gap-8">
                    <div className="relative">
                        <div className="w-20 h-20 border-4 border-stone-100 border-t-stone-900 rounded-full animate-spin" />
                        <FileText className="w-8 h-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-stone-900" />
                    </div>
                    <div className="text-center space-y-2">
                        <p className="font-serif italic text-xl text-stone-900">جاري إعداد التقرير المالي...</p>
                        <p className="text-sm text-stone-400 font-medium">يرجى الانتظار بينما نقوم بحساب الأرقام</p>
                    </div>
                </div>
            ) : error ? (
                <div className="p-10 bg-rose-50 border-2 border-rose-100 text-rose-700 rounded-[2.5rem] text-center space-y-4 shadow-sm">
                    <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto">
                        <Activity className="w-8 h-8 text-rose-600" />
                    </div>
                    <p className="text-lg font-bold">{error}</p>
                    <button onClick={() => window.location.reload()} className="px-6 py-2 bg-rose-600 text-white rounded-xl text-sm font-bold hover:bg-rose-700 transition-colors">إعادة المحاولة</button>
                </div>
            ) : data ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
                    {/* Metrics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Revenue Card */}
                        <div className="bg-white border border-stone-200 rounded-[2rem] p-8 space-y-6 shadow-sm hover:shadow-xl transition-all duration-500 relative group overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-stone-50 rounded-full group-hover:scale-110 transition-transform duration-700" />
                            <div className="relative flex justify-between items-start">
                                <div className="p-3 bg-stone-50 rounded-2xl group-hover:bg-stone-900 group-hover:text-white transition-colors duration-500">
                                    <Wallet className="w-6 h-6" />
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-wider">
                                    <ArrowUpRight className="w-3 h-3" />
                                    <span>نشط</span>
                                </div>
                            </div>
                            <div className="relative">
                                <p className="text-[11px] font-black uppercase tracking-[0.25em] text-stone-400 mb-2">إجمالي الإيرادات</p>
                                <p className="text-4xl font-serif font-bold text-stone-900" dir="ltr">
                                    {formatCurrency(data.revenue)}
                                </p>
                            </div>
                            <div className="pt-4 border-t border-stone-50 flex items-center justify-between text-[11px] font-bold text-stone-500 uppercase tracking-widest">
                                <span>عدد الحجوزات</span>
                                <span className="text-stone-900 px-2 py-0.5 bg-stone-100 rounded-md">{data.bookingCount || 0}</span>
                            </div>
                        </div>

                        {/* Gross Profit Card */}
                        <div className={`border rounded-[2rem] p-8 space-y-6 shadow-sm relative overflow-hidden transition-all duration-500 ${(data.grossProfit || 0) >= 0 ? 'bg-emerald-50/30 border-emerald-100' : 'bg-rose-50/30 border-rose-100'}`}>
                            <div className="relative flex justify-between items-start">
                                <div className={`p-3 rounded-2xl ${(data.grossProfit || 0) >= 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                            </div>
                            <div className="relative">
                                <p className="text-[11px] font-black uppercase tracking-[0.25em] text-stone-400 mb-2">إجمالي الربح</p>
                                <p className={`text-4xl font-serif font-bold ${(data.grossProfit || 0) >= 0 ? 'text-emerald-700' : 'text-rose-600'}`} dir="ltr">
                                    {formatCurrency(data.grossProfit)}
                                </p>
                            </div>
                            <p className="text-[11px] text-stone-500 font-bold leading-relaxed">الربح الصافي من العمليات قبل خصم المصاريف الثابتة</p>
                        </div>

                        {/* Net Profit Card */}
                        <div className={`border rounded-[2rem] p-8 space-y-6 shadow-xl relative overflow-hidden transition-all duration-500 ${(data.netProfit || 0) >= 0 ? 'bg-stone-900 border-stone-800' : 'bg-rose-600 border-rose-500'}`}>
                            <div className="relative flex justify-between items-start">
                                <div className="p-3 bg-white/10 rounded-2xl text-white">
                                    <DollarSign className="w-6 h-6" />
                                </div>
                            </div>
                            <div className="relative">
                                <p className="text-[11px] font-black uppercase tracking-[0.25em] text-white/50 mb-2">صافي الأرباح النهائية</p>
                                <p className="text-4xl font-serif font-bold text-white" dir="ltr">
                                    {formatCurrency(data.netProfit)}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-black text-white/40 uppercase tracking-widest">
                                    <span>هامش الربح</span>
                                    <span>{Math.round((data.netProfit / (data.revenue || 1)) * 100)}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-white/60 transition-all duration-1000" 
                                        style={{ width: `${Math.min(Math.max((data.netProfit / (data.revenue || 1)) * 100, 0), 100)}%` }} 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Statement Breakdown */}
                    <div className="bg-white rounded-[3rem] border border-stone-200 shadow-sm p-12 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-l from-stone-900 via-stone-400 to-stone-900 opacity-10" />
                        
                        <div className="flex items-center justify-between mb-12">
                            <div className="space-y-1">
                                <h3 className="text-sm font-black uppercase tracking-[0.3em] text-stone-900">تحليل القوائم المالية</h3>
                                <p className="text-xs text-stone-400 font-bold uppercase tracking-widest">التفصيل المحاسبي للإيرادات والمصروفات</p>
                            </div>
                            <div className="px-4 py-2 bg-stone-50 rounded-xl text-[10px] font-black text-stone-400 border border-stone-100 uppercase tracking-[0.2em]" dir="ltr">
                                {months[month-1]} {year}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Row label="إجمالي إيرادات التأجير" value={data.revenue || 0} />
                            
                            <div className="py-4" />
                            
                            <div className="space-y-1">
                                <Row label="التكاليف التشغيلية المتغيرة" value={-(data.maintenanceCosts || 0)} isNegative />
                                <Row label="صيانة وإصلاح الفساتين (Maintenance Log)" value={-(data.maintenanceCosts || 0)} sub isNegative />
                            </div>

                            <div className="py-4" />
                            
                            <Row label="إجمالي الربح التشغيلي" value={data.grossProfit || 0} bold />

                            <div className="py-4" />

                            <div className="space-y-1">
                                <Row label="المصاريف التشغيلية الثابتة" value={-(data.fixedCosts || 0)} isNegative />
                                <Row label="إهلاك، إيجار، رواتب، ومرافق" value={-(data.fixedCosts || 0)} sub isNegative />
                            </div>

                            <div className="mt-12 pt-10 border-t-4 border-double border-stone-900">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="space-y-1">
                                        <span className="font-black text-stone-900 text-xl uppercase tracking-[0.2em]">صافي الربح / الخسارة</span>
                                        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">القيمة النهائية بعد خصم كافة التكاليف</p>
                                    </div>
                                    <span className={`font-mono font-bold text-4xl ${(data.netProfit || 0) >= 0 ? 'text-stone-900' : 'text-rose-600'}`} dir="ltr">
                                        {formatCurrency(data.netProfit)}
                                    </span>
                                </div>
                                <div className={`inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl border ${(data.netProfit || 0) >= 0 ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'}`}>
                                    <div className={`w-3 h-3 rounded-full animate-pulse ${(data.netProfit || 0) >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                    <p className="text-xs font-black uppercase tracking-[0.15em]">
                                        حالة الأداء المالي: {(data.netProfit || 0) >= 0 ? 'أداء إيجابي (مربح)' : 'أداء سلبي (خسارة)'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
