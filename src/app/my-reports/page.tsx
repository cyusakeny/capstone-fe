"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Report } from "@/types/report";
import { apiFetch } from "@/lib/api";

const STATUS_FILTERS = ["All", "Pending", "Investigating", "Resolved"] as const;

export default function MyReports() {
    const [reports, setReports] = useState<Report[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState<string>("All");
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

    const displayName = user?.name || "Verified Citizen";
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=020617&color=fff&bold=true`;

    useEffect(() => {
        const fetchReports = async () => {
            try {
                setIsLoading(true);
                const data = await apiFetch('/reports');
                setReports(Array.isArray(data) ? data : []);
            } catch (err: any) {
                console.error("Failed to fetch reports:", err);
                setError(err.message || "Failed to load reports");
            } finally {
                setIsLoading(false);
            }
        };

        fetchReports();
    }, []);

    const filteredReports = reports.filter((report: Report) => {
        const matchesSearch =
            (report.category?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
            (report.title?.toLowerCase() || "").includes(searchQuery.toLowerCase());

        const statusLower = report.status?.toLowerCase() || "";
        const filterLower = activeFilter.toLowerCase();

        if (activeFilter === "All") return matchesSearch;
        if (activeFilter === "Pending") return matchesSearch && (statusLower === "pending" || statusLower === "submitted");
        return matchesSearch && statusLower === filterLower;
    });

    return (
        <div className="text-slate-900 min-h-screen flex flex-col bg-background-light">
            <header className="bg-navy-header text-white sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-accent-blue text-3xl">shield_person</span>
                            <h1 className="text-xl font-bold tracking-tight">CitizenPortal</h1>
                        </Link>
                        <nav className="hidden md:flex items-center gap-6">
                            <Link href="/citizen-dashboard" className="text-slate-300 hover:text-white transition-colors font-medium">Dashboard</Link>
                            <Link href="/my-reports" className="text-white border-b-2 border-accent-blue pb-1 font-semibold">My Reports</Link>
                            <Link href="#" className="text-slate-300 hover:text-white transition-colors font-medium">Safety Map</Link>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="material-symbols-outlined text-slate-300 hover:text-white transition-colors">notifications</button>
                        <div className="h-8 w-[1px] bg-slate-700 mx-2"></div>
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block text-white">
                                <p className="text-sm font-semibold leading-none">{displayName}</p>
                                <p className="text-[11px] text-slate-400">Verified Citizen</p>
                            </div>
                            <div className="size-9 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden border border-slate-600 shadow-sm">
                                <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Submitted Reports</h2>
                        <p className="text-slate-500 mt-1">Manage and track your filed reports secured by blockchain verification.</p>
                    </div>
                    <Link href="/submit-report" className="bg-accent-blue hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg shadow-accent-blue/20">
                        <span className="material-symbols-outlined text-xl">add_circle</span>
                        File New Report
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-5 rounded-xl border border-border-light flex items-center gap-4 shadow-sm">
                        <div className="size-12 rounded-lg bg-orange-50 flex items-center justify-center">
                            <span className="material-symbols-outlined text-orange-600">pending_actions</span>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Active Investigations</p>
                            <p className="text-2xl font-bold text-slate-900">03</p>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-border-light flex items-center gap-4 shadow-sm">
                        <div className="size-12 rounded-lg bg-emerald-50 flex items-center justify-center">
                            <span className="material-symbols-outlined text-emerald-600">task_alt</span>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Resolved Cases</p>
                            <p className="text-2xl font-bold text-slate-900">12</p>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-border-light flex items-center gap-4 shadow-sm">
                        <div className="size-12 rounded-lg bg-blue-50 flex items-center justify-center">
                            <span className="material-symbols-outlined text-accent-blue text-fill-1">verified</span>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Verified Records</p>
                            <p className="text-2xl font-bold text-slate-900">15</p>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 flex items-center gap-3">
                        <span className="material-symbols-outlined">error</span>
                        <p className="font-medium">{error}</p>
                    </div>
                )}

                <div className="bg-white rounded-xl border border-border-light overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-border-light bg-slate-50/50 flex flex-col lg:flex-row gap-4 justify-between items-center">
                        <div className="flex items-center gap-2 w-full lg:w-auto">
                            <div className="relative w-full lg:w-72">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                                <input
                                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-accent-blue focus:border-transparent outline-none transition-all"
                                    placeholder="Search reports..."
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto no-scrollbar py-1">
                            <span className="text-sm font-medium text-slate-500 whitespace-nowrap">Filter:</span>
                            <div className="flex gap-2">
                                {STATUS_FILTERS.map((filter) => (
                                    <button
                                        key={filter}
                                        onClick={() => setActiveFilter(filter)}
                                        className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all whitespace-nowrap ${activeFilter === filter
                                            ? "bg-slate-900 text-white border-slate-900 shadow-md"
                                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                            }`}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-border-light">
                                    <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Reference #</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Title</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Category</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-light">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="size-8 border-4 border-accent-blue/30 border-t-accent-blue rounded-full animate-spin"></div>
                                                <p className="text-sm text-slate-500 font-medium">Loading reports...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredReports.length > 0 ? (
                                    filteredReports.map((report) => (
                                        <tr key={report.id} className="hover:bg-slate-50 transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-primary-navy">{report.referenceNumber || report.id.slice(0, 8)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">{report.title}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{report.category}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{new Date(report.incident_date).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit ${['resolved', 'closed'].includes(report.status.toLowerCase()) ? "bg-emerald-100 text-emerald-700" :
                                                    ['investigating', 'assigned'].includes(report.status.toLowerCase()) ? "bg-blue-100 text-blue-700" :
                                                        "bg-slate-100 text-slate-600"
                                                    }`}>
                                                    <span className={`size-2 rounded-full ${['resolved', 'closed'].includes(report.status.toLowerCase()) ? "bg-emerald-600" :
                                                        ['investigating', 'assigned'].includes(report.status.toLowerCase()) ? "bg-blue-600" :
                                                            "bg-slate-400"
                                                        }`}></span>
                                                    {report.status}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <Link href={`/case-management/${report.id}`} className="text-slate-400 hover:text-accent-blue transition-colors">
                                                    <span className="material-symbols-outlined">visibility</span>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <span className="material-symbols-outlined text-slate-300 text-4xl">inventory_2</span>
                                                <p className="text-sm text-slate-500 italic">No reports found matching your criteria.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="px-6 py-4 border-t border-border-light bg-slate-50/50 flex items-center justify-between">
                        <p className="text-sm text-slate-500">
                            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredReports.length}</span> of <span className="font-medium">{reports.length}</span> reports
                        </p>
                        <div className="flex gap-2">
                            <button className="px-3 py-1.5 border border-slate-200 rounded bg-white text-slate-400 cursor-not-allowed text-sm" disabled>Previous</button>
                            <button className="px-3 py-1.5 border border-slate-200 rounded bg-white text-slate-600 hover:bg-slate-50 text-sm transition-colors">Next</button>
                        </div>
                    </div>
                </div>

                <div className="mt-8 p-4 rounded-xl bg-blue-50 border border-blue-100 flex items-start gap-3">
                    <div className="bg-accent-blue text-white p-2 rounded-lg shrink-0">
                        <span className="material-symbols-outlined">lock_reset</span>
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-900">End-to-End Immutable Ledger</h4>
                        <p className="text-xs text-slate-600 mt-0.5">Every action on your reports is timestamped and hashed onto the public ledger. You can verify the integrity of the investigation process by clicking the verification link next to each report.</p>
                    </div>
                </div>
            </main>

            <footer className="bg-white border-t border-border-light py-8">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-slate-500">© 2026 Digital Citizen Safety Initiative. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <a className="text-sm text-slate-500 hover:text-accent-blue transition-colors" href="#">Privacy Policy</a>
                        <a className="text-sm text-slate-500 hover:text-accent-blue transition-colors" href="#">Terms of Service</a>
                        <a className="text-sm text-slate-500 hover:text-accent-blue transition-colors" href="#">Blockchain Transparency</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
