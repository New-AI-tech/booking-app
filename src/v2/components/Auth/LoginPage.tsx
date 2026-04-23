import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase-bridge';
import { Sparkles, Mail, Lock, Loader2 } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err: any) {
            setError('فشل تسجيل الدخول. يرجى التحقق من البريد الإلكتروني وكلمة المرور.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6" dir="rtl">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden flex flex-col animate-in">
                <div className="p-12 text-center space-y-4 bg-stone-900 text-white">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-xl mb-2">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">آتليه فريال الحصري</h1>
                    <p className="text-stone-400 text-xs font-bold uppercase tracking-[0.2em]">بوابة الإدارة</p>
                </div>
                
                <div className="p-10 space-y-8 text-right">
                    {error && (
                        <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 text-sm rounded-xl font-medium">
                            {error}
                        </div>
                    )}
                    
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest">البريد الإلكتروني</label>
                            <div className="relative">
                                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full h-12 pr-11 pl-4 bg-white border border-stone-200 rounded-xl outline-none focus:border-stone-900 transition-all text-sm text-right"
                                    placeholder="name@company.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest">كلمة المرور</label>
                            <div className="relative">
                                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full h-12 pr-11 pl-4 bg-white border border-stone-200 rounded-xl outline-none focus:border-stone-900 transition-all text-sm text-right"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-stone-900 text-white rounded-xl font-bold text-sm tracking-widest uppercase hover:bg-stone-800 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'دخول النظام'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
