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
            setError(err.message || 'Failed to login');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-100 flex flex-col">
                <div className="p-10 text-center space-y-2 bg-stone-900 text-white">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gold p-3 rounded-xl mb-4">
                        <Sparkles className="w-full h-full text-white" />
                    </div>
                    <h1 className="text-3xl font-serif tracking-tight">VogueRent</h1>
                    <p className="text-stone-400 text-sm font-medium uppercase tracking-widest">Portal Access</p>
                </div>
                
                <div className="p-10 space-y-6">
                    {error && (
                        <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 text-sm rounded-xl font-medium">
                            {error}
                        </div>
                    )}
                    
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-stone-400 uppercase tracking-tighter">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300 group-focus-within:text-stone-900 transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-stone-900 focus:bg-white transition-all text-sm"
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-stone-400 uppercase tracking-tighter">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300 group-focus-within:text-stone-900 transition-colors" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-stone-900 focus:bg-white transition-all text-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-stone-900 text-white rounded-xl font-bold text-sm tracking-widest uppercase hover:bg-stone-800 transition-all shadow-xl shadow-stone-200 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Enter System'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
