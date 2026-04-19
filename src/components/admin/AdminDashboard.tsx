// src/components/admin/AdminDashboard.tsx
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, ListChecks, Settings, Calculator } from 'lucide-react';
import { cn } from '../../lib/utils.ts';

const AdminDashboard = () => {
    const location = useLocation();

    const menuItems = [
        { name: 'Registry', path: '/admin', icon: ListChecks },
        { name: 'Onboarding', path: '/admin/onboarding', icon: PlusCircle },
        { name: 'Income Statement', path: '/admin/income', icon: Calculator },
        { name: 'Settings', path: '/admin/settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-stone-950 flex" dir="rtl">
            {/* Sidebar - Localized to Arabic for Admin context */}
            <aside className="w-64 border-l border-stone-800 bg-black p-6 flex flex-col gap-8">
                <div className="flex items-center gap-3 px-2">
                    <LayoutDashboard className="text-gold w-6 h-6" />
                    <h1 className="text-lg font-serif tracking-widest text-white">بوابة الإدارة</h1>
                </div>

                <nav className="flex flex-col gap-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-medium transition-all",
                                location.pathname === item.path
                                    ? "bg-gold/10 text-gold border-r-2 border-gold"
                                    : "text-stone-500 hover:text-stone-300 hover:bg-stone-900"
                            )}
                        >
                            <item.icon className="w-4 h-4" />
                            {item.name === 'Registry' ? 'سجل الأصول' :
                                item.name === 'Onboarding' ? 'إضافة فستان' :
                                    item.name === 'Income Statement' ? 'قائمة الدخل' : 'الإعدادات'}
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-10 overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
