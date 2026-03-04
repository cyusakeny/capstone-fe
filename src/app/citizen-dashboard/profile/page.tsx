"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import CitizenSidebar from "@/components/CitizenSidebar";
import { getUserById } from "@/lib/api";
import { User } from "@/types/user";

export default function CitizenProfilePage() {
    const pathname = usePathname();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setIsLoading(true);
                // Get user from localStorage
                const storedUser = localStorage.getItem('user');
                if (!storedUser) {
                    throw new Error("User session not found. Please log in again.");
                }

                const parsedUser = JSON.parse(storedUser);
                const userId = parsedUser.id;

                if (!userId) {
                    throw new Error("Invalid user session.");
                }

                const userData = await getUserById(userId);
                setUser(userData);
            } catch (err: any) {
                console.error("Failed to fetch user data:", err);
                setError(err.message || "Failed to load profile information");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (isLoading) {
        return (
            <div className="flex min-h-screen bg-white">
                <CitizenSidebar />
                <main className="flex-1 ml-64 bg-slate-50/50 min-h-screen flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="size-12 border-4 border-accent-blue/30 border-t-accent-blue rounded-full animate-spin"></div>
                        <p className="text-slate-500 font-medium">Synchronizing Secure Identity...</p>
                    </div>
                </main>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="flex min-h-screen bg-white">
                <CitizenSidebar />
                <main className="flex-1 ml-64 bg-slate-50/50 min-h-screen flex items-center justify-center p-8">
                    <div className="bg-white p-8 rounded-3xl border border-red-100 shadow-xl max-w-md w-full text-center">
                        <span className="material-symbols-outlined text-red-500 text-5xl mb-4">error</span>
                        <h2 className="text-xl font-bold text-primary-navy mb-2">Access Error</h2>
                        <p className="text-slate-500 mb-6">{error || "Failed to retrieve your secure profile."}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full py-3 bg-primary-navy text-white rounded-xl font-bold hover:bg-primary-navy/90 transition-all"
                        >
                            Retry Connection
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-white">
            <CitizenSidebar />

            <main className="flex-1 ml-64 bg-slate-50/50 min-h-screen">
                <header className="bg-white border-b border-border-gray h-16 sticky top-0 z-40 flex items-center justify-between px-8">
                    <div className="flex items-center gap-2">
                        <span className="text-slate-500 text-sm font-medium capitalize">My Profile</span>
                        <span className="material-symbols-outlined text-slate-400 text-sm">chevron_right</span>
                        <span className="text-primary-navy font-bold text-sm">Account Settings</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative flex items-center justify-center">
                            <span className="material-symbols-outlined text-slate-400">notifications</span>
                            <span className="absolute -top-0.5 -right-0.5 size-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                    </div>
                </header>

                <div className="p-8 max-w-4xl mx-auto">
                    <div className="mb-8 flex justify-between items-end">
                        <div>
                            <h2 className="text-2xl font-bold text-primary-navy tracking-tight">Your Profile</h2>
                            <p className="text-slate-500">Manage your secure identity and account settings.</p>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block mb-1">Status: Verified</span>
                            <div className="flex gap-1 justify-end">
                                <span className="size-1 bg-emerald-500 rounded-full"></span>
                                <span className="size-1 bg-emerald-500 rounded-full"></span>
                                <span className="size-1 bg-emerald-500 rounded-full"></span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Profile Card */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-white p-6 rounded-2xl border border-border-gray shadow-sm flex flex-col items-center text-center">
                                <div className="size-32 rounded-full border-4 border-accent-blue shadow-lg overflow-hidden mb-4 bg-slate-100">
                                    <img
                                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=020617&color=fff&bold=true&size=128`}
                                        alt={user.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <h3 className="text-xl font-bold text-primary-navy">{user.name}</h3>
                                <p className="text-sm text-accent-blue font-bold tracking-widest uppercase mt-1">Verified Citizen</p>
                                <div className="mt-4 flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full">
                                    <span className="material-symbols-outlined text-sm">verified</span>
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Active</span>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-border-gray shadow-sm">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Account Stats</h4>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500">Member Since</span>
                                        <span className="font-semibold text-primary-navy">{new Date(user.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500">Security Level</span>
                                        <span className="font-semibold text-emerald-600">P-4 Tier</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500">Verification</span>
                                        <span className="font-semibold text-primary-navy">Biometric</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Details Area */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-2xl border border-border-gray shadow-sm overflow-hidden text-slate-800">
                                <div className="p-6 border-b border-border-gray bg-slate-50/50 flex justify-between items-center">
                                    <h4 className="font-bold text-primary-navy">Personal Information</h4>
                                    <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">ID: {user.id.slice(0, 8)}</span>
                                </div>
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Full Name</label>
                                        <p className="text-sm font-semibold text-slate-700">{user.name}</p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">National ID (NID)</label>
                                        <p className="text-sm font-semibold text-slate-700">{user.nid || "Not Provided"}</p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Email Address</label>
                                        <p className="text-sm font-semibold text-slate-700">{user.email}</p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Date of Birth</label>
                                        <p className="text-sm font-semibold text-slate-700">{formatDate(user.dateOfBirth)}</p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Blockchain Hash (Identity)</label>
                                        <div className="text-[10px] font-mono text-slate-400 bg-slate-50 p-2 rounded border border-slate-100 break-all">
                                            {/* We don't have a specific identity hash in the example, using a placeholder for display */}
                                            {btoa(user.id + user.email).slice(0, 64)}...
                                        </div>
                                    </div>
                                </div>
                                <div className="px-6 py-4 bg-slate-50 border-t border-border-gray flex justify-between items-center">
                                    <p className="text-[10px] text-slate-400 italic font-medium">Last updated: {new Date(user.updated_at).toLocaleDateString()}</p>
                                    <button className="px-4 py-2 bg-primary-navy text-white rounded-lg text-xs font-bold hover:bg-primary-navy/90 transition-colors">Request Info Update</button>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-border-gray shadow-sm overflow-hidden text-slate-800">
                                <div className="p-6 border-b border-border-gray bg-slate-50/50">
                                    <h4 className="font-bold text-primary-navy">Security & Privacy</h4>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="flex items-center justify-between p-4 rounded-xl border border-emerald-100 bg-emerald-50/30">
                                        <div className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-emerald-600">fingerprint</span>
                                            <div>
                                                <p className="text-sm font-bold text-slate-700">Multi-Factor Authentication</p>
                                                <p className="text-xs text-slate-500 leading-relaxed">Secure entry with facial recognition and encrypted private keys.</p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-100 px-2.5 py-1 rounded-full">Active</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 rounded-xl border border-blue-100 bg-blue-50/30">
                                        <div className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-blue-600">database</span>
                                            <div>
                                                <p className="text-sm font-bold text-slate-700">On-Chain Audit Trails</p>
                                                <p className="text-xs text-slate-500 leading-relaxed">Every account access is logged and secured on the private ledger.</p>
                                            </div>
                                        </div>
                                        <button className="text-xs font-bold text-blue-600 hover:underline">View Logs</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <footer className="p-8 pt-0 max-w-4xl mx-auto mt-8">
                    <div className="bg-primary-navy/5 border border-primary-navy/10 rounded-xl p-4 flex items-center gap-4">
                        <div className="size-10 rounded-lg bg-primary-navy flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-white">shield</span>
                        </div>
                        <div className="flex-1 text-slate-800">
                            <h4 className="text-sm font-bold text-primary-navy">Privacy First Architecture</h4>
                            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                                Your personal data is encrypted off-chain. Only zero-knowledge proofs and hashes for verification purpose are stored on the public blockchain ledger.
                            </p>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
}
