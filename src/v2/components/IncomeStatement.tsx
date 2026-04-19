import React, { useEffect, useState } from 'react';
import { incomeService } from '../../services/incomeService';
import { IncomeData } from '../../types';
import { TrendingUp, TrendingDown, DollarSign, Loader2, ChevronDown } from 'lucide-react';

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
        incomeService.fetchIncomeData(month, year)
            .then(setData)
            .catch(() => setError('Failed to load financial data.'))
            .finally(() => setLoading(false));
    }, [month, year]);

    const months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    const Row = ({ label, value, sub }: { label: string; value: number; sub?: boolean }) => (
        <div className={`flex justify-between items-center py-4 ${sub ? 'pl-6 text-stone-500' : 'border-t border-stone-100'}`}>
            <span className={`text-sm ${sub ? '' : 'font-semibold text-stone-800'}`}>{label}</span>
            <span className={`font-mono text-sm font-bold ${value < 0 ? 'text-rose-600' : 'text-stone-900'}`}>
                ${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
        </div>
    );

    return (
        <div className="space-y-8 max-w-2xl mx-auto">
            <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-stone-100">
                <div>
                    <h2 className="text-3xl font-serif font-medium text-stone-900">Income Statement</h2>
                    <p className="text-stone-400 text-sm mt-1">Real-time financial summary from Firestore.</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <select value={month} onChange={(e) => setMonth(Number(e.target.value))}
                            className="pl-4 pr-8 py-2.5 bg-white border border-stone-200 rounded-xl text-sm font-medium appearance-none outline-none focus:border-stone-900 cursor-pointer">
                            {months.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
                    </div>
                    <div className="relative">
                        <select value={year} onChange={(e) => setYear(Number(e.target.value))}
                            className="pl-4 pr-8 py-2.5 bg-white border border-stone-200 rounded-xl text-sm font-medium appearance-none outline-none focus:border-stone-900 cursor-pointer">
                            {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
                    </div>
                </div>
            </header>

            {loading ? (
                <div className="py-24 flex flex-col items-center gap-4 text-stone-300">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <p className="font-serif italic text-sm">Calculating financials...</p>
                </div>
            ) : error ? (
                <div className="p-6 bg-rose-50 text-rose-600 rounded-2xl text-sm">{error}</div>
            ) : data ? (
                <div className="space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white border border-stone-100 rounded-2xl p-6 space-y-2 shadow-sm">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Revenue</p>
                            <p className="text-2xl font-serif font-bold text-stone-900">${data.revenue.toLocaleString()}</p>
                            <p className="text-[10px] text-stone-400">{data.bookingCount} bookings</p>
                        </div>
                        <div className={`border rounded-2xl p-6 space-y-2 shadow-sm ${data.grossProfit >= 0 ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 flex items-center gap-1">
                                {data.grossProfit >= 0 ? <TrendingUp className="w-3 h-3 text-emerald-500" /> : <TrendingDown className="w-3 h-3 text-rose-500" />}
                                Gross Profit
                            </p>
                            <p className={`text-2xl font-serif font-bold ${data.grossProfit >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                                ${data.grossProfit.toLocaleString()}
                            </p>
                        </div>
                        <div className={`border rounded-2xl p-6 space-y-2 shadow-sm ${data.netProfit >= 0 ? 'bg-white border-stone-100' : 'bg-rose-50 border-rose-100'}`}>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 flex items-center gap-1">
                                <DollarSign className="w-3 h-3" /> Net Profit
                            </p>
                            <p className={`text-2xl font-serif font-bold ${data.netProfit >= 0 ? 'text-stone-900' : 'text-rose-600'}`}>
                                ${data.netProfit.toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {/* Detailed Breakdown */}
                    <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-8">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Breakdown</h3>
                        <Row label="Total Revenue (Rentals)" value={data.revenue} />
                        <Row label="Variable Costs" value={-data.maintenanceCosts} />
                        <Row label="Maintenance & Repairs" value={-data.maintenanceCosts} sub />
                        <Row label="Gross Profit" value={data.grossProfit} />
                        <Row label="Fixed Operating Costs" value={-data.fixedCosts} />
                        <div className="mt-4 pt-4 border-t-2 border-stone-900 flex justify-between items-center">
                            <span className="font-bold text-stone-900 text-sm uppercase tracking-wider">Net Profit</span>
                            <span className={`font-mono font-bold text-xl ${data.netProfit >= 0 ? 'text-stone-900' : 'text-rose-600'}`}>
                                ${data.netProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
