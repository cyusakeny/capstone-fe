"use client";

import React, { useState, use } from "react";
import OfficerHeader from "@/components/OfficerHeader";

interface EvidenceItem {
    id: string;
    name: string;
    type: "image" | "video" | "audio";
    hash: string;
    thumbnail?: string;
}

const INITIAL_EVIDENCE: EvidenceItem[] = [
    {
        id: "1",
        name: "crime_scene_01.jpg",
        type: "image",
        hash: "e3b0c442...",
        thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuA3P71-TJ0_rgQh1rkxwwVj_1bYWezi8iQQbt1EmaQcbh8n0mkcCdTm1_qtMZbRVFeOoOigiNVg9HzKpbLqFytLZ6AZmTlx5dHCSTmnbeAb1jW9oSEcioefouYCzsHgQfqlZwRcKtENep-h9XicXeJYEcRVQhPUBKHtOL6g7ZFyd8Q1p8n5Ak3adhcHMTvw7gYTiDkvWByqn4TmZfdFz2o3Czwf892sK0bgcrjKVBsVjFK4YVC2ntbDr7IkDhOKgNkDTF-WPaeUbgFG",
    },
    {
        id: "2",
        name: "bodycam_v88.mp4",
        type: "video",
        hash: "f1a2b3c4...",
    },
    {
        id: "3",
        name: "interview_audio.wav",
        type: "audio",
        hash: "d4e5f6g7...",
    },
];

const AUDIT_LOGS = [
    {
        id: "1",
        type: "Note Added",
        time: "10:45 AM",
        desc: '"Identified suspect vehicle on 4th Ave based on witness report..."',
        tx: "0x4f2a...88e1",
        icon: "edit_note",
        color: "bg-primary text-white"
    },
    {
        id: "2",
        type: "Evidence Uploaded",
        time: "09:12 AM",
        desc: "File: bodycam_224.mp4 (42MB)",
        tx: "0x1b7c...33a2",
        icon: "attachment",
        color: "bg-green-100 text-green-700"
    },
    {
        id: "3",
        type: "Case Assigned",
        time: "Oct 24",
        desc: "Assigned to Lead Investigator Officer J. Martinez (#4492)",
        tx: "0x9d3e...77c5",
        icon: "assignment_ind",
        color: "bg-slate-100 text-slate-600"
    }
];

export default function CaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [status, setStatus] = useState("under_investigation");
    const [note, setNote] = useState("");

    return (
        <div className="flex-1 flex flex-col min-h-screen">
            <OfficerHeader caseId={`Case #${id}`} caseType="Grand Theft Auto" showBack />

            <main className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
                <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8">
                    {/* Left Column */}
                    <div className="col-span-12 lg:col-span-8 space-y-8">
                        {/* Investigation Overview */}
                        <section className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                            <div className="border-b border-slate-100 px-6 py-4 bg-slate-50/50 flex justify-between items-center">
                                <h2 className="font-bold text-slate-800">Investigation Overview</h2>
                                <span className="text-xs text-slate-500 font-medium">Incident Date: Oct 24, 2023 14:32</span>
                            </div>
                            <div className="p-6 grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-[11px] uppercase font-bold text-slate-400 tracking-wider mb-1">Primary Location</p>
                                    <p className="text-sm font-medium">742 Evergreen Terrace, Springfield</p>
                                </div>
                                <div>
                                    <p className="text-[11px] uppercase font-bold text-slate-400 tracking-wider mb-1">Case Status</p>
                                    <div className="relative max-w-xs">
                                        <select
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value)}
                                            className="appearance-none w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none cursor-pointer"
                                        >
                                            <option value="under_investigation">Under Investigation</option>
                                            <option value="open">Open</option>
                                            <option value="evidence_pending">Evidence Pending</option>
                                            <option value="closed">Closed / Finalized</option>
                                        </select>
                                        <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-lg">expand_more</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Investigative Notes */}
                        <section className="bg-white border border-slate-200 rounded-xl shadow-sm">
                            <div className="border-b border-slate-100 px-6 py-4 flex justify-between items-center">
                                <h2 className="font-bold text-slate-800">Investigative Notes</h2>
                                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                                    Draft Auto-saved
                                </span>
                            </div>
                            <div className="p-6">
                                <textarea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    className="w-full min-h-[180px] border border-slate-200 rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none placeholder:text-slate-400"
                                    placeholder="Enter detailed case updates, witness statements, or evidence descriptions..."
                                />
                                <div className="mt-4 flex justify-end">
                                    <button className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-all flex items-center gap-2">
                                        <span className="material-symbols-outlined text-sm">lock</span>
                                        Commit Note to Blockchain
                                    </button>
                                </div>
                            </div>
                        </section>

                        {/* Digital Evidence */}
                        <section>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-bold text-slate-800 flex items-center gap-2">
                                    Digital Evidence
                                    <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-full">{INITIAL_EVIDENCE.length} Files</span>
                                </h2>
                                <button className="text-sm font-bold text-primary flex items-center gap-1 hover:underline">
                                    <span className="material-symbols-outlined text-sm">add_circle</span> Add Evidence
                                </button>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {INITIAL_EVIDENCE.map((item) => (
                                    <div key={item.id} className="group bg-white border border-slate-200 p-2 rounded-xl hover:border-primary transition-all cursor-pointer">
                                        <div className="relative aspect-square rounded-lg bg-slate-100 overflow-hidden mb-2">
                                            {item.type === "image" ? (
                                                <img className="h-full w-full object-cover" src={item.thumbnail} alt={item.name} />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-3xl text-slate-300">
                                                        {item.type === "video" ? "videocam" : "mic"}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-md">
                                                <span className="material-symbols-outlined text-[12px]">verified</span>
                                            </div>
                                        </div>
                                        <div className="px-1">
                                            <p className="text-[10px] font-bold text-slate-700 truncate">{item.name}</p>
                                            <p className="text-[9px] font-mono text-slate-400 truncate">SHA: {item.hash}</p>
                                        </div>
                                    </div>
                                ))}
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
                                {AUDIT_LOGS.map((log) => (
                                    <div key={log.id} className="relative pl-8 before:absolute before:left-[11px] before:top-6 before:bottom-[-32px] before:w-px before:bg-slate-200 last:before:hidden">
                                        <div className={`absolute left-0 top-0 size-6 ${log.color} rounded-full flex items-center justify-center z-10`}>
                                            <span className="material-symbols-outlined text-xs">{log.icon}</span>
                                        </div>
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <span className="text-sm font-bold text-slate-800">{log.type}</span>
                                                <span className="text-[10px] text-slate-400 font-medium">{log.time}</span>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{log.desc}</p>
                                            <div className="mt-2">
                                                <code className="text-[9px] font-mono bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200">
                                                    TX: {log.tx}
                                                </code>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 bg-slate-50 border-t border-slate-100 rounded-b-xl">
                                <button className="w-full text-center text-xs font-bold text-slate-500 hover:text-primary py-1 uppercase tracking-widest transition-colors">
                                    View Full Transaction History
                                </button>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}
