"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function OfficerLogin() {
    const router = useRouter();
    const [credentials, setCredentials] = useState({
        badgeNumber: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCredentials((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await apiFetch('/auth/login/officer', {
                method: 'POST',
                body: JSON.stringify(credentials),
            });

            // Store token and user info
            localStorage.setItem('access_token', response.access_token);
            localStorage.setItem('user', JSON.stringify(response.user));

            console.log("Officer Login Success:", response);
            router.push('/officer/case-management');
        } catch (err: unknown) {
            console.error("Officer Login Error:", err);
            const errorMessage = err instanceof Error ? err.message : "Authentication failed. Please verify your badge number and security key.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-primary-navy flex items-center justify-center p-6 relative overflow-hidden">
            {/* Dark/Technical background elements */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none"></div>
            <div className="absolute top-[-20%] left-[-10%] size-96 bg-accent-blue/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-md w-full relative z-10">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center size-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl mb-6 group">
                        <span className="material-symbols-outlined text-white text-4xl group-hover:scale-110 transition-transform">verified_user</span>
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight uppercase">Officer Terminal</h1>
                    <p className="text-slate-400 mt-2 font-medium">Standard Law Enforcement Access Protocol</p>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-2xl p-8 rounded-3xl border border-white/10 shadow-2xl">
                    <div className="mb-6 flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                        <span className="material-symbols-outlined text-amber-500 text-lg">warning</span>
                        <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest leading-tight">
                            Authorized personnel only. All access attempts are logged and audited.
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Badge ID Number</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl">badge</span>
                                <input
                                    name="badgeNumber"
                                    type="text"
                                    placeholder="Enter Badge Number"
                                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:ring-2 focus:ring-accent-blue focus:bg-white/10 outline-none transition-all"
                                    value={credentials.badgeNumber}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Security Key</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl">key</span>
                                <input
                                    name="password"
                                    type="password"
                                    placeholder="••••••••••••"
                                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:ring-2 focus:ring-accent-blue focus:bg-white/10 outline-none transition-all"
                                    value={credentials.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-xs text-red-500 font-medium">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full block text-center bg-accent-blue text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-accent-blue/90 transition-all shadow-xl shadow-accent-blue/20 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? 'Authenticating...' : 'Authorize Entry'}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                        <Link href="/" className="text-[10px] font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-sm">arrow_back</span>
                            Back Home
                        </Link>
                        <span className="flex gap-1.5">
                            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">System Ready</span>
                        </span>
                    </div>
                </div>

                <div className="mt-12 text-center space-y-2">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">Military Grade Encryption</p>
                    <div className="flex justify-center gap-2">
                        <div className="h-1.5 w-8 bg-white/5 rounded-full"></div>
                        <div className="h-1.5 w-12 bg-accent-blue/40 rounded-full"></div>
                        <div className="h-1.5 w-8 bg-white/5 rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
