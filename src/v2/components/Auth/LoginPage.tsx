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
        <div className="min-h-screen flex items-center justify-center p-4 md:p-6" dir="rtl">
            <div className="max-w-md w-full bg-black/20 backdrop-blur-md rounded-2xl md:rounded-3xl shadow-2xl border border-white/10 overflow-hidden flex flex-col animate-in">
                <div className="p-8 md:p-12 text-center space-y-4 bg-white/5 border-b border-white/5">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-xl mb-2 backdrop-blur-lg">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">آتليه فريال الحصري</h1>
                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">بوابة الإدارة</p>
                </div>
                
                <div className="p-6 md:p-10 space-y-8 text-right">
                    {error && (
                        <div className="p-4 bg-rose-500/20 border border-rose-500/20 text-rose-200 text-sm rounded-xl font-medium backdrop-blur-sm">
                            {error}
                        </div>
                    )}
                    
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mr-1">البريد الإلكتروني</label>
                            <div className="relative">
                                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full h-12 pr-11 pl-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-white/40 focus:bg-white/10 transition-all text-sm text-right text-white placeholder:text-white/20"
                                    placeholder="name@company.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mr-1">كلمة المرور</label>
                            <div className="relative">
                                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full h-12 pr-11 pl-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-white/40 focus:bg-white/10 transition-all text-sm text-right text-white placeholder:text-white/20"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-white text-stone-900 rounded-xl font-bold text-sm tracking-widest uppercase hover:bg-stone-100 transition-all shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'دخول النظام'}
                        </button>
                    </form>
                    
                    <p className="text-center text-[10px] text-white/20 uppercase tracking-[0.3em] pt-4">
                        نظام إدارة الحجوزات الموحد
                    </p>
                </div>
            </div>
        </div>
    );
}
