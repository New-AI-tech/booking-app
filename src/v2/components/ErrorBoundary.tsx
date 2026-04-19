import React from 'react';

interface State { hasError: boolean; error?: Error; }

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
    state: State = { hasError: false };

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        console.error('ErrorBoundary caught:', error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-stone-50 p-10">
                    <div className="max-w-md text-center space-y-6 bg-white p-12 rounded-3xl shadow-xl border border-stone-100">
                        <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto">
                            <span className="text-2xl">⚠️</span>
                        </div>
                        <h2 className="text-2xl font-serif text-stone-900">Something went wrong</h2>
                        <p className="text-stone-400 text-sm font-mono break-words">
                            {this.state.error?.message || 'An unexpected error occurred.'}
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-8 py-4 bg-stone-900 text-white rounded-2xl text-[10px] uppercase tracking-widest font-bold hover:bg-stone-800 transition-all"
                        >
                            Reload Application
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}
