"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Step = 1 | 2 | 3 | 4;

interface FormData {
    reporterName: string;
    reporterContact: string;
    category: string;
    date: string;
    time: string;
    location: string;
    description: string;
    evidence: File[];
}

const STEPS = [
    { id: 1, label: "Reporter Info", icon: "person" },
    { id: 2, label: "Incident Details", icon: "description" },
    { id: 3, label: "Evidence Upload", icon: "cloud_upload" },
    { id: 4, label: "Review & Submit", icon: "visibility" },
];

export default function SubmitReport() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState<Step>(1);
    const [formData, setFormData] = useState<FormData>({
        reporterName: "James Detective",
        reporterContact: "+1 (555) 0123",
        category: "Theft or Robbery",
        date: new Date().toISOString().split("T")[0],
        time: "14:30",
        location: "842 Downtown Ave, District 4",
        description: "",
        evidence: [],
    });

    const updateFormData = (data: Partial<FormData>) => {
        setFormData((prev) => ({ ...prev, ...data }));
    };

    const nextStep = () => setCurrentStep((prev) => (prev < 4 ? (prev + 1) as Step : prev));
    const prevStep = () => setCurrentStep((prev) => (prev > 1 ? (prev - 1) as Step : prev));

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Reporter Information</h2>
                        <p className="text-slate-500 mb-8">Confirm your contact details for investigation follow-ups.</p>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Full Name</label>
                                <input
                                    type="text"
                                    value={formData.reporterName}
                                    onChange={(e) => updateFormData({ reporterName: e.target.value })}
                                    className="w-full h-12 rounded-lg border-slate-200 focus:border-accent-blue focus:ring-accent-blue px-3 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Contact Number / Email</label>
                                <input
                                    type="text"
                                    value={formData.reporterContact}
                                    onChange={(e) => updateFormData({ reporterContact: e.target.value })}
                                    className="w-full h-12 rounded-lg border-slate-200 focus:border-accent-blue focus:ring-accent-blue px-3 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Incident Details & Location</h2>
                        <p className="text-slate-500 mb-8">Provide precise information about the event.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Crime Category</label>
                                <select
                                    className="w-full h-12 rounded-lg border-slate-200 focus:border-accent-blue focus:ring-accent-blue px-3 outline-none transition-all appearance-none bg-white"
                                    value={formData.category}
                                    onChange={(e) => updateFormData({ category: e.target.value })}
                                >
                                    <option>Theft or Robbery</option>
                                    <option>Vandalism / Property Damage</option>
                                    <option>Assault</option>
                                    <option>Fraud / Cybercrime</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Date</label>
                                    <input type="date" value={formData.date} onChange={(e) => updateFormData({ date: e.target.value })} className="w-full h-12 rounded-lg border-slate-200 focus:border-accent-blue focus:ring-accent-blue px-3 outline-none transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Time</label>
                                    <input type="time" value={formData.time} onChange={(e) => updateFormData({ time: e.target.value })} className="w-full h-12 rounded-lg border-slate-200 focus:border-accent-blue focus:ring-accent-blue px-3 outline-none transition-all" />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Exact Location</label>
                            <div className="relative w-full h-48 rounded-xl overflow-hidden border border-slate-200">
                                <img alt="Map" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBjUJLyzQteOl0J61FEi14xk_fSeZ3FwMMsAzHTEoDvjmORwgFd8i9lc_7_XC7aNjV18S2y5jvK7hJuSiy_-XUE5okhqN3XUoHUNg_LmwsawZxs2siJkW0avtadgVUsfP8MMBN6gifKbOCtLpFZQbr0ZkXz2Qyj6Nna_a-0magGkH3aVZCm8B6aMDvWeGOIW0ektBZWRN4WmleOc8DSbh3yPcI4pYb2YAJGoRh7HARdeIBd7_p1O_yvqRQ9aU1JW7qQ9vXnlKUS98p" />
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <span className="material-symbols-outlined text-accent-blue text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                                </div>
                            </div>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => updateFormData({ location: e.target.value })}
                                className="w-full h-12 rounded-lg border-slate-200 focus:border-accent-blue focus:ring-accent-blue px-3 outline-none transition-all mt-2"
                                placeholder="Enter address..."
                            />
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Evidence Upload</h2>
                        <p className="text-slate-500 mb-8">Upload photos or videos. These will be hashed onto the blockchain.</p>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Incident Description</label>
                            <textarea
                                className="w-full rounded-lg border-slate-200 focus:border-accent-blue focus:ring-accent-blue p-4 text-sm outline-none transition-all"
                                rows={4}
                                value={formData.description}
                                onChange={(e) => updateFormData({ description: e.target.value })}
                                placeholder="Describe what happened..."
                            />
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="aspect-square rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors">
                                <span className="material-symbols-outlined text-slate-400 text-3xl">cloud_upload</span>
                                <span className="text-[10px] font-bold text-slate-500 mt-2 uppercase">Upload</span>
                            </div>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Review & Submit</h2>
                        <p className="text-slate-500 mb-8">Check your report one last time before it's encrypted and filed.</p>
                        <div className="bg-slate-50 rounded-xl p-6 space-y-4 border border-slate-100">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase">Reporter</p>
                                    <p className="font-semibold text-navy-900">{formData.reporterName}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase">Category</p>
                                    <p className="font-semibold text-navy-900">{formData.category}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase">Date/Time</p>
                                    <p className="font-semibold text-navy-900">{formData.date} • {formData.time}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase">Location</p>
                                    <p className="font-semibold text-navy-900">{formData.location}</p>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-slate-200">
                                <p className="text-xs font-bold text-slate-400 uppercase mb-2">Description</p>
                                <p className="text-sm text-slate-700 italic">{formData.description || "No description provided."}</p>
                            </div>
                        </div>
                        <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100 flex items-start gap-3">
                            <span className="material-symbols-outlined text-emerald-600">verified</span>
                            <p className="text-xs text-emerald-800 font-medium">Ready for on-chain integrity verification. Once submitted, this report becomes an immutable record.</p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="flex min-h-screen bg-white">
            {/* Sidebar Stepper */}
            <aside className="w-80 bg-slate-50 border-r border-slate-200 p-8 hidden md:flex flex-col sticky top-0 h-screen">
                <div className="mb-12">
                    <Link href="/citizen-dashboard" className="flex items-center gap-2 mb-8 group">
                        <span className="material-symbols-outlined text-primary-navy text-3xl group-hover:text-accent-blue transition-colors">shield_person</span>
                        <h1 className="text-xl font-bold tracking-tight text-primary-navy">SecureReport</h1>
                    </Link>
                    <nav className="space-y-8 relative">
                        <div className="absolute left-5 top-2 bottom-2 w-px bg-slate-200 -z-10" />
                        {STEPS.map((step) => {
                            const active = currentStep === step.id;
                            const completed = currentStep > step.id;
                            return (
                                <div key={step.id} className="flex items-start gap-4">
                                    <div className={`size-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 z-10 ${active ? "bg-primary-navy text-white ring-4 ring-primary-navy/10" :
                                            completed ? "bg-emerald-500 text-white" :
                                                "bg-white border-2 border-slate-200 text-slate-400"
                                        }`}>
                                        {completed ? <span className="material-symbols-outlined text-lg">check</span> : step.id}
                                    </div>
                                    <div>
                                        <p className={`text-[10px] font-bold uppercase tracking-widest ${active ? "text-accent-blue" : "text-slate-400"}`}>Step {step.id}</p>
                                        <p className={`text-sm font-bold ${active ? "text-slate-900" : "text-slate-500"}`}>{step.label}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </nav>
                </div>

                <div className="mt-auto p-4 bg-primary-navy/5 rounded-xl border border-primary-navy/10">
                    <p className="text-[11px] text-primary-navy/70 leading-relaxed italic">
                        <span className="material-symbols-outlined text-xs align-middle mr-1">info</span>
                        Encrypted and timestamped using blockchain technology for evidentiary integrity.
                    </p>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center">
                <div className="w-full max-w-3xl px-6 py-12 flex-1">
                    {renderStep()}

                    <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between">
                        <button
                            disabled={currentStep === 1}
                            onClick={prevStep}
                            className={`px-8 h-12 rounded-lg border border-slate-200 font-bold text-sm transition-all ${currentStep === 1 ? "opacity-30 cursor-not-allowed" : "text-slate-600 hover:bg-slate-50"
                                }`}
                        >
                            Back
                        </button>
                        <button
                            onClick={currentStep === 4 ? () => router.push("/my-reports") : nextStep}
                            className="px-10 h-12 rounded-lg bg-primary-navy text-white font-bold hover:bg-navy-800 transition-all shadow-lg shadow-primary-navy/20 flex items-center gap-2"
                        >
                            {currentStep === 4 ? "Submit Report" : "Continue"}
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
