"use client";

import React from "react";
import Link from "next/link";
import OfficerHeaderV2 from "@/components/OfficerHeaderV2";
import { getReports, apiFetch } from "@/lib/api";
import { Report } from "@/types/report";

export default function OfficerDashboardV2() {
    const [user, setUser] = React.useState<{ id: string } | null>(null);
    const [reports, setReports] = React.useState<Report[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse officer from localStorage", e);
            }
        }

        const fetchReports = async () => {
            try {
                setIsLoading(true);
                const data = await getReports();
                if (Array.isArray(data)) {
                    // Sort by created_at descending
                    const sortedData = data.sort((a, b) =>
                        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                    );
                    setReports(sortedData);
                }
            } catch (err: any) {
                console.error("Failed to fetch reports:", err);
                setError(err.message || "Failed to load reports");
            } finally {
                setIsLoading(false);
            }
        };

        fetchReports();
    }, []);

    const stats = [
        { label: "Total Assigned", value: reports.filter(r => r.assigned_officer_id === user?.id).length.toString(), change: "Active", changeType: "positive", icon: "assignment", color: "bg-blue-50 text-blue-600" },
        { label: "Pending Review", value: reports.filter(r => r.status.toLowerCase() === 'submitted' || r.status.toLowerCase() === 'pending').length.toString(), change: "Queue", changeType: "neutral", icon: "pending_actions", color: "bg-amber-50 text-amber-600" },
        { label: "Urgent Cases", value: reports.filter(r => (r.status.toLowerCase() === 'submitted' || r.status.toLowerCase() === 'pending') && (r.description.toLowerCase().includes('urgent') || r.title.toLowerCase().includes('urgent'))).length.toString(), change: "Alert", changeType: "urgent", icon: "priority_high", color: "bg-red-50 text-red-600" },
        { label: "Blockchain Nodes", value: "1,204", change: "Synced", changeType: "synced", icon: "verified", color: "bg-white/10 text-white", dark: true },
    ];

    if (isLoading) {
        return (
            <div className="flex-1 flex flex-col min-h-screen bg-slate-50/50 items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="size-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-medium tracking-tight">Accessing Case Information...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col min-h-screen">
            <OfficerHeaderV2 />

            <main className="p-8 max-w-7xl mx-auto w-full space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, i) => (
                        <div key={i} className={`${stat.dark ? 'bg-navy-900 text-white border-navy-800 shadow-lg' : 'bg-white border-slate-200 shadow-sm'} p-6 rounded-xl border`}>
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-2 rounded-lg ${stat.color}`}>
                                    <span className="material-symbols-outlined">{stat.icon}</span>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${stat.changeType === 'positive' ? 'text-green-500 bg-green-50' :
                                    stat.changeType === 'urgent' ? 'text-red-600 bg-red-50 animate-pulse' :
                                        stat.changeType === 'synced' ? 'text-blue-300 bg-white/10' :
                                            'text-slate-400 bg-slate-50'
                                    }`}>
                                    {stat.change}
                                </span>
                            </div>
                            <p className={`${stat.dark ? 'text-slate-400' : 'text-slate-500'} text-xs font-bold uppercase tracking-wider mb-1`}>{stat.label}</p>
                            <p className={`text-3xl font-black ${stat.changeType === 'urgent' ? 'text-red-600' : stat.dark ? 'text-white' : 'text-slate-900'} tracking-tight`}>{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Table Section */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Assigned Case Management</h3>
                            <p className="text-sm text-slate-500">Live feed of active investigations and field assignments.</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-slate-50">
                                <span className="material-symbols-outlined text-[18px]">filter_list</span>
                                Filters
                            </button>
                            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-slate-50">
                                <span className="material-symbols-outlined text-[18px]">download</span>
                                Export
                            </button>
                        </div>
                    </div>
                    {error ? (
                        <div className="p-12 text-center">
                            <span className="material-symbols-outlined text-red-400 text-5xl mb-4">error</span>
                            <p className="text-slate-500 font-medium">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="mt-4 px-6 py-2 bg-primary text-white rounded-lg font-bold text-sm"
                            >
                                Retry
                            </button>
                        </div>
                    ) : reports.length === 0 ? (
                        <div className="p-20 text-center">
                            <div className="size-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                <span className="material-symbols-outlined text-slate-300 text-3xl">inbox</span>
                            </div>
                            <h4 className="text-lg font-bold text-slate-900">No Cases Found</h4>
                            <p className="text-slate-400 text-sm max-w-xs mx-auto mt-2">There are currently no investigative reports available in the ledger.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50">
                                        <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Ref Number</th>
                                        <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Incident Type</th>
                                        <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Location / Sector</th>
                                        <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Timestamp</th>
                                        <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Verification</th>
                                        <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {reports.map((c) => {
                                        return (
                                            <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap font-bold text-sm text-slate-900">{c.referenceNumber || 'N/A'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-slate-900">{c.title}</div>
                                                    <div className="text-xs text-slate-400">{c.category}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <span className="material-symbols-outlined text-slate-400 text-base">location_on</span>
                                                        <div>
                                                            <div className="text-sm text-slate-700">{c.location}</div>
                                                            <div className="text-[10px] text-slate-400">Lat: {c.latitude}, Lng: {c.longitude}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-slate-700 font-medium">{new Date(c.created_at).toLocaleDateString()}</div>
                                                    <div className="text-[10px] text-slate-400 uppercase">Received {new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className={`flex items-center gap-1.5 ${c.status.toLowerCase() === 'investigating' || c.status.toLowerCase() === 'resolved' ? 'text-primary' : 'text-slate-400'}`}>
                                                        <span className="material-symbols-outlined text-[16px]">
                                                            {c.status.toLowerCase() === 'submitted' || c.status.toLowerCase() === 'pending' ? 'pending' : 'verified_user'}
                                                        </span>
                                                        <span className="text-xs font-bold uppercase tracking-tighter">{c.status}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex gap-2">
                                                        <Link href={`/officer/case-management/${c.id}`} className="bg-slate-100 text-slate-600 text-[10px] font-bold px-3 py-1.5 rounded uppercase hover:bg-slate-200 flex items-center">Details</Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
