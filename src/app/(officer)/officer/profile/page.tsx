"use client";

import React, { useState } from "react";
import OfficerHeaderV2 from "@/components/OfficerHeaderV2";

export default function OfficerProfilePage() {
    const [user, setUser] = useState<{ id: string; name: string; email: string; role: string; type?: string } | null>(null);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    React.useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse officer from localStorage", e);
            }
        }
    }, []);

    const handleUpdatePassword = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage({ type: "error", text: "New passwords do not match." });
            return;
        }
        // Simulated update
        setMessage({ type: "success", text: "Password updated successfully over encrypted channel." });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
    };

    if (!user) {
        return (
            <div className="flex-1 flex flex-col min-h-screen bg-slate-50/50 text-slate-900 items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="size-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-medium">Loading credentials...</p>
                </div>
            </div>
        );
    }

    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=2563eb&color=fff&bold=true&size=128`;

    return (
        <div className="flex-1 flex flex-col min-h-screen bg-slate-50/50 text-slate-900">
            <OfficerHeaderV2 />

            <main className="p-8 max-w-5xl mx-auto w-full space-y-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Officer Profile</h1>
                    <p className="text-slate-500 mt-1">Personnel credentials and account security management.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Information View */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4">
                                <span className="material-symbols-outlined text-emerald-500 fill-1">verified</span>
                            </div>

                            <div className="flex flex-col items-center mb-8">
                                <div className="size-24 rounded-full border-4 border-slate-100 shadow-inner mb-4 overflow-hidden">
                                    <img src={avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 text-center">{user.name}</h3>
                                <p className="text-xs font-bold text-primary-navy/60 uppercase tracking-widest mt-1">{user.role}</p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Personnel Email</label>
                                    <p className="text-sm font-bold text-slate-700 truncate">{user.email}</p>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Department</label>
                                    <p className="text-sm font-bold text-slate-700">Digital Intelligence / Cyber Unit</p>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Clearance Level</label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="px-2 py-0.5 bg-navy-900 text-white text-[10px] font-black rounded">
                                            {user.role === 'ADMIN' ? 'LEVEL 5' : 'LEVEL 4'}
                                        </span>
                                        <span className="text-[10px] text-slate-500">{user.role === 'ADMIN' ? 'Authorized Admin' : 'Field Officer'}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Duty Status</label>
                                    <div className="flex items-center gap-1.5 mt-1 text-emerald-600">
                                        <span className="size-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                        <span className="text-xs font-bold uppercase">Active Duty</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-primary-navy p-6 rounded-2xl text-white shadow-lg shadow-primary-navy/20">
                            <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">security</span>
                                Security Protocol
                            </h4>
                            <p className="text-[11px] text-slate-400 leading-relaxed">
                                Biometric keys are periodically refreshed. Profile updates require physical presence at the central command hub for identity verification.
                            </p>
                        </div>
                    </div>

                    {/* Security Management Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">lock_reset</span>
                                Update Security Password
                            </h3>

                            {message && (
                                <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 border ${message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-700'
                                    }`}>
                                    <span className="material-symbols-outlined">{message.type === 'success' ? 'check_circle' : 'error'}</span>
                                    <p className="text-sm font-medium">{message.text}</p>
                                </div>
                            )}

                            <form onSubmit={handleUpdatePassword} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Current Password</label>
                                        <input
                                            type="password"
                                            required
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                                            placeholder="••••••••••••"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">New Password</label>
                                        <input
                                            type="password"
                                            required
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                                            placeholder="••••••••••••"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Confirm New Password</label>
                                        <input
                                            type="password"
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                                            placeholder="••••••••••••"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        className="bg-primary text-white px-10 py-3.5 rounded-xl font-black uppercase text-xs tracking-widest shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all w-full md:w-auto"
                                    >
                                        Update Password
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                            <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-slate-400">devices</span>
                                Authenticated Sessions
                            </h4>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-slate-400">laptop</span>
                                        <div>
                                            <p className="text-xs font-bold text-slate-700">Command Terminal • Node {user.id.slice(0, 4).toUpperCase()}</p>
                                            <p className="text-[10px] text-slate-400">Primary Session • Encrypted Channel</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold text-emerald-600 uppercase">Active</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
