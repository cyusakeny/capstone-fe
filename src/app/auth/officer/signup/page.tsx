"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function OfficerSignup() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        badge_number: "",
        department: "",
        rank: "",
        role: "",
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);
        try {
            // Map role to backend expected format (uppercase)
            const submissionData = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                badge_number: formData.badge_number,
                department: formData.department,
                rank: formData.rank,
                role: formData.role.toUpperCase().replace(/\s+/g, '_')
            };

            const response = await fetch('http://localhost:5000/officers', {
                method: 'POST',
                headers: {
                    'accept': '*/*',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submissionData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Registration failed. Please check your credentials and try again.');
            }

            const data = await response.json();
            console.log("Officer Registration Success:", data);
            setIsSubmitted(true);
        } catch (err: any) {
            console.error("Officer Registration Error:", err);
            setError(err.message || "An unexpected error occurred. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
                <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-border-gray shadow-xl">
                    <div className="size-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined text-3xl">verified_user</span>
                    </div>
                    <h2 className="text-2xl font-black text-primary-navy mb-2">Registration Submitted</h2>
                    <p className="text-slate-500 mb-6">Officer account credentials have been logged for verification.</p>
                    <Link href="/auth/officer/login" className="w-full block bg-primary-navy text-white py-4 rounded-2xl font-bold hover:bg-primary-navy/90 transition-all shadow-lg">
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
                    <div className="inline-flex items-center justify-center size-16 bg-primary-navy rounded-2xl shadow-lg shadow-navy-900/20 mb-4">
                        <span className="material-symbols-outlined text-white text-3xl">local_police</span>
                    </div>
                    <h1 className="text-3xl font-black text-primary-navy tracking-tight">Officer Portal</h1>
                    <p className="text-slate-500 mt-2">Register new legislative enforcement credentials.</p>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-border-gray shadow-xl shadow-slate-200/50">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">error</span>
                            {error}
                        </div>
                    )}
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">person</span>
                                <input
                                    name="name"
                                    type="text"
                                    placeholder="Officer Name"
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-navy focus:border-transparent outline-none transition-all"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Badge Number</label>
                                <input
                                    name="badge_number"
                                    type="text"
                                    placeholder="B-XXXXX"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-navy focus:border-transparent outline-none transition-all"
                                    value={formData.badge_number}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Rank</label>
                                <input
                                    name="rank"
                                    type="text"
                                    placeholder="e.g. Detective"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-navy focus:border-transparent outline-none transition-all"
                                    value={formData.rank}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Department</label>
                                <select
                                    name="department"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-navy focus:border-transparent outline-none transition-all appearance-none"
                                    value={formData.department}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Dept</option>
                                    <option value="Forensics">Forensics</option>
                                    <option value="Patrol">Patrol</option>
                                    <option value="Investigation">Investigation</option>
                                    <option value="Cybercrime">Cybercrime</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Role</label>
                                <select
                                    name="role"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-navy focus:border-transparent outline-none transition-all appearance-none"
                                    value={formData.role}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Role</option>
                                    <option value="Admin">Admin</option>
                                    <option value="Lead Investigator">Lead Investigator</option>
                                    <option value="Field Officer">Field Officer</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">mail</span>
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="officer@service.gov"
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-navy focus:border-transparent outline-none transition-all"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
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
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-navy focus:border-transparent outline-none transition-all"
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
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-navy focus:border-transparent outline-none transition-all"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full block text-center bg-primary-navy text-white py-4 rounded-2xl font-bold hover:bg-primary-navy/90 transition-all shadow-lg shadow-navy-900/10 cursor-pointer ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? 'Registering...' : 'Complete Registration'}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                        <p className="text-sm text-slate-500">
                            Authorized personnel only. <Link href="/auth/officer/login" className="text-primary-navy font-bold hover:underline">Log In</Link>
                        </p>
                    </div>
                </div>

                <p className="text-center text-[10px] text-slate-400 mt-8 uppercase tracking-[0.2em] font-bold">
                    Secure Judicial Network Node
                </p>
            </div>
        </div>
    );
}
