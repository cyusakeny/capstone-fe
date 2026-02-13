"use client";

import React, { useState } from "react";
import Link from "next/link";

interface Report {
    id: string;
    type: string;
    date: string;
    time: string;
    hash: string;
    status: "Verified" | "Processing" | "Archived";
    icon: string;
}

const INITIAL_REPORTS: Report[] = [
    {
        id: "#NY-7729-X",
        type: "Vehicle Theft",
        date: "Oct 24, 2023",
        time: "08:12 AM",
        hash: "0x4a...f39e",
        status: "Verified",
        icon: "directions_car",
    },
    {
        id: "#NY-8812-B",
        type: "Attempted Fraud",
        date: "Oct 23, 2023",
        time: "04:30 PM",
        hash: "0x7c...88a2",
        status: "Processing",
        icon: "warning",
    },
    {
        id: "#NY-9021-A",
        type: "Property Damage",
        date: "Oct 20, 2023",
        time: "11:15 AM",
        hash: "0x1b...cc43",
        status: "Archived",
        icon: "home",
    },
];

const SIDEBAR_LINKS = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard", href: "/citizen-dashboard" },
    { id: "reports", label: "My Reports", icon: "description", href: "/my-reports" },
    { id: "map", label: "Local Map", icon: "explore", href: "#" },
    { id: "verifications", label: "Verifications", icon: "verified_user", href: "#" },
    { id: "alerts", label: "Alerts", icon: "notifications", href: "#" },
];

