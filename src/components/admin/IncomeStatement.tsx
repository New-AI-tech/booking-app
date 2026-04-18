import React, { useState, useEffect } from 'react';
import { FileText, Download } from 'lucide-react';
 main
import { fetchIncomeData } from '../../services/incomeService';

import { fetchIncomeData } from '../../firebase-services/incomeService';
 main

interface IncomeData {
  revenue: { rental: number; delay: number; total: number; };
  variableCosts: { cleaning: number; repairs: number; total: number; };
  grossProfit: number;
  fixedCosts: { rent: number; utilities: number; software_subs: number; insurance: number; salaries: number; marketing: number; total: number; };
  netProfit: number;
}

export default function IncomeStatement() {
    const [data, setData] = useState<IncomeData | null>(null);
    const [loading, setLoading] = useState(true);

    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());

    useEffect(() => {
        const loadIncomeData = async () => {
            setLoading(true);
            try {
                const incomeData = await fetchIncomeData(month, year);
                setData(incomeData);
            } catch (err) {
                console.error(err);
                setData(null);
            } finally {
                setLoading(false);
            }
        };
        loadIncomeData();
    }, [month, year]);

    if (loading || !data) return <div className="text-white">جاري الحساب...</div>;

    return (
        <div className="space-y-8 text-white font-serif" dir="rtl">
            <header className="flex justify-between items-end border-b border-stone-800 pb-4">
                <div>
                    <h2 className="text-3xl text-gold mb-2 flex items-center gap-3">
                        <FileText className="w-8 h-8" />
                        قائمة الدخل الشهرية | متجر فريال الحصري لتأجير الفساتين
                    </h2>
                    <div className="flex gap-4 items-center">
                        <span className="text-stone-400">الفترة:</span>
                        <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="bg-black border border-stone-800 text-white p-1">
                            {Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
                        </select>
                        <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="bg-black border border-stone-800 text-white p-1">
                            {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                </div>
                <button onClick={() => window.print()} className="flex items-center gap-2 bg-stone-900 border border-stone-800 px-4 py-2 hover:text-gold transition-colors">
                    <Download className="w-4 h-4" /> تصدير
                </button>
            </header>

            <div className="bg-stone-900/30 border border-stone-800 p-8 space-y-6">
                {/* A. Operating Revenue */}
                <div>
                    <h3 className="text-xl font-bold text-stone-300 border-b border-stone-800 pb-2 mb-4">أ. الإيرادات التشغيلية</h3>
                    <div className="flex justify-between py-2"><span className="text-stone-400">إجمالي إيرادات التأجير</span><span>EGP {data.revenue.rental}</span></div>
                    <div className="flex justify-between py-2"><span className="text-stone-400">رسوم التأخير</span><span>EGP {data.revenue.delay}</span></div>
                    <div className="flex justify-between py-2 font-bold text-gold border-t border-stone-800 mt-2"><span className="text-gold">إجمالي الإيرادات</span><span>EGP {data.revenue.total}</span></div>
                </div>

                {/* B. Variable Costs */}
                <div>
                    <h3 className="text-xl font-bold text-stone-300 border-b border-stone-800 pb-2 mb-4">ب. التكاليف المتغيرة</h3>
                    <div className="flex justify-between py-2"><span className="text-stone-400">تكاليف التنظيف الجاف</span><span>EGP {data.variableCosts.cleaning}</span></div>
                    <div className="flex justify-between py-2"><span className="text-stone-400">تكاليف الإصلاح والصيانة</span><span>EGP {data.variableCosts.repairs}</span></div>
                    <div className="flex justify-between py-2 font-bold text-red-400 border-t border-stone-800 mt-2"><span className="text-red-400">إجمالي التكاليف المتغيرة</span><span>EGP {data.variableCosts.total}</span></div>
                </div>

                {/* C. Gross Profit */}
                <div className="flex justify-between py-4 text-xl font-bold bg-stone-800/30 px-4">
                    <span>ج. مجمل الربح (هامش المساهمة)</span><span>EGP {data.grossProfit}</span>
                </div>

                {/* D. Fixed Expenses */}
                <div>
                    <h3 className="text-xl font-bold text-stone-300 border-b border-stone-800 pb-2 mb-4">د. المصاريف الثابتة</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex justify-between py-2"><span className="text-stone-400">إيجار المحل</span><span>EGP {data.fixedCosts.rent}</span></div>
                        <div className="flex justify-between py-2"><span className="text-stone-400">المرافق والإنترنت</span><span>EGP {data.fixedCosts.utilities}</span></div>
                        <div className="flex justify-between py-2"><span className="text-stone-400">الاشتراكات البرمجية</span><span>EGP {data.fixedCosts.software_subs}</span></div>
                        <div className="flex justify-between py-2"><span className="text-stone-400">التأمين</span><span>EGP {data.fixedCosts.insurance}</span></div>
                        <div className="flex justify-between py-2"><span className="text-stone-400">الرواتب</span><span>EGP {data.fixedCosts.salaries}</span></div>
                        <div className="flex justify-between py-2"><span className="text-stone-400">التسويق</span><span>EGP {data.fixedCosts.marketing}</span></div>
                    </div>
                    <div className="flex justify-between py-2 font-bold text-red-400 border-t border-stone-800 mt-2"><span className="text-red-400">إجمالي المصاريف الثابتة</span><span>EGP {data.fixedCosts.total}</span></div>
                </div>

                {/* E. Net Profit */}
                <div className="flex justify-between py-6 text-2xl font-bold bg-gold/10 border border-gold/30 px-4 text-gold">
                    <span>هـ. صافي الربح التشغيلي</span><span>EGP {data.netProfit}</span>
                </div>
            </div>
        </div>
    );
}
