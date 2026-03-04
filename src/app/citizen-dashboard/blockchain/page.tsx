"use client";

import React, { useEffect, useState } from "react";
import CitizenSidebar from "@/components/CitizenSidebar";
import { getBlockchainReportsMe, getBlockchainReportAudits, getBlockchainReportEvidence } from "@/lib/api";

interface BlockchainReport {
    reportId: string;
    reporterHash: string;
    title: string;
    reportHash: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    exists: boolean;
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

interface EvidenceProof {
    evidenceId: string;
    reportId: string;
    fileHash: string;
    fileType: string;
    uploadedAt: string;
    exists: boolean;
}

export default function BlockchainReportsPage() {
    const [reports, setReports] = useState<BlockchainReport[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Audit Modal State
    const [selectedReportForAudit, setSelectedReportForAudit] = useState<BlockchainReport | null>(null);
    const [audits, setAudits] = useState<AuditLog[]>([]);
    const [isAuditsLoading, setIsAuditsLoading] = useState(false);
    const [auditsError, setAuditsError] = useState<string | null>(null);

    // Evidence Modal State
    const [selectedReportForEvidence, setSelectedReportForEvidence] = useState<BlockchainReport | null>(null);
    const [evidences, setEvidences] = useState<EvidenceProof[]>([]);
    const [isEvidencesLoading, setIsEvidencesLoading] = useState(false);
    const [evidencesError, setEvidencesError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const data = await getBlockchainReportsMe();
                setReports(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Failed to fetch blockchain reports:", err);
                setError("Failed to load blockchain verification data.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchReports();
    }, []);

    const handleViewAudits = async (report: BlockchainReport) => {
        setSelectedReportForAudit(report);
        setIsAuditsLoading(true);
        setAuditsError(null);
        setAudits([]);
        try {
            const data = await getBlockchainReportAudits(report.reportId);
            setAudits(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to fetch report audits:", err);
            setAuditsError("Could not retrieve audit history from the blockchain.");
        } finally {
            setIsAuditsLoading(false);
        }
    };

    const handleViewEvidence = async (report: BlockchainReport) => {
        setSelectedReportForEvidence(report);
        setIsEvidencesLoading(true);
        setEvidencesError(null);
        setEvidences([]);
        try {
            const data = await getBlockchainReportEvidence(report.reportId);
            setEvidences(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to fetch report evidence:", err);
            setEvidencesError("Could not retrieve evidence proofs from the blockchain.");
        } finally {
            setIsEvidencesLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
            <CitizenSidebar />

            <main className="flex-1 ml-64 p-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative">
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-indigo-50 rounded-xl">
                                    <span className="material-symbols-outlined text-indigo-600">database</span>
                                </div>
                                <span className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600/60">Verification Ledger</span>
                            </div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Blockchain Registry</h1>
                            <p className="text-slate-500 mt-2 max-w-xl text-lg font-medium leading-relaxed">
                                Immutable cryptographic evidence for your submitted reports, ensuring data integrity beyond any departmental control.
                            </p>
                        </div>
                        <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                    </div>

                    {/* Stats/Status Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                            <div className="size-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                                <span className="material-symbols-outlined text-emerald-600">verified</span>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</p>
                                <p className="text-sm font-black text-slate-900">Chain Synchronized</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                            <div className="size-12 rounded-xl bg-blue-50 flex items-center justify-center">
                                <span className="material-symbols-outlined text-blue-600">link</span>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Records</p>
                                <p className="text-sm font-black text-slate-900">{reports.length} Verified Entries</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                            <div className="size-12 rounded-xl bg-amber-50 flex items-center justify-center">
                                <span className="material-symbols-outlined text-amber-600">security</span>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Security</p>
                                <p className="text-sm font-black text-slate-900">ECC Cryptography</p>
                            </div>
                        </div>
                    </div>

                    {/* Main Table Container */}
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden min-h-[500px]">
                        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center gap-4">
                                <div className="h-4 w-1 bg-indigo-600 rounded-full"></div>
                                <h2 className="text-xl font-black text-slate-900 tracking-tight">Immutable Audit Trail</h2>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm text-[10px] font-black uppercase text-slate-500 tracking-widest">
                                <span className="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                Live Network
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400 p-8 space-y-4">
                                <div className="size-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                                <p className="font-bold text-sm tracking-widest uppercase">Querying Distributed Ledger...</p>
                            </div>
                        ) : error ? (
                            <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-red-50/20">
                                <span className="material-symbols-outlined text-red-500 text-6xl mb-4">error</span>
                                <p className="text-red-600 font-bold mb-2">Sync Error</p>
                                <p className="text-slate-500 text-sm max-w-sm">{error}</p>
                            </div>
                        ) : reports.length === 0 ? (
                            <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center text-slate-400">
                                <div className="size-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                    <span className="material-symbols-outlined text-4xl text-slate-200">database_off</span>
                                </div>
                                <p className="text-lg font-bold text-slate-800">No verifiable records found</p>
                                <p className="text-sm max-w-sm mt-2 font-medium">Any reports you submit will appear here once they are anchored to the blockchain.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50/30 border-b border-slate-100">
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Incident Details</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Verification Hash</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Lifecycle Status</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Evidence Proofs</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Audit Logs</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Anchored At</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {reports.map((report, idx) => (
                                            <tr key={idx} className="hover:bg-indigo-50/20 transition-all duration-300 group">
                                                <td className="px-8 py-6">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                                                            {report.title}
                                                        </span>
                                                        <span className="text-[10px] text-slate-400 font-bold mt-1 tracking-tighter">
                                                            ENTROPY_SEQ: {idx.toString().padStart(4, '0')}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 group-hover:border-indigo-100 transition-colors">
                                                            <span className="material-symbols-outlined text-slate-400 text-sm group-hover:text-indigo-400">fingerprint</span>
                                                        </div>
                                                        <div className="flex flex-col max-w-[200px]">
                                                            <span className="text-[10px] font-black text-indigo-600/60 uppercase tracking-tighter">Report Hash</span>
                                                            <span className="text-xs font-mono text-slate-500 break-all leading-tight">
                                                                {report.reportHash}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-center">
                                                    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${report.status === 'ASSIGNED' ? 'bg-blue-50 text-blue-600 ring-1 ring-blue-500/20' :
                                                        report.status === 'VERIFIED' ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-500/20' :
                                                            'bg-slate-100 text-slate-500'
                                                        }`}>
                                                        {report.status}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 text-center">
                                                    <button
                                                        onClick={() => handleViewEvidence(report)}
                                                        className="size-10 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all flex items-center justify-center mx-auto"
                                                        title="View blockchain evidence proofs"
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">verified_user</span>
                                                    </button>
                                                </td>
                                                <td className="px-8 py-6 text-center">
                                                    <button
                                                        onClick={() => handleViewAudits(report)}
                                                        className="size-10 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all flex items-center justify-center mx-auto"
                                                        title="View blockchain audit logs"
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">history</span>
                                                    </button>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold text-slate-900">
                                                            {formatDate(report.updatedAt)}
                                                        </span>
                                                        <span className="text-[10px] text-slate-400 font-medium">UTC SYNC CONFIRMED</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <div className="p-8 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-indigo-400 text-xl">info</span>
                                <p className="text-xs text-slate-500 font-bold max-w-md leading-relaxed">
                                    The "Report Hash" is a unique cryptographic signature of your data. If even a single character is changed in the police database, the hash will no longer match this record.
                                </p>
                            </div>
                            <button className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-[0.1em] text-slate-600 shadow-sm hover:shadow-md hover:bg-slate-50 transition-all flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg">print</span>
                                Certificate of Authenticity
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Audit Modal / Slide-over */}
            {selectedReportForAudit && (
                <div className="fixed inset-0 z-[100] flex items-center justify-end">
                    <div
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={() => setSelectedReportForAudit(null)}
                    ></div>

                    <div className="relative w-full max-w-lg h-screen bg-white shadow-2xl animate-in slide-in-from-right duration-500 ease-out border-l border-slate-200 flex flex-col">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">Audit History</h3>
                                <p className="text-xs font-bold text-indigo-600 mt-1 uppercase tracking-widest">{selectedReportForAudit.title}</p>
                            </div>
                            <button
                                onClick={() => setSelectedReportForAudit(null)}
                                className="size-10 rounded-full hover:bg-white hover:shadow-md transition-all flex items-center justify-center text-slate-400 hover:text-slate-600"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {isAuditsLoading ? (
                                <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 space-y-4">
                                    <div className="size-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                                    <p className="font-bold text-[10px] tracking-widest uppercase">Fetching Proofs...</p>
                                </div>
                            ) : auditsError ? (
                                <div className="p-6 bg-red-50 rounded-2xl border border-red-100 text-center">
                                    <span className="material-symbols-outlined text-red-400 text-4xl mb-2">warning</span>
                                    <p className="text-red-600 text-sm font-bold">{auditsError}</p>
                                </div>
                            ) : audits.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 p-8">
                                    <div className="size-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                        <span className="material-symbols-outlined text-2xl text-slate-200">history_toggle_off</span>
                                    </div>
                                    <p className="text-sm font-bold text-slate-600">No audits found</p>
                                    <p className="text-xs mt-1">This report is in its initial finalized state.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {audits.map((audit, idx) => (
                                        <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all relative overflow-hidden group">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-lg ${audit.actionType === 'UPDATE' ? 'bg-blue-50 text-blue-600' :
                                                        audit.actionType === 'CREATE' ? 'bg-emerald-50 text-emerald-600' :
                                                            'bg-slate-50 text-slate-600'
                                                        }`}>
                                                        <span className="material-symbols-outlined text-[20px]">
                                                            {audit.actionType === 'UPDATE' ? 'edit_square' : 'add_circle'}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-slate-900">{audit.actionType} ACTION</p>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">NODE_ID: {audit.logId}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs font-bold text-slate-900">{formatDate(audit.timestamp).split(',')[0]}</p>
                                                    <p className="text-[10px] text-slate-400 font-medium">{formatDate(audit.timestamp).split(',')[1]}</p>
                                                </div>
                                            </div>

                                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 group-hover:bg-indigo-50/30 group-hover:border-indigo-100 transition-colors">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                                    <span className="size-1 rounded-full bg-indigo-400"></span>
                                                    Cryptographic Payload Hash
                                                </p>
                                                <p className="text-[11px] font-mono text-slate-500 break-all leading-tight">
                                                    {audit.detailsHash}
                                                </p>
                                            </div>

                                            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-emerald-500 text-sm">verified</span>
                                                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">On-Chain Confirmed</span>
                                                </div>
                                                <div className="size-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-slate-100 bg-slate-50/50">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                                Every entry above represents an immutable block on the private ledger. Any modification to the data will result in a mismatch of the parity hash.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Evidence Modal / Slide-over */}
            {selectedReportForEvidence && (
                <div className="fixed inset-0 z-[100] flex items-center justify-end">
                    <div
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={() => setSelectedReportForEvidence(null)}
                    ></div>

                    <div className="relative w-full max-w-lg h-screen bg-white shadow-2xl animate-in slide-in-from-right duration-500 ease-out border-l border-slate-200 flex flex-col">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-emerald-50/30">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">On-Chain Evidence</h3>
                                <p className="text-xs font-bold text-emerald-600 mt-1 uppercase tracking-widest">{selectedReportForEvidence.title}</p>
                            </div>
                            <button
                                onClick={() => setSelectedReportForEvidence(null)}
                                className="size-10 rounded-full hover:bg-white hover:shadow-md transition-all flex items-center justify-center text-slate-400 hover:text-slate-600"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {isEvidencesLoading ? (
                                <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 space-y-4">
                                    <div className="size-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                                    <p className="font-bold text-[10px] tracking-widest uppercase">Verifying Evidence Hashes...</p>
                                </div>
                            ) : evidencesError ? (
                                <div className="p-6 bg-red-50 rounded-2xl border border-red-100 text-center">
                                    <span className="material-symbols-outlined text-red-400 text-4xl mb-2">warning</span>
                                    <p className="text-red-600 text-sm font-bold">{evidencesError}</p>
                                </div>
                            ) : evidences.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 p-8">
                                    <div className="size-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                        <span className="material-symbols-outlined text-2xl text-slate-200">file_off</span>
                                    </div>
                                    <p className="text-sm font-bold text-slate-600">No evidence found</p>
                                    <p className="text-xs mt-1">There are no cryptographic evidence proofs anchored for this report.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {evidences.map((evidence, idx) => (
                                        <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-emerald-200 hover:shadow-md transition-all relative overflow-hidden group">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                                                        <span className="material-symbols-outlined text-[20px]">
                                                            {evidence.fileType.includes('image') ? 'image' : 'description'}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-slate-900">EVIDENCE_CERTIFICATE</p>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">PROOF_ID: {evidence.evidenceId.split('-')[0]}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs font-bold text-slate-900">{formatDate(evidence.uploadedAt).split(',')[0]}</p>
                                                    <p className="text-[10px] text-slate-400 font-medium">{evidence.fileType}</p>
                                                </div>
                                            </div>

                                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 group-hover:bg-emerald-50/30 group-hover:border-emerald-100 transition-colors">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                                    <span className="size-1 rounded-full bg-emerald-400"></span>
                                                    Immutable File Hash (SHA-256)
                                                </p>
                                                <p className="text-[11px] font-mono text-slate-500 break-all leading-tight">
                                                    {evidence.fileHash}
                                                </p>
                                            </div>

                                            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-emerald-500 text-sm">verified</span>
                                                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Anchored to Ledger</span>
                                                </div>
                                                <div className="px-2 py-0.5 bg-emerald-500 text-white text-[8px] font-black rounded uppercase">Verified</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-slate-100 bg-slate-50/50">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                                The file hashes above are cryptographic proofs of the evidence presence. Any modification to the original files will result in a hash mismatch, proving tampering.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