export default function CitizenDashboard() {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [reports] = useState<Report[]>(INITIAL_REPORTS);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredReports = reports.filter((report) =>
        report.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex min-h-screen bg-white">
            {/* Sidebar */}
            <aside className="w-64 bg-sidebar-bg text-white flex flex-col fixed inset-y-0 left-0 z-50">
                <div className="p-6 border-b border-white/10 flex items-center gap-3">
                    <div className="bg-accent-blue p-1.5 rounded-lg">
                        <span className="material-symbols-outlined text-white text-2xl">shield_person</span>
                    </div>
                    <div>
                        <h1 className="font-bold text-lg leading-none tracking-tight">CitizenLink</h1>
                        <p className="text-[10px] text-accent-blue font-bold uppercase tracking-widest mt-1">
                            Secure Portal
                        </p>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
                    {SIDEBAR_LINKS.map((link) => (
                        <Link
                            key={link.id}
                            href={link.href}
                            onClick={() => setActiveTab(link.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === link.id
                                ? "bg-accent-blue text-white font-semibold"
                                : "text-slate-400 hover:text-white hover:bg-white/10"
                                }`}
                        >
                            <span
                                className="material-symbols-outlined"
                                style={{ fontVariationSettings: `'FILL' ${activeTab === link.id ? 1 : 0}` }}
                            >
                                {link.icon}
                            </span>
                            <span>{link.label}</span>
                        </Link>
                    ))}

                    <div className="pt-4 pb-2 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        Support
                    </div>
                    <Link href="#" className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                        <span className="material-symbols-outlined">help_center</span>
                        <span>Help Center</span>
                    </Link>
                    <Link href="#" className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                        <span className="material-symbols-outlined">settings</span>
                        <span>Settings</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-white/10 bg-black/20">
                    <div className="flex items-center gap-3">
                        <div
                            className="size-10 rounded-full border-2 border-accent-blue bg-cover bg-center shrink-0"
                            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDUU-E_7PjIXwtdQm5tf4vW95JEjs34Qc2Gjo3DVmzIVvDFP-IDJ4hOGDUI-lsc-5uZLIR1pL7HufOTxunNWJqfrR4mK3XyfFQYEaY7_IlA9CFfYyoBTEEIQ7B-xcBrZnL5rYILZDWQMwZoNBROrhjIdP8aEov0dNcS4AV14lNjlR9K1AyNWp1z4uHhFHQpeI_TVtc16pj7o9chmqGYDScx8cnnBFjl-M9MYs3QVisdaiVf5lwvmUW4egHhar8oL0jUytVBe5I-0m2k")' }}
                        />
                        <div className="flex-1 overflow-hidden text-left">
                            <p className="text-sm font-bold truncate">James Detective</p>
                            <div className="flex items-center gap-1">
                                <span className="size-1.5 rounded-full bg-emerald-500"></span>
                                <span className="text-[10px] text-emerald-500 font-medium whitespace-nowrap">Biometric Verified</span>
                            </div>
                        </div>
                        <button className="text-slate-400 hover:text-white shrink-0">
                            <span className="material-symbols-outlined text-sm">logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 bg-slate-50/50 min-h-screen">
                <header className="bg-white border-b border-border-gray h-16 sticky top-0 z-40 flex items-center justify-between px-8">
                    <div className="flex items-center gap-2">
                        <span className="text-slate-500 text-sm font-medium capitalize">{activeTab}</span>
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
                            <span className="text-xs font-bold text-slate-500">Last login: Today, 08:42 AM</span>
                        </div>
                    </div>
                </header>

                <div className="p-8 max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-primary-navy tracking-tight">Welcome back, James</h2>
                        <p className="text-slate-500">Everything looks secure. You have 2 reports pending verification.</p>
                    </div>

                    {/* Action Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-xl border border-border-gray shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-accent-blue/10 p-3 rounded-lg text-accent-blue group-hover:bg-accent-blue group-hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-2xl">report_gmailerrorred</span>
                                </div>
                                <span className="material-symbols-outlined text-slate-300">arrow_forward</span>
                            </div>
                            <h3 className="font-bold text-primary-navy mb-1">New Report</h3>
                            <p className="text-sm text-slate-500">File a secure incident report with blockchain verification.</p>
                        </div>

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
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Reports</p>
                            <p className="text-2xl font-bold text-primary-navy">04</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-border-gray border-l-4 border-l-emerald-500">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Verified Cases</p>
                            <p className="text-2xl font-bold text-emerald-600">02</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-border-gray border-l-4 border-l-amber-500">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Pending Review</p>
                            <p className="text-2xl font-bold text-amber-600">01</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-border-gray border-l-4 border-l-slate-400">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Archived</p>
                            <p className="text-2xl font-bold text-slate-600">01</p>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-xl border border-border-gray shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-border-gray flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h3 className="text-lg font-bold text-primary-navy">Recent Reports</h3>
                                <p className="text-sm text-slate-500">A detailed view of your submitted reports and their current status.</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="px-4 py-2 border border-border-gray rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors">Filter</button>
                                <button className="px-4 py-2 bg-primary-navy text-white rounded-lg text-sm font-semibold hover:bg-primary-navy/90 transition-colors">Export Data</button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                        <th className="px-6 py-4">Case ID</th>
                                        <th className="px-6 py-4">Report Type</th>
                                        <th className="px-6 py-4">Date & Time</th>
                                        <th className="px-6 py-4">Blockchain Hash</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-gray text-slate-700">
                                    {filteredReports.map((report) => (
                                        <tr key={report.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className="font-bold">{report.id}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-slate-400 text-lg">{report.icon}</span>
                                                    <span className="text-sm font-medium">{report.type}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm">
                                                    <p className="font-medium text-slate-900">{report.date}</p>
                                                    <p className="text-slate-400 text-xs">{report.time}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded w-fit">
                                                    <span className="material-symbols-outlined text-sm">link</span>
                                                    {report.hash}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${report.status === "Verified" ? "bg-emerald-100 text-emerald-700" :
                                                    report.status === "Processing" ? "bg-blue-100 text-blue-700" :
                                                        "bg-slate-100 text-slate-600"
                                                    }`}>
                                                    {report.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-accent-blue font-bold text-xs hover:underline">View Details</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredReports.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-8 text-center text-slate-500 text-sm">
                                                No reports found matching your search.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-4 border-t border-border-gray bg-slate-50 flex items-center justify-between">
                            <p className="text-xs text-slate-500 font-medium">
                                Showing {filteredReports.length} of {reports.length} recent reports
                            </p>
                            <div className="flex gap-2">
                                <button className="size-8 flex items-center justify-center rounded border border-border-gray bg-white text-slate-400 disabled:opacity-50 cursor-not-allowed">
                                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                                </button>
                                <button className="size-8 flex items-center justify-center rounded border border-border-gray bg-white text-slate-600 hover:bg-slate-50 transition-colors">
                                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <footer className="p-8 pt-0 max-w-7xl mx-auto">
                    <div className="bg-primary-navy/5 border border-primary-navy/10 rounded-xl p-4 flex items-center gap-4">
                        <div className="size-10 rounded-lg bg-primary-navy flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-white">verified_user</span>
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-bold text-primary-navy">Military-Grade Security Protocol</h4>
                            <p className="text-xs text-slate-600 mt-0.5">
                                All transmissions are encrypted. Evidence hashes are immutable and stored on the blockchain ledger for legal integrity.
                            </p>
                        </div>
                        <div className="text-right hidden sm:block">
                            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block mb-1">Status: Active</span>
                            <div className="flex gap-1 justify-end">
                                <span className="size-1 bg-emerald-500 rounded-full"></span>
                                <span className="size-1 bg-emerald-500 rounded-full"></span>
                                <span className="size-1 bg-emerald-500 rounded-full"></span>
                            </div>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
}
