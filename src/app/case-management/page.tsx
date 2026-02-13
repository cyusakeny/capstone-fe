"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface EvidenceItem {
    id: string;
    name: string;
    type: "image" | "video" | "document" | "audio";
    size?: string;
    url: string;
    duration?: string;
}

const INITIAL_EVIDENCE: EvidenceItem[] = [
    {
        id: "1",
        name: "Primary_Photo_01.jpg",
        type: "image",
        url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCI3dKdly7ozmAV3p7zsS9zG3jmHUlEfhccAYUvDBXS5rePVYX1rheesBgTm3p2QB0b9vrP7vRCrzJRyTOZoQy7zunCV5yZ1-KoFD_fvqMNoZWWuEaBlzyxhoITIp-7G7vHoNtpBYkE8MOmha7LZtTOtT9FRbpO4vcWzQsp6FlDMXGJkVhTx0X5f3XN-WzeC4t49WmpZldFVAVnc9dFhutTvNNRllZGIjpxQsGHZfcy4eB1upBDK-ERH8jbUWEUU55J-WyHk7OIIyYR",
    },
    {
        id: "2",
        name: "CCTV_Footage.mp4",
        type: "video",
        url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAg6Mt2Bb0xrTfGMIh_GFh77czpfKDQFfv0lye7cN8n1oT0STNZrslD4AQa1Wsb2dGyjZ5HUXIUeIKimhKJpI2AQ59XB74Lm77QzfLF3X71OeFtKxoc6_zsw0T9hMBCd9U0tTs3BmzzVPtjnmVAQwktf-2yMZLVSfSsUzMfyQzU3SeXfzMFZM3nETthbhgtULER-avHtyHg8Jlm_58wXiq18oJY-GP7dxkpaylfVoZcuHkgEhh_I5Qc1nwCsWUrhoeHNCrqupF6w1ST",
        duration: "0:24",
    },
    {
        id: "3",
        name: "Debris_Analysis.jpg",
        type: "image",
        url: "https://lh3.googleusercontent.com/aida-public/AB6AXuD9OlKxccBgGqqipsjw_uz_9Wcn481uKExXea22dYeH7AgsE2F2U3UKZAS2q_5xgJyCEtEXM0bXAIwap75i5IDKkxSnoMa2oHHrJXACGsMvXVpgQW18bboOFzr0cnc_tPWPXyxxbmcRmRrV15U4KgX2g_oSrMG99e6bm6BPbQmoI8qqXMwQbWQXhOabb06l-9lgAXf20U1sannaKhdR-oDv8xUqJywAOqmHpTNITlAU3NyhE4pyB_Yp0pwUJ8kSnj_sdhLYgxyS7hQZ",
    },
    {
        id: "4",
        name: "Officer_Notes.pdf",
        type: "document",
        url: "#",
        size: "2.4 MB",
    },
    {
        id: "5",
        name: "Statement_Recording.wav",
        type: "audio",
        url: "#",
        size: "12.1 MB",
    },
];

const TIMELINE_STEPS = [
    { id: "reported", label: "Reported", date: "Oct 12", icon: "check" },
    { id: "assigned", label: "Assigned", date: "Oct 12", icon: "assignment_ind" },
    { id: "investigation", label: "Investigation", date: "Oct 13", icon: "search" },
    { id: "resolution", label: "Resolution", date: "Pending", icon: "verified" },
];

