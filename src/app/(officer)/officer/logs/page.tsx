"use client";

import React, { useState, useEffect } from "react";
import OfficerHeaderV2 from "@/components/OfficerHeaderV2";
import { getBlockchainUserAudits } from "@/lib/api";

interface AccessLog {
    id: string;
    referenceNumber: string;
    eventType: string;
    description: string;
    userId: string;
    reportId: string | null;
    timestamp: string;
}

interface AuditLog {
    logId: string;
    reportId: string;
    reportTitle: string;
    actionType: string;
    performedByUserId: string;
    detailsHash: string;
    timestamp: string;
    exists: boolean;
}

export default function OfficerLogsPage() {
    const [activeTab, setActiveTab] = useState<"logs" | "audits">("logs");
    const [logs, setLogs] = useState<AccessLog[]>([]);
    const [audits, setAudits] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [auditsLoading, setAuditsLoading] = useState(false);
    const [user, setUser] = useState<{ id: string; name: string } | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            fetchLogs(parsedUser.id);
            fetchAudits(parsedUser.id);
        }
    }, []);

    const fetchLogs = async (userId: string) => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:5000/access-logs/user/${userId}`);
            if (response.ok) {
                const data = await response.json();
                setLogs(data);
            }
        } catch (error) {
            console.error("Error fetching logs:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAudits = async (userId: string) => {
        try {
            setAuditsLoading(true);
            const data = await getBlockchainUserAudits(userId);
            setAudits(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching blockchain audits:", error);
        } finally {
            setAuditsLoading(false);
        }
    };

    const getIconForEvent = (eventType: string) => {
        switch (eventType) {
            case 'LOGIN': return 'login';
            case 'REPORTS_VIEWED': return 'visibility';
            case 'EVIDENCE_UPLOADED': return 'upload_file';
            case 'REPORT_ASSIGNED': return 'person_add';
            case 'REPORT_STATUS_UPDATED': return 'edit_note';
            default: return 'info';
        }
    };

    const getColorForEvent = (eventType: string) => {
        switch (eventType) {
            case 'LOGIN': return 'text-blue-500 bg-blue-50';
            case 'REPORTS_VIEWED': return 'text-slate-500 bg-slate-50';
            case 'EVIDENCE_UPLOADED': return 'text-emerald-500 bg-emerald-50';
            case 'REPORT_ASSIGNED': return 'text-purple-500 bg-purple-50';
            case 'REPORT_STATUS_UPDATED': return 'text-amber-500 bg-amber-50';
            default: return 'text-slate-500 bg-slate-50';
        }
    };

    return (
        <div className="flex-1 flex flex-col min-h-screen bg-slate-50/50">
            <OfficerHeaderV2 />

            <main className="p-8 max-w-7xl mx-auto w-full space-y-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Logs & Audits</h1>
                    <p className="text-slate-500 mt-1">Immutable record of operational activity and security events.</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 bg-white p-1 rounded-xl border border-slate-200 w-fit">
                    <button
                        onClick={() => setActiveTab("logs")}
                        className={`px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeTab === "logs"
                            ? "bg-primary-navy text-white shadow-lg"
                            : "text-slate-500 hover:bg-slate-50"
                            }`}
                    >
                        Activity Logs
                    </button>
                    <button
                        onClick={() => setActiveTab("audits")}
                        className={`px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeTab === "audits"
                            ? "bg-primary-navy text-white shadow-lg"
                            : "text-slate-500 hover:bg-slate-50"
                            }`}
                    >
                        Audit Trails
                    </button>
                </div>

                {/* Content */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden min-h-[500px]">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">
                                {activeTab === "logs" ? "Daily Activity Feed" : "Security Audit Ledger"}
                            </h3>
                            <p className="text-sm text-slate-500">
                                {activeTab === "logs"
                                    ? "Tracking all user interactions and workflow steps."
                                    : "Blockchain-backed record of critical system state changes."}
                            </p>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                            <span className="material-symbols-outlined text-[18px]">download</span>
                            Export {activeTab === "logs" ? "Logs" : "Audits"}
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        {(activeTab === "logs" ? loading : auditsLoading) ? (
                            <div className="p-20 flex flex-col items-center justify-center gap-4">
                                <div className="size-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                                <p className="text-slate-500 font-medium">Retrieving secure {activeTab}...</p>
                            </div>
                        ) : activeTab === "logs" ? (
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50">
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200">Event Type</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200">Description / Detail</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200">Timestamp</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200">Reference ID</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {logs.length > 0 ? (
                                        logs.map((log) => (
                                            <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded-lg ${getColorForEvent(log.eventType)}`}>
                                                            <span className="material-symbols-outlined text-[20px]">{getIconForEvent(log.eventType)}</span>
                                                        </div>
                                                        <span className="text-sm font-bold text-slate-900">{log.eventType.replace(/_/g, ' ')}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <p className="text-xs text-slate-600 leading-relaxed">{log.description}</p>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="text-xs font-medium text-slate-500">
                                                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                    <div className="text-[10px] text-slate-400 mt-0.5">
                                                        {new Date(log.timestamp).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className="text-[10px] font-mono bg-slate-100 px-2 py-1 rounded text-slate-500 border border-slate-200">
                                                        {log.referenceNumber}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-20 text-center">
                                                <p className="text-slate-400 text-sm italic">No activity logs found for your account.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        ) : (
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50">
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200">Action Type</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200">Report Context</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200">Timestamp</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200">Ledger ID</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {audits.length > 0 ? (
                                        audits.map((audit) => (
                                            <tr key={audit.logId} className="hover:bg-indigo-50/20 transition-all duration-300 group">
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded-lg ${audit.actionType === 'UPDATE' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                                            <span className="material-symbols-outlined text-[20px]">
                                                                {audit.actionType === 'UPDATE' ? 'edit_square' : 'add_circle'}
                                                            </span>
                                                        </div>
                                                        <span className="text-sm font-black text-slate-900 uppercase tracking-tight">{audit.actionType}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold text-slate-700">{audit.reportTitle}</span>
                                                        <span className="text-[10px] text-slate-400 font-mono mt-1 break-all max-w-[200px] truncate">{audit.detailsHash}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="text-xs font-bold text-slate-600">
                                                        {new Date(audit.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                    <div className="text-[10px] text-slate-400 mt-0.5">
                                                        {new Date(audit.timestamp).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-black text-indigo-600/60 uppercase tracking-widest px-2 py-1 bg-indigo-50 rounded border border-indigo-100">
                                                            {audit.logId}
                                                        </span>
                                                        <span className="material-symbols-outlined text-emerald-500 text-sm" title="Verified on Blockchain">verified</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-20 text-center">
                                                <p className="text-slate-400 text-sm italic">No blockchain-verified audit trails found for your account.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>

                    <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                        <p className="text-xs text-slate-500 font-medium italic">
                            {activeTab === "audits"
                                ? "Showing latest blockchain-verified audit snapshots."
                                : "Activity logs are retained for 90 days as per protocol."}
                        </p>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-400 cursor-not-allowed">Previous</button>
                            <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50">Next Page</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
