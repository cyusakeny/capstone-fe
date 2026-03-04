"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function CitizenLogin() {
    const router = useRouter();
    const [credentials, setCredentials] = useState({
        email: "",
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
            const response = await apiFetch('/auth/login', {
                method: 'POST',
                body: JSON.stringify(credentials),
            });

            // Store token and user info
            localStorage.setItem('access_token', response.access_token);
            localStorage.setItem('user', JSON.stringify(response.user));

            console.log("Login Success:", response);
            router.push('/citizen-dashboard');
        } catch (err: unknown) {
            console.error("Login Error:", err);
            const errorMessage = err instanceof Error ? err.message : "Failed to sign in. Please check your credentials.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center size-16 bg-accent-blue rounded-2xl shadow-lg shadow-accent-blue/20 mb-4">
                        <span className="material-symbols-outlined text-white text-3xl">login</span>
                    </div>
                    <h1 className="text-3xl font-black text-primary-navy tracking-tight">Welcome Back</h1>
                    <p className="text-slate-500 mt-2">Access your secure safety portal.</p>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-border-gray shadow-xl shadow-slate-200/50">
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">mail</span>
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-accent-blue focus:border-transparent outline-none transition-all"
                                    value={credentials.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">lock</span>
                                <input
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-accent-blue focus:border-transparent outline-none transition-all"
                                    value={credentials.password}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="text-right mt-1">
                                <Link href="#" className="text-xs font-bold text-accent-blue hover:underline">Forgot password?</Link>
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-xs text-red-600 font-medium">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-4 pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full block text-center bg-primary-navy text-white py-4 rounded-2xl font-bold hover:bg-primary-navy/90 transition-all shadow-lg shadow-navy-900/10 cursor-pointer ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? 'Signing In...' : 'Sign In'}
                            </button>

                            <div className="relative py-2">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                                <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-slate-400">
                                    <span className="bg-white px-2">or secure with</span>
                                </div>
                            </div>

                            <button className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 py-3.5 rounded-2xl font-bold hover:bg-slate-50 transition-all">
                                <span className="material-symbols-outlined text-accent-blue">fingerprint</span>
                                Biometric Login
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                        <p className="text-sm text-slate-500">
                            Don&apos;t have an account? <Link href="/auth/citizen/signup" className="text-accent-blue font-bold hover:underline">Create Account</Link>
                        </p>
                    </div>
                </div>

                <div className="mt-8 flex justify-center gap-6">
                    <Link href="/auth/officer/login" className="text-[11px] font-bold text-slate-400 hover:text-primary-navy transition-colors flex items-center gap-1.5 uppercase tracking-wider">
                        <span className="material-symbols-outlined text-lg">shield_lock</span>
                        Officer Terminal
                    </Link>
                </div>
            </div>
        </div>
    );
}
