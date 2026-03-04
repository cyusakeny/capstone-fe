"use client";

import React, { useState, useEffect, use, useRef } from "react";
import { useRouter } from "next/navigation";
import { getReportById, getEvidenceByReportId, getFileUrl, apiUpload, createEvidence } from "@/lib/api";
import { Report, Evidence } from "@/types/report";

const TIMELINE_STEPS = [
    { id: "SUBMITTED", label: "Reported", icon: "check" },
    { id: "ASSIGNED", label: "Assigned", icon: "assignment_ind" },
    { id: "INVESTIGATING", label: "Investigation", icon: "search" },
    { id: "RESOLVED", label: "Resolution", icon: "verified" },
];

export default function CaseManagement({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();

    const [report, setReport] = useState<Report | null>(null);
    const [evidence, setEvidence] = useState<Evidence[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [reportData, evidenceData] = await Promise.all([
                    getReportById(id),
                    getEvidenceByReportId(id)
                ]);
                setReport(reportData);
                setEvidence(evidenceData);
            } catch (err: any) {
                console.error("Failed to fetch case data:", err);
                setError(err.message || "Failed to load case data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleAddEvidence = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;

        setIsUploading(true);
        const file = e.target.files[0];

        try {
            // 1. Upload the file
            const uploadRes = await apiUpload(file);
            console.log("File Uploaded:", uploadRes);

            // 2. Link file to the report (case)
            await createEvidence(id, uploadRes.id, `Citizen added evidence: ${file.name}`);

            // 3. Refresh evidence list
            const updatedEvidence = await getEvidenceByReportId(id);
            setEvidence(updatedEvidence);

            alert("Evidence added successfully!");
        } catch (err) {
            console.error("Failed to add evidence:", err);
            alert("Failed to add evidence. Please try again.");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
                <div className="size-12 border-4 border-accent-blue/30 border-t-accent-blue rounded-full animate-spin mb-4"></div>
                <p className="text-navy-900 font-bold">Synchronizing with Secure Ledger...</p>
            </div>
        );
    }

    if (error || !report) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
                <div className="bg-red-50 border border-red-100 p-8 rounded-3xl max-w-md text-center">
                    <span className="material-symbols-outlined text-red-500 text-5xl mb-4">gpp_maybe</span>
                    <h2 className="text-2xl font-black text-navy-900 mb-2">Access Denied / Error</h2>
                    <p className="text-slate-600 mb-6">{error || "The requested case record could not be found or verified."}</p>
                    <button
                        onClick={() => router.back()}
                        className="w-full bg-navy-900 text-white py-3 rounded-xl font-bold hover:bg-navy-800 transition-all"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    // Determine current step index based on report status
    const currentStatus = report.status.toUpperCase();
    const getStepIndex = (status: string) => {
        switch (status) {
            case "SUBMITTED":
                return 0;
            case "ASSIGNED":
                return 1;
            case "UNDER_REVIEW":
            case "INVESTIGATING":
                return 2;
            case "ACCEPTED":
            case "REJECTED":
            case "RESOLVED":
            case "CLOSED":
                return 3;
            default:
                return 0;
        }
    };
    const finalizedIndex = getStepIndex(currentStatus);

    const activeProgressWidth = `${(finalizedIndex / (TIMELINE_STEPS.length - 1)) * 100}%`;

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
                            <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${['RESOLVED', 'CLOSED'].includes(report.status.toUpperCase()) ? "bg-emerald-100 text-emerald-700" :
                                ['INVESTIGATING', 'ASSIGNED'].includes(report.status.toUpperCase()) ? "bg-blue-100 text-accent-blue" :
                                    "bg-slate-200 text-slate-600"
                                }`}>
                                {report.status}
                            </span>
                            <span className="text-xs font-mono text-slate-400"># {report.referenceNumber || report.id.slice(0, 12)}</span>
                        </div>
                        <h2 className="text-4xl font-extrabold text-navy-900 font-display">{report.title}</h2>
                        <p className="text-navy-700 mt-2 flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg text-slate-400">calendar_today</span>
                            Reported {new Date(report.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })} at {report.incident_time}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-6 py-2.5 bg-white border border-slate-200 text-navy-900 font-semibold rounded-lg hover:bg-slate-50 transition-all flex items-center gap-2">
                            <span className="material-symbols-outlined text-xl">print</span>
                            Print Case
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
                                        const isActive = index <= finalizedIndex;
                                        const isCurrent = index === finalizedIndex;

                                        return (
                                            <div key={step.id} className="flex flex-col items-center text-center">
                                                <div className={`size-12 rounded-full flex items-center justify-center z-10 transition-all duration-500 ${isActive
                                                    ? "bg-accent-blue text-white shadow-lg shadow-accent-blue/30"
                                                    : "bg-white border-2 border-slate-200 text-slate-400"
                                                    } ${isCurrent ? "ring-4 ring-blue-50" : ""}`}>
                                                    <span className="material-symbols-outlined">
                                                        {isActive && index < finalizedIndex ? "check" : step.icon}
                                                    </span>
                                                </div>
                                                <p className={`mt-4 font-bold text-sm ${isActive ? "text-navy-900" : "text-slate-400"}`}>
                                                    {step.label}
                                                </p>
                                                <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-wider">
                                                    {isActive && index === finalizedIndex ? "CURRENT" : isActive ? "COMPLETED" : "PENDING"}
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
                                <label className="text-sm font-bold text-accent-blue flex items-center gap-1 hover:underline cursor-pointer group">
                                    <input
                                        type="file"
                                        className="hidden"
                                        ref={fileInputRef}
                                        onChange={handleAddEvidence}
                                        disabled={isUploading}
                                    />
                                    <span className="material-symbols-outlined text-sm group-hover:rotate-90 transition-transform">{isUploading ? "sync" : "add_circle"}</span>
                                    {isUploading ? "Uploading..." : "Add Evidence"}
                                </label>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                {evidence.length > 0 ? evidence.map((item) => {
                                    const isImage = item.file.mimeType.startsWith('image/');
                                    const isVideo = item.file.mimeType.startsWith('video/');
                                    const fileUrl = getFileUrl(item.fileId);

                                    return (
                                        <div
                                            key={item.id}
                                            onClick={() => window.open(fileUrl, '_blank')}
                                            className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer border border-slate-200 bg-slate-50 hover:shadow-xl transition-all"
                                        >
                                            {isImage ? (
                                                <img
                                                    src={fileUrl}
                                                    alt={item.file.originalName}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : isVideo ? (
                                                <div className="w-full h-full relative">
                                                    <div className="absolute inset-0 bg-slate-200 flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-navy-900 text-4xl">video_file</span>
                                                    </div>
                                                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <span className="material-symbols-outlined text-white text-4xl">play_circle</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center p-4 hover:bg-white transition-colors">
                                                    <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">
                                                        {item.file.mimeType.includes('pdf') ? "description" : "draft"}
                                                    </span>
                                                    <p className="text-xs font-semibold text-navy-900 text-center truncate w-full px-2">
                                                        {item.file.originalName}
                                                    </p>
                                                    <p className="text-[10px] text-slate-500 mt-1">{(item.file.size / 1024).toFixed(1)} KB</p>
                                                </div>
                                            )}

                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                                <p className="text-white text-xs font-bold truncate">{item.file.originalName}</p>
                                                <p className="text-white/60 text-[9px] mt-1 line-clamp-1">{item.description}</p>
                                            </div>
                                        </div>
                                    );
                                }) : (
                                    <div className="col-span-full py-12 flex flex-col items-center text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                                        <span className="material-symbols-outlined text-slate-300 text-5xl mb-2">folder_off</span>
                                        <p className="text-slate-400 font-medium italic">No evidence has been attached to this record yet.</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-8">
                        {/* Blockchain Card */}
                        <section className="bg-navy-900 text-white p-8 rounded-3xl shadow-2xl shadow-navy-900/40 relative overflow-hidden">
                            <div className="absolute -top-12 -right-12 size-48 bg-accent-blue/10 rounded-full blur-3xl pointer-events-none" />
                            <div className="absolute -bottom-12 -left-12 size-48 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

                            <div className="flex items-center gap-3 mb-6 relative">
                                <div className="size-10 rounded-xl bg-accent-blue/20 flex items-center justify-center border border-accent-blue/30 text-accent-blue">
                                    <span className="material-symbols-outlined">hub</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-black leading-tight">Immutable Record</h3>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Polygon Network Active</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8 relative">
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-accent-blue/50 transition-colors group cursor-help">
                                    <p className="text-[10px] text-slate-500 uppercase font-black mb-2 tracking-tighter">On-Chain Integrity Hash</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-mono opacity-80 truncate mr-4">{report.reporterHash || "Wait for consensus..."}</span>
                                        <span className="material-symbols-outlined text-emerald-400 group-hover:scale-110 transition-transform">verified_user</span>
                                    </div>
                                </div>
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <p className="text-[10px] text-slate-500 uppercase font-black mb-2 tracking-tighter">Cryptographic Timestamp</p>
                                    <p className="text-xs font-mono opacity-80">{new Date(report.created_at).toISOString()}</p>
                                </div>
                            </div>

                            <button className="w-full bg-accent-blue hover:bg-blue-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 shadow-[0_8px_30px_rgba(19,109,236,0.4)] hover:shadow-none transition-all duration-300">
                                <span className="material-symbols-outlined">qr_code_2</span>
                                View Certificate
                            </button>
                            <p className="text-center text-slate-500 text-[10px] mt-6 leading-relaxed font-medium">
                                Secured via smart contract execution. Content hash matches original filing payload.
                            </p>
                        </section>

                        {/* Details Card */}
                        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 px-1">Incident Record</h3>
                            <ul className="space-y-6">
                                {[
                                    { icon: "location_on", label: "Incident Location", value: report.location },
                                    { icon: "category", label: "Crime Category", value: report.category },
                                    { icon: "person", label: "Lead Investigator", value: report.assigned_officer_id || "Pending Assignment", highlight: report.assigned_officer_id ? "text-navy-900" : "text-amber-600" },
                                ].map((detail, i) => (
                                    <li key={i} className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                                        <div className="size-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-accent-blue transition-colors border border-transparent group-hover:border-slate-100">
                                            <span className="material-symbols-outlined text-xl">{detail.icon}</span>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{detail.label}</p>
                                            <p className={`text-sm font-bold mt-0.5 ${detail.highlight || "text-navy-900"}`}>{detail.value}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-8 p-4 bg-navy-900/5 rounded-2xl border border-navy-900/10">
                                <h4 className="text-xs font-bold text-navy-900 mb-2">Public Statement</h4>
                                <p className="text-xs text-slate-600 leading-relaxed italic line-clamp-6">
                                    "{report.description || "No public description provided by the reporter."}"
                                </p>
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            <footer className="mt-12 py-8 border-t border-slate-200 bg-white">
                <div className="max-w-7xl mx-auto px-6 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
                    <p>© 2026 Municipal Police Bureau. SecureReport System v2.4.0-immut</p>
                    <div className="flex gap-4 font-medium">
                        <a href="#" className="hover:text-accent-blue transition-colors">Audit Policy</a>
                        <a href="#" className="hover:text-accent-blue transition-colors">Privacy Shield</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
