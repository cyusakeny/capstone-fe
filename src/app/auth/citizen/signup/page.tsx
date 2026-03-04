"use client";

import React, { useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

export default function CitizenSignup() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        nid: "",
        dateOfBirth: "",
        biometricConsent: false,
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }

        try {
            const registrationData = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                nid: formData.nid,
                dateOfBirth: new Date(formData.dateOfBirth).toISOString(),
            };

            const response = await apiFetch('/auth/register/user', {
                method: 'POST',
                body: JSON.stringify(registrationData),
            });

            console.log("Registration Success:", response);
            setIsSubmitted(true);
        } catch (err: unknown) {
            console.error("Registration Error:", err);
            const errorMessage = err instanceof Error ? err.message : "Failed to register. Please try again.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
                <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-border-gray shadow-xl">
                    <div className="size-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined text-3xl">check_circle</span>
                    </div>
                    <h2 className="text-2xl font-black text-primary-navy mb-2">Registration Successful</h2>
                    <p className="text-slate-500 mb-6">Your account has been created securely.</p>
                    <Link href="/auth/citizen/login" className="w-full block bg-primary-navy text-white py-4 rounded-2xl font-bold hover:bg-primary-navy/90 transition-all shadow-lg text-center">
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center size-16 bg-accent-blue rounded-2xl shadow-lg shadow-accent-blue/20 mb-4">
                        <span className="material-symbols-outlined text-white text-3xl">shield_person</span>
                    </div>
                    <h1 className="text-3xl font-black text-primary-navy tracking-tight">Create Account</h1>
                    <p className="text-slate-500 mt-2">Join the secure citizen safety network.</p>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-border-gray shadow-xl shadow-slate-200/50">
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full legal name</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">person</span>
                                <input
                                    name="name"
                                    type="text"
                                    placeholder="Enter your full name"
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-accent-blue focus:border-transparent outline-none transition-all"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">National ID (NID)</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">badge</span>
                                <input
                                    name="nid"
                                    type="text"
                                    placeholder="NID-XXXXXXXXX"
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-accent-blue focus:border-transparent outline-none transition-all"
                                    value={formData.nid}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Date of Birth</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">calendar_today</span>
                                <input
                                    name="dateOfBirth"
                                    type="date"
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-accent-blue focus:border-transparent outline-none transition-all"
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>


                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">mail</span>
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-accent-blue focus:border-transparent outline-none transition-all"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                                <input
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-accent-blue focus:border-transparent outline-none transition-all"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Confirm</label>
                                <input
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-accent-blue focus:border-transparent outline-none transition-all"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>


                        <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                            <input
                                name="biometricConsent"
                                type="checkbox"
                                className="mt-1 size-4 rounded text-accent-blue focus:ring-accent-blue"
                                checked={formData.biometricConsent}
                                onChange={handleChange}
                            />
                            <div className="text-xs">
                                <p className="font-bold text-emerald-800">Biometric Verification Consent</p>
                                <p className="text-emerald-700/70 mt-0.5">I agree to use biometric data for secure identity verification on the blockchain-secured ledger.</p>
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-xs text-red-600 font-medium">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full block text-center bg-primary-navy text-white py-4 rounded-2xl font-bold hover:bg-primary-navy/90 transition-all shadow-lg shadow-navy-900/10 cursor-pointer ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? 'Creating Account...' : 'Sign Up'}
                        </button>

                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                        <p className="text-sm text-slate-500">
                            Already have an account? <Link href="/auth/citizen/login" className="text-accent-blue font-bold hover:underline">Log In</Link>
                        </p>
                    </div>
                </div>

                <p className="text-center text-[10px] text-slate-400 mt-8 uppercase tracking-[0.2em] font-bold">
                    Protected by End-to-End Encryption
                </p>
            </div>
        </div>
    );
}
