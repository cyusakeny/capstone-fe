"use client";

import React, { useState, useEffect } from "react";
import OfficerHeaderV2 from "@/components/OfficerHeaderV2";
import {
    getIntelligenceReportsSubmissions,
    getIntelligenceReportsIncoming,
    createIntelligenceReport,
    getOfficersByRole,
    assignOfficerToReport,
    getReports
} from "@/lib/api";

interface IntelligenceReport {
    id: string;
    reportId: string;
    title: string;
    description: string;
    priority: "ROUTINE" | "URGENT" | "HIGH";
    officerSubmittingId: string;
    officerSubmittingNames: string;
    officerReceivingId: string;
    officerReceivingNames: string;
    timestamp: string;
    status?: string;
}

export default function OfficerReportsPage() {
    const [activeTab, setActiveTab] = useState<"submissions" | "incoming">("submissions");
    const [showForm, setShowForm] = useState(false);
    const [user, setUser] = useState<{ id: string; name: string } | null>(null);

    // Form State
    const [title, setTitle] = useState("");
    const [priority, setPriority] = useState<"ROUTINE" | "URGENT" | "HIGH">("ROUTINE");
    const [recipientId, setRecipientId] = useState("");
    const [description, setDescription] = useState("");

    const [submissions, setSubmissions] = useState<IntelligenceReport[]>([]);
    const [incoming, setIncoming] = useState<IntelligenceReport[]>([]);
    const [availableOfficers, setAvailableOfficers] = useState<{ id: string; name: string }[]>([]);
    const [assignedReports, setAssignedReports] = useState<any[]>([]);
    const [selectedCaseId, setSelectedCaseId] = useState("");
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const [isPageLoading, setIsPageLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            loadInitialData(parsedUser.id);
        }
    }, []);

    const loadInitialData = async (userId: string) => {
        setIsPageLoading(true);
        try {
            const [subs, inc, admins, allReports] = await Promise.all([
                getIntelligenceReportsSubmissions(),
                getIntelligenceReportsIncoming(),
                getOfficersByRole('ADMIN'),
                getReports()
            ]);
            setSubmissions(subs);
            setIncoming(inc);

            // Fetch and set reports assigned to this officer
            const reportsArray = Array.isArray(allReports) ? allReports : [];
            setAssignedReports(reportsArray);
            if (reportsArray.length > 0) {
                setSelectedCaseId(reportsArray[0].id);
            }

            // Process admin officers
            let adminOfficers = Array.isArray(admins)
                ? admins.map((o: { id: string; name: string }) => ({
                    id: o.id,
                    name: o.name
                })).filter((o: { id: string; name: string }) => o.id !== userId)
                : [];

            // Fallback: If no admins found, maybe search for other officers? 
            // For now, let's just log it and ensure the list isn't empty if possible
            if (adminOfficers.length === 0) {
                console.warn("No ADMIN officers found for recipient list.");
            }

            setAvailableOfficers(adminOfficers);
            if (adminOfficers.length > 0) setRecipientId(adminOfficers[0].id);

        } catch (error) {
            console.error("Error loading intelligence reports data:", error);
        } finally {
            setIsPageLoading(false);
        }
    };

    const handleAssign = async (reportId: string) => {
        if (!user) return;
        setIsLoading(reportId);
        try {
            await assignOfficerToReport(reportId, user.id);
            alert(`Case ${reportId} successfully assigned to you.`);
        } catch (err: any) {
            console.error("Assignment Error:", err);
            alert(err.message || "An error occurred during assignment.");
        } finally {
            setIsLoading(null);
        }
    };

    const handleCreateReport = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        const recipient = availableOfficers.find(o => o.id === recipientId);

        const reportPayload = {
            reportId: selectedCaseId, // Use the real CrimeReport UUID
            title,
            description,
            priority,
            officerSubmittingId: user.id,
            officerSubmittingNames: user.name,
            officerReceivingId: recipientId,
            officerReceivingNames: recipient?.name || "Unknown Officer"
        };

        try {
            const newReport = await createIntelligenceReport(reportPayload);
            setSubmissions([newReport, ...submissions]);
            setShowForm(false);
            setTitle("");
            setDescription("");
            alert(`Intelligence report submitted to ${recipient?.name}`);
        } catch (error: any) {
            alert(error.message || "Failed to create intelligence report");
        }
    };

    return (
        <div className="flex-1 flex flex-col min-h-screen bg-slate-50/50 text-slate-900">
            <OfficerHeaderV2 />

            <main className="p-8 max-w-7xl mx-auto w-full space-y-6">
                <div className="flex items-end justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Intelligence Reports</h1>
                        <p className="text-slate-500 mt-2">Central hub for internal reporting and inter-departmental communication.</p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary/20"
                    >
                        <span className="material-symbols-outlined text-[20px]">{showForm ? "close" : "add_box"}</span>
                        {showForm ? "Cancel Report" : "Create New Report"}
                    </button>
                </div>

                {/* Create Report Form */}
                {showForm && (
                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <span className="material-symbols-outlined text-primary">description</span>
                            </div>
                            <h2 className="text-xl font-bold">File Incident Report</h2>
                        </div>
                        <form onSubmit={handleCreateReport} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4 font-body">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Report Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                                        placeholder="e.g. Suspect movement update"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Related Case</label>
                                    <div className="relative">
                                        <select
                                            required
                                            value={selectedCaseId}
                                            onChange={(e) => setSelectedCaseId(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all appearance-none"
                                        >
                                            {assignedReports.length > 0 ? (
                                                assignedReports.map(r => (
                                                    <option key={r.id} value={r.id}>
                                                        {r.referenceNumber} - {r.title}
                                                    </option>
                                                ))
                                            ) : (
                                                <option value="" disabled>No cases found in ledger</option>
                                            )}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                            <span className="material-symbols-outlined text-base">expand_more</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Priority</label>
                                        <div className="relative">
                                            <select
                                                value={priority}
                                                onChange={(e) => setPriority(e.target.value as any)}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all appearance-none"
                                            >
                                                <option value="ROUTINE">Routine</option>
                                                <option value="URGENT">Urgent</option>
                                                <option value="HIGH">High</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                <span className="material-symbols-outlined text-base">expand_more</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Recipient Officer</label>
                                        <div className="relative">
                                            <select
                                                value={recipientId}
                                                onChange={(e) => setRecipientId(e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all appearance-none"
                                            >
                                                {availableOfficers.length > 0 ? (
                                                    availableOfficers.map(o => <option key={o.id} value={o.id}>{o.name}</option>)
                                                ) : (
                                                    <option value="" disabled>No recipients found</option>
                                                )}
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                <span className="material-symbols-outlined text-base">expand_more</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Report Description</label>
                                    <textarea
                                        required
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={4}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                                        placeholder="Detailed summary of the incident or intelligence..."
                                    />
                                </div>
                                <div className="flex justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                                    >
                                        Discard
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-primary text-white px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all"
                                    >
                                        Submit Report
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex gap-1 bg-white p-1 rounded-xl border border-slate-200 w-fit">
                    <button
                        onClick={() => setActiveTab("submissions")}
                        className={`px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeTab === "submissions"
                            ? "bg-primary-navy text-white shadow-lg"
                            : "text-slate-500 hover:bg-slate-50"
                            }`}
                    >
                        My Submissions
                    </button>
                    <button
                        onClick={() => setActiveTab("incoming")}
                        className={`px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeTab === "incoming"
                            ? "bg-primary-navy text-white shadow-lg"
                            : "text-slate-500 hover:bg-slate-50"
                            }`}
                    >
                        Incoming Reports
                    </button>
                </div>

                {/* Table Content */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">
                                {activeTab === "submissions" ? "Reports Sent to Registry" : "Investigations Distributed to Me"}
                            </h3>
                            <p className="text-sm text-slate-500">
                                Viewing {activeTab === "submissions" ? submissions.length : incoming.length} indexed records.
                            </p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        {isPageLoading ? (
                            <div className="p-20 flex flex-col items-center justify-center gap-4">
                                <div className="size-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                                <p className="text-slate-500 font-medium">Retrieving intel reports...</p>
                            </div>
                        ) : (
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50">
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200">Incident</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200">Priority</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200">{activeTab === "submissions" ? "Recipient" : "Sender"}</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200">Timestamp</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200">Status</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {(activeTab === "submissions" ? submissions : incoming).length > 0 ? (
                                        (activeTab === "submissions" ? submissions : incoming).map((report) => (
                                            <tr key={report.id} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="px-6 py-5">
                                                    <div className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">{report.title}</div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${report.priority === 'HIGH' ? 'bg-red-50 text-red-600' :
                                                        report.priority === 'URGENT' ? 'bg-amber-50 text-amber-600' :
                                                            'bg-blue-50 text-blue-600'
                                                        }`}>
                                                        {report.priority}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-2">
                                                        <div className="size-6 rounded-full bg-slate-200 flex items-center justify-center">
                                                            <span className="material-symbols-outlined text-[14px] text-slate-500">person</span>
                                                        </div>
                                                        <span className="text-xs font-semibold text-slate-700">
                                                            {activeTab === "submissions" ? report.officerReceivingNames : report.officerSubmittingNames}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="text-xs text-slate-600 font-medium">{new Date(report.timestamp).toLocaleString()}</div>
                                                    <div className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-tighter italic">Verified Hash Attached</div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold uppercase ${report.status === 'Verified' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                                                        }`}>
                                                        <span className={`size-1.5 rounded-full ${report.status === 'Verified' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></span>
                                                        {report.status || "FILE_PENDING"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <div className="flex items-center justify-end gap-3">
                                                        <button className="text-slate-400 hover:text-primary transition-colors">
                                                            <span className="material-symbols-outlined text-[20px]">visibility</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-20 text-center">
                                                <p className="text-slate-400 text-sm italic">No intelligence reports found.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Info Card */}
                <div className="bg-primary-navy p-6 rounded-2xl flex items-start gap-4 text-white shadow-lg shadow-primary-navy/20">
                    <div className="p-3 bg-white/10 rounded-xl">
                        <span className="material-symbols-outlined text-white">encrypted</span>
                    </div>
                    <div>
                        <h4 className="font-bold text-sm tracking-tight">Post-Quantum Cryptographic Verification</h4>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                            Every report submitted is automatically hashed and sealed on the Officer Portal blockchain network. Content is immutable once submitted to the central registry and can be used in judicial proceedings as verifiable digital evidence.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