export default function CaseManagement() {
    const router = useRouter();
    const [caseStatus] = useState("Active Investigation");
    const [caseId] = useState("#CR-99281");
    const [caseTitle] = useState("Theft of Silver Sedan");
    const [currentStepIndex] = useState(2); // Index of "Investigation"
    const [evidence] = useState<EvidenceItem[]>(INITIAL_EVIDENCE);

    const activeProgressWidth = `${(currentStepIndex / (TIMELINE_STEPS.length - 1)) * 100}%`;

    return (
        <div className="min-h-screen text-navy-900 bg-slate-50/50">
            {/* Navigation */}
            <nav className="bg-navy-900 text-white sticky top-0 z-50 px-6 py-4 shadow-md">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="hover:bg-white/10 p-2 rounded-full transition-colors flex items-center justify-center"
                        >
                            <span className="material-symbols-outlined text-white">arrow_back</span>
                        </button>
                        <h1 className="text-xl font-bold tracking-tight">Case Management System</h1>
                    </div>
                    <div className="flex items-center gap-6">
                        <span className="text-sm font-medium opacity-80">Citizen Portal</span>
                        <div className="size-10 rounded-full bg-navy-800 border border-white/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-sm">person</span>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="bg-blue-100 text-accent-blue text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                {caseStatus}
                            </span>
                            <span className="text-navy-700 text-sm font-medium">Case ID: {caseId}</span>
                        </div>
                        <h2 className="text-4xl font-extrabold text-navy-900 font-display">{caseTitle}</h2>
                        <p className="text-navy-700 mt-2 flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">calendar_today</span>
                            Reported Oct 12, 2023 • Last updated 2 hours ago
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-6 py-2.5 bg-white border border-slate-200 text-navy-900 font-semibold rounded-lg hover:bg-slate-50 transition-all flex items-center gap-2">
                            <span className="material-symbols-outlined text-xl">print</span>
                            Print Report
                        </button>
                        <button className="px-6 py-2.5 bg-navy-900 text-white font-semibold rounded-lg hover:bg-navy-800 transition-all flex items-center gap-2">
                            <span className="material-symbols-outlined text-xl">share</span>
                            Share Case
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Investigation Progress */}
                        <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <h3 className="text-lg font-bold mb-14 flex items-center gap-2">
                                <span className="material-symbols-outlined text-accent-blue">timeline</span>
                                Investigation Progress
                            </h3>
                            <div className="relative px-4">
                                {/* Timeline base line */}
                                <div className="absolute h-1 bg-slate-100 left-0 right-0 top-6 -z-0 rounded-full" />
                                {/* Active progress line */}
                                <div
                                    className="absolute h-1 bg-accent-blue left-0 top-6 -z-0 transition-all duration-1000 rounded-full"
                                    style={{ width: activeProgressWidth }}
                                />

                                <div className="relative flex justify-between">
                                    {TIMELINE_STEPS.map((step, index) => {
                                        const isActive = index <= currentStepIndex;
                                        const isCurrent = index === currentStepIndex;

                                        return (
                                            <div key={step.id} className="flex flex-col items-center text-center">
                                                <div className={`size-12 rounded-full flex items-center justify-center z-10 transition-all duration-500 ${isActive
                                                        ? "bg-accent-blue text-white shadow-lg shadow-accent-blue/30"
                                                        : "bg-slate-100 text-slate-400 border-2 border-slate-200"
                                                    } ${isCurrent ? "ring-4 ring-blue-50" : ""}`}>
                                                    <span className="material-symbols-outlined">
                                                        {isActive && index < currentStepIndex ? "check" : step.icon}
                                                    </span>
                                                </div>
                                                <p className={`mt-4 font-bold text-sm ${isActive ? "text-navy-900" : "text-slate-400"}`}>
                                                    {step.label}
                                                </p>
                                                <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-wider">
                                                    {step.date}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </section>

                        {/* Evidence Gallery */}
                        <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <span className="material-symbols-outlined text-accent-blue">folder_open</span>
                                    Evidence Gallery
                                </h3>
                                <button className="text-accent-blue text-sm font-bold hover:underline">Download All (.zip)</button>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {evidence.map((item) => (
                                    <div key={item.id} className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer border border-slate-200 bg-slate-50">
                                        {item.type === "image" ? (
                                            <img
                                                src={item.url}
                                                alt={item.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : item.type === "video" ? (
                                            <div className="w-full h-full relative">
                                                <img
                                                    src={item.url}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-white text-4xl">play_circle</span>
                                                </div>
                                                {item.duration && (
                                                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">
                                                        {item.duration}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center p-4 hover:bg-white transition-colors">
                                                <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">
                                                    {item.type === "document" ? "description" : "audio_file"}
                                                </span>
                                                <p className="text-xs font-semibold text-navy-900 text-center truncate w-full px-2">
                                                    {item.name}
                                                </p>
                                                {item.size && <p className="text-[10px] text-slate-500 mt-1">{item.size}</p>}
                                            </div>
                                        )}

                                        {(item.type === "image" || item.type === "video") && (
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                                                <p className="text-white text-xs font-medium truncate w-full">{item.name}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {/* Add Evidence Placeholder */}
                                <div className="aspect-[4/3] rounded-xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-4 hover:bg-slate-100 cursor-pointer transition-colors">
                                    <span className="material-symbols-outlined text-3xl text-slate-300">add</span>
                                    <p className="text-xs font-semibold text-slate-400">Add Evidence</p>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-8">
                        {/* Blockchain Card */}
                        <section className="bg-navy-900 text-white p-8 rounded-2xl shadow-xl shadow-navy-900/20">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="size-10 rounded-lg bg-accent-blue/20 flex items-center justify-center border border-accent-blue/30 text-accent-blue">
                                    <span className="material-symbols-outlined">hub</span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">Immutable Ledger</h3>
                                    <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Blockchain Verified</p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">On-Chain Certificate</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Report Hash Validated</span>
                                        <span className="material-symbols-outlined text-emerald-400">verified_user</span>
                                    </div>
                                </div>
                                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Transaction Hash</p>
                                    <p className="text-xs font-mono break-all opacity-70">0x82f1b4a3902c1102e3d4c5678a9c40212837ff90</p>
                                </div>
                            </div>

                            <button className="w-full bg-accent-blue hover:bg-accent-blue/90 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 shadow-[0_4px_20px_rgba(19,109,236,0.3)] transition-all">
                                <span className="material-symbols-outlined">verified</span>
                                Verify on Blockchain
                            </button>
                            <p className="text-center text-slate-400 text-[10px] mt-6 leading-relaxed">
                                This record is secured by the Polygon network. It cannot be altered by any authority once committed, ensuring maximum public accountability.
                            </p>
                        </section>

                        {/* Investigator Card */}
                        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Assigned Investigator</h3>
                            <div className="flex items-center gap-4">
                                <div className="size-16 rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-200">
                                    <span className="material-symbols-outlined text-3xl text-navy-700">badge</span>
                                </div>
                                <div>
                                    <p className="text-lg font-bold text-navy-900">Det. Sarah Jenkins</p>
                                    <p className="text-sm text-slate-500">Badge #90210 • 12th Precinct</p>
                                </div>
                            </div>
                            <div className="mt-6 grid grid-cols-2 gap-3">
                                <button className="flex items-center justify-center gap-2 py-2 px-4 bg-slate-50 text-navy-900 text-sm font-bold rounded-lg hover:bg-slate-100 border border-slate-200 transition-colors">
                                    <span className="material-symbols-outlined text-lg">mail</span>
                                    Message
                                </button>
                                <button className="flex items-center justify-center gap-2 py-2 px-4 bg-slate-50 text-navy-900 text-sm font-bold rounded-lg hover:bg-slate-100 border border-slate-200 transition-colors">
                                    <span className="material-symbols-outlined text-lg">call</span>
                                    Call
                                </button>
                            </div>
                        </section>

                        {/* Details Card */}
                        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Incident Details</h3>
                            <ul className="space-y-4">
                                {[
                                    { icon: "location_on", label: "Location", value: "842 Downtown Ave, District 4" },
                                    { icon: "category", label: "Category", value: "Larceny - Motor Vehicle" },
                                    { icon: "priority_high", label: "Severity", value: "Medium Priority", highlight: "text-amber-600" },
                                ].map((detail, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-slate-400 mt-0.5">{detail.icon}</span>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase">{detail.label}</p>
                                            <p className={`text-sm font-medium ${detail.highlight || "text-navy-900"}`}>{detail.value}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>
                </div>
            </main>

            <footer className="mt-12 py-8 border-t border-slate-200 bg-white">
                <div className="max-w-7xl mx-auto px-6 text-center text-slate-400 text-sm flex flex-col items-center gap-2">
                    <p>© 2026 Municipal Police Department. All case data is cryptographically secured.</p>
                    <div className="flex gap-4">
                        <a href="#" className="hover:text-accent-blue transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-accent-blue transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-accent-blue transition-colors">Legal Integrity</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
