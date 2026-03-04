"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CitizenSidebar from "@/components/CitizenSidebar";
import { getReports } from "@/lib/api";
import { Report } from "@/types/report";

export default function CitizenDashboard() {
    const pathname = usePathname();
    const [reports, setReports] = useState<Report[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [user, setUser] = useState<{ name: string } | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user from localStorage", e);
            }
        }
    }, []);

    const displayName = user?.name ? user.name.split(' ')[0] : "Citizen";

    useEffect(() => {
        const fetchLatestReports = async () => {
            try {
                setIsLoading(true);
                const data = await getReports();
                if (Array.isArray(data)) {
                    // Sort by created_at descending and take latest 3
                    const latest = data
                        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                        .slice(0, 3);
                    setReports(latest);
                }
            } catch (err: any) {
                console.error("Failed to fetch dashboard reports:", err);
                setError(err.message || "Failed to load recent activity");
            } finally {
                setIsLoading(false);
            }
        };

        fetchLatestReports();
    }, []);

    const filteredReports = reports.filter((report) =>
        (report.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (report.category || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getIcon = (category: string) => {
        const cat = category.toLowerCase();
        if (cat.includes('theft') || cat.includes('robbery')) return 'directions_car';
        if (cat.includes('fraud')) return 'warning';
        if (cat.includes('property') || cat.includes('vandalism')) return 'home';
        return 'description';
    };

    return (
        <div className="flex min-h-screen bg-white">
            {/* Sidebar */}
            <CitizenSidebar />

            {/* Main Content */}
            <main className="flex-1 ml-64 bg-slate-50/50 min-h-screen">
                <header className="bg-white border-b border-border-gray h-16 sticky top-0 z-40 flex items-center justify-between px-8">
                    <div className="flex items-center gap-2">
                        <span className="text-slate-500 text-sm font-medium capitalize">{pathname.split('/').pop() || 'Dashboard'}</span>
                        <span className="material-symbols-outlined text-slate-400 text-sm">chevron_right</span>
                        <span className="text-primary-navy font-bold text-sm">Overview</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative flex items-center">
                            <span className="material-symbols-outlined text-slate-400 absolute left-2 pointer-events-none">search</span>
                            <input
                                type="text"
                                placeholder="Search reports..."
                                className="pl-9 pr-4 py-1.5 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-accent-blue outline-none w-64 transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button className="relative flex items-center justify-center">
                            <span className="material-symbols-outlined text-slate-400">notifications</span>
                            <span className="absolute -top-0.5 -right-0.5 size-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="h-8 w-px bg-border-gray"></div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-500">Last login: Today, {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    </div>
                </header>

                <div className="p-8 max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-primary-navy tracking-tight">Welcome back, {displayName}</h2>
                        <p className="text-slate-500">Everything looks secure. You have {reports.filter(r => r.status.toLowerCase() === 'submitted' || r.status.toLowerCase() === 'pending').length} reports pending verification.</p>
                    </div>

                    {/* Action Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Link href="/submit-report" className="bg-white p-6 rounded-xl border border-border-gray shadow-sm hover:shadow-md transition-shadow group cursor-pointer block">
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-accent-blue/10 p-3 rounded-lg text-accent-blue group-hover:bg-accent-blue group-hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-2xl">report_gmailerrorred</span>
                                </div>
                                <span className="material-symbols-outlined text-slate-300">arrow_forward</span>
                            </div>
                            <h3 className="font-bold text-primary-navy mb-1">New Report</h3>
                            <p className="text-sm text-slate-500">File a secure incident report with blockchain verification.</p>
                        </Link>

                        <div className="bg-white p-6 rounded-xl border border-border-gray shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-emerald-500/10 p-3 rounded-lg text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-2xl">verified</span>
                                </div>
                                <span className="material-symbols-outlined text-slate-300">arrow_forward</span>
                            </div>
                            <h3 className="font-bold text-primary-navy mb-1">Verify Evidence</h3>
                            <p className="text-sm text-slate-500">Upload and timestamp digital evidence on the public ledger.</p>
                        </div>

                        <div className="bg-primary-navy p-6 rounded-xl shadow-lg shadow-primary-navy/20 text-white cursor-pointer hover:bg-primary-navy/95 transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-white/10 p-3 rounded-lg">
                                    <span className="material-symbols-outlined text-2xl">support_agent</span>
                                </div>
                                <span className="material-symbols-outlined text-white/40">arrow_forward</span>
                            </div>
                            <h3 className="font-bold mb-1">Emergency Services</h3>
                            <p className="text-sm text-white/70">Connect with immediate assistance in your local jurisdiction.</p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white p-4 rounded-xl border border-border-gray border-l-4 border-l-accent-blue">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Recent Activity</p>
                            <p className="text-2xl font-bold text-primary-navy">{reports.length.toString().padStart(2, '0')}</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-border-gray border-l-4 border-l-emerald-500">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Verified Cases</p>
                            <p className="text-2xl font-bold text-emerald-600">{reports.filter(r => ['resolved', 'verified', 'closed'].includes(r.status.toLowerCase())).length.toString().padStart(2, '0')}</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-border-gray border-l-4 border-l-amber-500">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Pending Review</p>
                            <p className="text-2xl font-bold text-amber-600">{reports.filter(r => ['submitted', 'pending', 'open'].includes(r.status.toLowerCase())).length.toString().padStart(2, '0')}</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-border-gray border-l-4 border-l-slate-400">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Records</p>
                            <p className="text-2xl font-bold text-slate-600">--</p>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-xl border border-border-gray shadow-sm overflow-hidden min-h-[400px]">
                        <div className="p-6 border-b border-border-gray flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h3 className="text-lg font-bold text-primary-navy">Latest Investigative Reports</h3>
                                <p className="text-sm text-slate-500">Displaying your 3 most recent secure filings.</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Link href="/my-reports" className="px-4 py-2 border border-border-gray rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors">View All Reports</Link>
                                <button className="px-4 py-2 bg-primary-navy text-white rounded-lg text-sm font-semibold hover:bg-primary-navy/90 transition-colors">Export Ledger</button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                        <th className="px-6 py-4">Reference #</th>
                                        <th className="px-6 py-4">Report Details</th>
                                        <th className="px-6 py-4 text-center">Date & Time</th>
                                        <th className="px-6 py-4">Blockchain Hash</th>
                                        <th className="px-6 py-4 text-center">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-gray text-slate-700">
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-20 text-center">
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="size-8 border-3 border-accent-blue/20 border-t-accent-blue rounded-full animate-spin"></div>
                                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Polling Secure Node...</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : error ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-20 text-center text-red-500">
                                                <span className="material-symbols-outlined text-4xl mb-2">error</span>
                                                <p className="text-sm font-medium">{error}</p>
                                            </td>
                                        </tr>
                                    ) : filteredReports.length > 0 ? (
                                        filteredReports.map((report) => (
                                            <tr key={report.id} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <span className="text-xs font-mono font-bold text-primary-navy bg-slate-100 px-2 py-1 rounded">
                                                        {report.referenceNumber || report.id.slice(0, 8)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white transition-colors">
                                                            <span className="material-symbols-outlined text-lg">{getIcon(report.category || '')}</span>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-900 line-clamp-1">{report.title}</p>
                                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{report.category}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="text-sm">
                                                        <p className="font-bold text-slate-700">{new Date(report.incident_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                                        <p className="text-slate-400 text-[10px] font-bold">{report.incident_time}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 bg-slate-50 border border-slate-100 px-2 py-1.5 rounded-lg w-fit group-hover:bg-white transition-colors">
                                                        <span className="material-symbols-outlined text-xs text-emerald-500">verified</span>
                                                        {report.reporterHash ? `${report.reporterHash.slice(0, 6)}...${report.reporterHash.slice(-4)}` : "Computing..."}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm border ${['resolved', 'closed', 'verified'].includes(report.status.toLowerCase()) ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                                                        ['investigating', 'assigned'].includes(report.status.toLowerCase()) ? "bg-blue-50 text-blue-700 border-blue-100" :
                                                            "bg-slate-50 text-slate-500 border-slate-100"
                                                        }`}>
                                                        {report.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <Link href={`/case-management/${report.id}`} className="inline-flex items-center justify-center size-8 rounded-lg hover:bg-white hover:text-accent-blue transition-all border border-transparent hover:border-slate-200">
                                                        <span className="material-symbols-outlined text-lg">visibility</span>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-20 text-center">
                                                <div className="flex flex-col items-center gap-2 opacity-40">
                                                    <span className="material-symbols-outlined text-5xl">inventory_2</span>
                                                    <p className="text-sm font-bold uppercase tracking-[0.2em]">No Digital Filings Found</p>
                                                    <p className="text-xs">Your secure reports will appear here once submitted.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-4 border-t border-border-gray bg-slate-50 flex items-center justify-between">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                Secured Integrity Protocol v1.4.2
                            </p>
                            <Link href="/my-reports" className="text-xs font-bold text-accent-blue hover:underline flex items-center gap-1">
                                Access Full Archives
                                <span className="material-symbols-outlined text-sm">arrow_right_alt</span>
                            </Link>
                        </div>
                    </div>
                </div>

                <footer className="p-8 pt-0 max-w-7xl mx-auto">
                    <div className="bg-primary-navy/5 border border-primary-navy/10 rounded-xl p-4 flex items-center gap-4">
                        <div className="size-10 rounded-lg bg-primary-navy flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-white">verified_user</span>
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-bold text-primary-navy uppercase tracking-tight">Military-Grade Security Protocol</h4>
                            <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                                All transmissions are end-to-end encrypted. Evidence hashes are immutable and stored on the decentralized public ledger for forensic legal integrity.
                            </p>
                        </div>
                        <div className="text-right hidden lg:block">
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block mb-1.5 flex items-center gap-1.5 justify-end">
                                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                Ledger Node Active
                            </span>
                            <div className="flex gap-1 justify-end opacity-20">
                                <span className="size-1 bg-primary-navy rounded-full"></span>
                                <span className="size-1 bg-primary-navy rounded-full"></span>
                                <span className="size-1 bg-primary-navy rounded-full"></span>
                            </div>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
}
