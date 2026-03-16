"use client";

import React from "react";
import CitizenSidebar from "@/components/CitizenSidebar";
import { useTheme } from "@/providers/ThemeProvider";

export default function SettingsPage() {
    const { theme, fontSize, reducedMotion, setTheme, setFontSize, setReducedMotion } = useTheme();

    return (
        <div className="flex min-h-screen bg-slate-50/50">
            <CitizenSidebar />

            <main className="flex-1 ml-64 min-h-screen">
                <header className="bg-white border-b border-border-gray h-16 sticky top-0 z-40 flex items-center justify-between px-8">
                    <div className="flex items-center gap-2">
                        <span className="text-slate-500 text-sm font-medium capitalize">Settings</span>
                        <span className="material-symbols-outlined text-slate-400 text-sm">chevron_right</span>
                        <span className="text-primary-navy font-bold text-sm">Accessibility & UI</span>
                    </div>
                </header>

                <div className="p-8 max-w-4xl mx-auto space-y-8">
                    <div>
                        <h2 className="text-2xl font-bold text-primary-navy tracking-tight">Accessibility & Interface</h2>
                        <p className="text-slate-500 mt-1">Customize your viewing experience for better comfort and clarity.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Theme Selection */}
                        <section className="bg-white p-6 rounded-2xl border border-border-gray shadow-sm">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 px-1 flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg">palette</span>
                                Visual Theme
                            </h3>
                            <div className="space-y-3">
                                {[
                                    { id: "light", label: "Light Mode", description: "Standard high-clarity interface", icon: "light_mode" },
                                    { id: "dark", label: "Dark Mode", description: "Low light, reduced eye strain", icon: "dark_mode" },
                                    { id: "high-contrast", label: "High Contrast", description: "Maximum legibility and focus", icon: "contrast" }
                                ].map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => setTheme(t.id as any)}
                                        className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-4 ${theme === t.id
                                                ? "bg-primary-navy text-white border-primary-navy shadow-lg"
                                                : "bg-white text-slate-700 border-slate-100 hover:border-slate-300"
                                            }`}
                                    >
                                        <div className={`size-10 rounded-lg flex items-center justify-center ${theme === t.id ? "bg-white/10" : "bg-slate-50"}`}>
                                            <span className="material-symbols-outlined text-xl">{t.icon}</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold">{t.label}</p>
                                            <p className={`text-[11px] ${theme === t.id ? "text-white/60" : "text-slate-400"}`}>{t.description}</p>
                                        </div>
                                        {theme === t.id && (
                                            <span className="material-symbols-outlined text-emerald-400">check_circle</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Font Scaling */}
                        <section className="bg-white p-6 rounded-2xl border border-border-gray shadow-sm">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 px-1 flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg">format_size</span>
                                Font Scaling
                            </h3>
                            <p className="text-xs text-slate-500 mb-6 px-1 leading-relaxed">Adjust the overall text size of the application for better readability.</p>

                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { id: "100%", label: "Default", sub: "Standard size" },
                                    { id: "115%", label: "Medium", sub: "Enhanced focus" },
                                    { id: "130%", label: "Large", sub: "Maximum clarity" }
                                ].map((s) => (
                                    <button
                                        key={s.id}
                                        onClick={() => setFontSize(s.id as any)}
                                        className={`p-4 rounded-xl border transition-all flex flex-col items-center text-center gap-1 ${fontSize === s.id
                                                ? "bg-accent-blue text-white border-accent-blue shadow-md"
                                                : "bg-white text-slate-700 border-slate-100 hover:border-slate-300"
                                            }`}
                                    >
                                        <span className="text-lg font-black" style={{ fontSize: `calc(1rem * ${parseInt(s.id) / 100})` }}>A</span>
                                        <p className="text-xs font-bold mt-1">{s.label}</p>
                                        <p className={`text-[10px] ${fontSize === s.id ? "text-white/70" : "text-slate-400"}`}>{s.sub}</p>
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Motion Settings */}
                        <section className="bg-white p-6 rounded-2xl border border-border-gray shadow-sm md:col-span-2">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 px-1 flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg">motion_sensor_active</span>
                                Motion & Animations
                            </h3>

                            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                                <div className="flex items-center gap-4">
                                    <div className="size-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                                        <span className="material-symbols-outlined text-slate-400">running_with_errors</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-primary-navy">Reduce Motion</p>
                                        <p className="text-xs text-slate-500 leading-relaxed">Simplifies transitions and disables intensive animations.</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setReducedMotion(!reducedMotion)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${reducedMotion ? 'bg-accent-blue' : 'bg-slate-300'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${reducedMotion ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>
                        </section>
                    </div>

                    <div className="bg-primary-navy/5 border border-primary-navy/10 rounded-2xl p-6 flex items-start gap-4">
                        <div className="size-10 rounded-lg bg-primary-navy flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-white">info</span>
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-bold text-primary-navy">System Note</h4>
                            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                                Accessibility and UI preferences are stored securely on your device for immediate application across sessions. These settings do not affect the cryptographic verification of your reports on the blockchain.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
