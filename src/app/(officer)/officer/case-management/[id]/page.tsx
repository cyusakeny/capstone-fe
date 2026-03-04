"use client";

import React, { useState, useEffect, use, useRef } from "react";
import OfficerHeader from "@/components/OfficerHeader";
import { apiUpload, createEvidence, getReportById, getEvidenceByReportId, getFileUrl, addInvestigativeNotes, updateReportStatus, getOfficersByRole, assignOfficerToReport } from "@/lib/api";
import { Report, Evidence } from "@/types/report";

export default function CaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [report, setReport] = useState<Report | null>(null);
    const [evidence, setEvidence] = useState<Evidence[]>([]);
    const [availableOfficers, setAvailableOfficers] = useState<{ id: string; name: string; rank: string }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [note, setNote] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [isSavingNote, setIsSavingNote] = useState(false);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const [isAssigning, setIsAssigning] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [reportData, evidenceData, officersData] = await Promise.all([
                    getReportById(id),
                    getEvidenceByReportId(id),
                    getOfficersByRole('OFFICER')
                ]);
                setReport(reportData);
                setEvidence(evidenceData);
                setAvailableOfficers(officersData);
                setNote(reportData.investigativeNotes || "");
            } catch (err: any) {
                console.error("Failed to fetch case data:", err);
                setError(err.message || "Failed to load case data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleSaveNotes = async () => {
        if (!report) return;
        setIsSavingNote(true);
        try {
            await addInvestigativeNotes(report.id, note);
            setReport({ ...report, investigativeNotes: note });
            alert("Investigative notes updated successfully.");
        } catch (err: any) {
            console.error("Failed to save notes:", err);
            alert("Failed to save notes: " + (err.message || "Unknown error"));
        } finally {
            setIsSavingNote(false);
        }
    };

    const handleAssignOfficer = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const officerId = e.target.value;
        if (!report || officerId === report.assigned_officer_id) return;

        setIsAssigning(true);
        try {
            await assignOfficerToReport(report.id, officerId);
            setReport({ ...report, assigned_officer_id: officerId });
            alert("Officer assigned successfully.");
        } catch (err: any) {
            console.error("Failed to assign officer:", err);
            alert("Failed to assign officer: " + (err.message || "Unknown error"));
        } finally {
            setIsAssigning(false);
        }
    };

    const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value;
        if (!report || newStatus === report.status) return;

        setIsUpdatingStatus(true);
        try {
            await updateReportStatus(report.id, newStatus);
            setReport({ ...report, status: newStatus });
            alert(`Status updated to ${newStatus} successfully.`);
        } catch (err: any) {
            console.error("Failed to update status:", err);
            alert("Failed to update status: " + (err.message || "Unknown error"));
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    const handleAddEvidence = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;

        setIsUploading(true);
        const file = e.target.files[0];

        try {
            // 1. Upload the file
            const uploadRes = await apiUpload(file);
            console.log("File Uploaded:", uploadRes);

            // 2. Link file to the report (case)
            const newEvidenceRes = await createEvidence(id, uploadRes.id, `Officer added evidence: ${file.name}`);

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
            <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-slate-50">
                <div className="size-10 border-3 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
                <p className="text-slate-500 font-medium">Loading investigative data...</p>
            </div>
        );
    }

    if (error || !report) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6">
                <div className="bg-white border border-red-100 p-8 rounded-2xl max-w-md text-center shadow-sm">
                    <span className="material-symbols-outlined text-red-500 text-4xl mb-3">error</span>
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Error Loading Case</h2>
                    <p className="text-slate-600 mb-6">{error || "The requested case could not be found."}</p>
                    <button
                        onClick={() => window.history.back()}
                        className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-slate-800 transition-all"
                    >
                        Back to List
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col min-h-screen">
            <OfficerHeader caseId={`Case #${report.referenceNumber || report.id.slice(0, 8)}`} caseType={report.category} showBack />

            <main className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
                <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8">
                    {/* Left Column */}
                    <div className="col-span-12 lg:col-span-8 space-y-8">
                        {/* Investigation Overview */}
                        <section className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                            <div className="border-b border-slate-100 px-6 py-4 bg-slate-50/50 flex justify-between items-center">
                                <h2 className="font-bold text-slate-800">Investigation Overview</h2>
                                <span className="text-xs text-slate-500 font-medium">Incident Date: {new Date(report.incident_date).toLocaleDateString()} {report.incident_time}</span>
                            </div>
                            <div className="p-6 grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-[11px] uppercase font-bold text-slate-400 tracking-wider mb-1">Primary Location</p>
                                    <p className="text-sm font-medium">{report.location}</p>
                                    <p className="text-[10px] text-slate-400 mt-0.5">{report.latitude}, {report.longitude}</p>
                                </div>
                                <div>
                                    <p className="text-[11px] uppercase font-bold text-slate-400 tracking-wider mb-1">Assigned Investigator</p>
                                    <div className="relative max-w-xs">
                                        <select
                                            disabled={isAssigning}
                                            value={report.assigned_officer_id || ""}
                                            onChange={handleAssignOfficer}
                                            className="appearance-none w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 outline-none hover:border-primary transition-colors cursor-pointer"
                                        >
                                            <option value="" disabled>Select Officer</option>
                                            {availableOfficers.map(off => (
                                                <option key={off.id} value={off.id}>
                                                    {off.rank} {off.name}
                                                </option>
                                            ))}
                                        </select>
                                        <span className={`material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-lg ${isAssigning ? 'animate-spin' : ''}`}>
                                            {isAssigning ? 'sync' : 'badge'}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[11px] uppercase font-bold text-slate-400 tracking-wider mb-1">Case Status</p>
                                    <div className="relative max-w-xs">
                                        <select
                                            disabled={isUpdatingStatus}
                                            value={report.status.toUpperCase()}
                                            onChange={handleStatusChange}
                                            className="appearance-none w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 outline-none hover:border-primary transition-colors cursor-pointer"
                                        >
                                            <option value="SUBMITTED">SUBMITTED</option>
                                            <option value="ACCEPTED">ACCEPTED</option>
                                            <option value="REJECTED">REJECTED</option>
                                            <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                                        </select>
                                        <span className={`material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-lg ${isUpdatingStatus ? 'animate-spin' : ''}`}>
                                            {isUpdatingStatus ? 'sync' : 'expand_more'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="px-6 pb-6 pt-2 border-t border-slate-50">
                                <p className="text-[11px] uppercase font-bold text-slate-400 tracking-wider mb-2">Initial Report Description</p>
                                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg italic">
                                    "{report.description}"
                                </p>
                            </div>
                        </section>

                        {/* Investigative Notes */}
                        <section className="bg-white border border-slate-200 rounded-xl shadow-sm">
                            <div className="border-b border-slate-100 px-6 py-4 flex justify-between items-center">
                                <h2 className="font-bold text-slate-800">Investigative Notes</h2>
                                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                    <span className={`h-1.5 w-1.5 rounded-full ${isSavingNote ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                                    {isSavingNote ? 'Saving Changes...' : 'Last Saved: ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <div className="p-6">
                                <textarea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    disabled={isSavingNote}
                                    className="w-full min-h-[180px] border border-slate-200 rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none placeholder:text-slate-400 disabled:opacity-70"
                                    placeholder="Enter detailed case updates, witness statements, or evidence descriptions..."
                                />
                                <div className="mt-4 flex justify-end">
                                    <button
                                        onClick={handleSaveNotes}
                                        disabled={isSavingNote || note === (report.investigativeNotes || "")}
                                        className="bg-primary hover:scale-[1.02] active:scale-[0.98] text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:grayscale disabled:hover:scale-100"
                                    >
                                        <span className={`material-symbols-outlined text-sm ${isSavingNote ? 'animate-spin' : ''}`}>
                                            {isSavingNote ? 'sync' : 'save'}
                                        </span>
                                        {isSavingNote ? 'Committing...' : 'Commit Note to Secure Ledger'}
                                    </button>
                                </div>
                            </div>
                        </section>

                        {/* Digital Evidence */}
                        <section>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-bold text-slate-800 flex items-center gap-2">
                                    Digital Evidence
                                    <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-full">{evidence.length} Files</span>
                                </h2>
                                <label className="text-sm font-bold text-primary flex items-center gap-1 hover:underline cursor-pointer group">
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
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {evidence.map((item) => {
                                    const isImage = item.file.mimeType.startsWith('image/');
                                    const isVideo = item.file.mimeType.startsWith('video/');
                                    const fileUrl = getFileUrl(item.fileId);

                                    return (
                                        <div
                                            key={item.id}
                                            onClick={() => window.open(fileUrl, '_blank')}
                                            className="group bg-white border border-slate-200 p-2 rounded-2xl hover:border-primary hover:shadow-lg transition-all cursor-pointer overflow-hidden"
                                        >
                                            <div className="relative aspect-square rounded-xl bg-slate-50 overflow-hidden mb-2">
                                                {isImage ? (
                                                    <img className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" src={fileUrl} alt={item.file.originalName} />
                                                ) : (
                                                    <div className="h-full w-full flex flex-col items-center justify-center gap-2 bg-slate-100">
                                                        <span className="material-symbols-outlined text-3xl text-slate-400">
                                                            {isVideo ? "videocam" : "description"}
                                                        </span>
                                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{item.file.mimeType.split('/')[1]}</p>
                                                    </div>
                                                )}
                                                <div className="absolute top-2 right-2 bg-emerald-500 text-white p-1 rounded-lg shadow-sm">
                                                    <span className="material-symbols-outlined text-[12px] block">verified</span>
                                                </div>
                                            </div>
                                            <div className="px-1.5 pb-1">
                                                <p className="text-[10px] font-bold text-slate-700 truncate">{item.file.originalName}</p>
                                                <p className="text-[9px] font-mono text-slate-400 truncate opacity-0 group-hover:opacity-100 transition-opacity">ID: {item.fileId.slice(0, 12)}...</p>
                                            </div>
                                        </div>
                                    );
                                })}
                                {evidence.length === 0 && (
                                    <div className="col-span-full py-12 flex flex-col items-center justify-center bg-white border border-dashed border-slate-200 rounded-2xl opacity-60">
                                        <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">folder_off</span>
                                        <p className="text-xs font-medium text-slate-400">No physical evidence attached yet</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Right Column (Audit Trail) */}
                    <div className="col-span-12 lg:col-span-4">
                        <section className="bg-white border border-slate-200 rounded-xl shadow-sm h-full flex flex-col">
                            <div className="p-6 border-b border-slate-100">
                                <h2 className="font-bold text-slate-800">Immutable Audit Trail</h2>
                                <p className="text-xs text-slate-500 mt-1">Real-time distributed ledger logs</p>
                            </div>
                            <div className="p-6 space-y-8 flex-1 overflow-y-auto max-h-[calc(100vh-280px)] custom-scrollbar">
                                {/* Mock Audit Logs for now until we have an actual logs API */}
                                {[
                                    {
                                        id: "1",
                                        type: "Report Submitted",
                                        time: new Date(report.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                        desc: `Citizen submitted evidence for category: ${report.category}`,
                                        tx: report.reporterHash?.slice(0, 16) || "Pending Consensus",
                                        icon: "article",
                                        color: "bg-blue-100 text-blue-700"
                                    },
                                    {
                                        id: "2",
                                        type: "Case Status",
                                        time: "Update",
                                        desc: `Initial status set to ${report.status}`,
                                        tx: "Genesis Block",
                                        icon: "history",
                                        color: "bg-slate-100 text-slate-600"
                                    }
                                ].map((log) => (
                                    <div key={log.id} className="relative pl-8 before:absolute before:left-[11px] before:top-6 before:bottom-[-32px] before:w-px before:bg-slate-100 last:before:hidden">
                                        <div className={`absolute left-0 top-0 size-6 ${log.color} rounded-full flex items-center justify-center z-10 border-2 border-white shadow-sm`}>
                                            <span className="material-symbols-outlined text-xs">{log.icon}</span>
                                        </div>
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <span className="text-sm font-bold text-slate-800">{log.type}</span>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{log.time}</span>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{log.desc}</p>
                                            <div className="mt-2 group cursor-pointer">
                                                <code className="text-[9px] font-mono bg-slate-50 text-slate-400 px-2 py-1 rounded-lg border border-slate-100 group-hover:bg-primary/5 group-hover:text-primary group-hover:border-primary/20 transition-all block truncate">
                                                    TX: {log.tx}
                                                </code>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 bg-slate-50 border-t border-slate-100 rounded-b-xl">
                                <button className="w-full text-center text-[10px] font-black text-slate-400 hover:text-primary py-2 uppercase tracking-[0.2em] transition-colors">
                                    View Node Transactions
                                </button>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}
