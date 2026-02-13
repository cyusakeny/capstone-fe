"use client";

import React from "react";
import Link from "next/link";
import OfficerHeaderV2 from "@/components/OfficerHeaderV2";

const STATS = [
    { label: "Total Assigned", value: "42", change: "+2 Today", changeType: "positive", icon: "assignment", color: "bg-blue-50 text-blue-600" },
    { label: "Pending Review", value: "12", change: "Stable", changeType: "neutral", icon: "pending_actions", color: "bg-amber-50 text-amber-600" },
    { label: "Urgent Cases", value: "03", change: "Critical", changeType: "urgent", icon: "priority_high", color: "bg-red-50 text-red-600" },
    { label: "Blockchain Nodes", value: "1,204", change: "Synced", changeType: "synced", icon: "verified", color: "bg-white/10 text-white", dark: true },
];

const CASES = [
    { id: "8821", priority: "High", type: "Grand Theft", category: "Class A Felony", location: "Downtown Sector", zone: "Zone 4 • Terminal 2", time: "12 mins ago", received: "14:24", status: "Chain Secured", statusIcon: "verified_user" },
    { id: "8819", priority: "Routine", type: "Public Disturbance", category: "Misdemeanor", location: "Eastwood Plaza", zone: "Zone 7 • East Gate", time: "45 mins ago", received: "13:51", status: "Hashed Record", statusIcon: "link" },
    { id: "8815", priority: "Routine", type: "Vehicle Infraction", category: "Traffic Violation", location: "Main St. @ 5th", zone: "Zone 1 • Intersection", time: "1h 12m ago", received: "13:24", status: "Chain Secured", statusIcon: "verified_user" },
];

export default function OfficerDashboardV2() {
    return (
        <div className="flex-1 flex flex-col min-h-screen">
            <OfficerHeaderV2 />

            <main className="p-8 max-w-7xl mx-auto w-full space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {STATS.map((stat, i) => (
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
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50">
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Priority</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Case ID</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Incident Type</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Location / Sector</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Timestamp</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Verification</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {CASES.map((c) => (
                                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide ${c.priority === 'High' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                                                }`}>
                                                {c.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-bold text-sm text-slate-900">#{c.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-slate-900">{c.type}</div>
                                            <div className="text-xs text-slate-400">{c.category}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-slate-400 text-base">location_on</span>
                                                <div>
                                                    <div className="text-sm text-slate-700">{c.location}</div>
                                                    <div className="text-[10px] text-slate-400">{c.zone}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-slate-700 font-medium">{c.time}</div>
                                            <div className="text-[10px] text-slate-400 uppercase">Received {c.received}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className={`flex items-center gap-1.5 ${c.status.includes('Secured') ? 'text-primary' : 'text-slate-400'}`}>
                                                <span className="material-symbols-outlined text-[16px]">{c.statusIcon}</span>
                                                <span className="text-xs font-bold uppercase tracking-tighter">{c.status}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex gap-2">
                                                <button className="bg-primary text-white text-[10px] font-bold px-3 py-1.5 rounded uppercase hover:bg-primary/90">Accept</button>
                                                <Link href={`/officer/case-management/${c.id}`} className="bg-slate-100 text-slate-600 text-[10px] font-bold px-3 py-1.5 rounded uppercase hover:bg-slate-200 flex items-center">Details</Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Lower Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Blockchain Events</h4>
                            <span className="size-2 bg-primary rounded-full animate-pulse"></span>
                        </div>
                        <div className="space-y-3">
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-4 transition-all hover:border-primary/30">
                                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-primary text-xl">lock</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-black text-primary uppercase tracking-tighter">System Update • 2m ago</p>
                                    <p className="text-xs font-medium text-slate-700 leading-snug">Chain-of-custody block generated for Case #8792</p>
                                </div>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-4">
                                <div className="size-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-green-600 text-xl">verified</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-black text-green-600 uppercase tracking-tighter">Identity Verified • 15m ago</p>
                                    <p className="text-xs font-medium text-slate-700 leading-snug">Suspect digital biometric ID validated on ledger.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 bg-navy-900 rounded-2xl overflow-hidden relative border border-white/10 shadow-xl min-h-[300px]">
                        <div className="absolute inset-0 opacity-20 pointer-events-none bg-center bg-no-repeat bg-cover" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB7bjG8FsvWQZGJFbTK9mp_pH3Viyoat9_9F3-ekZm1IbLETPcqywa8PFzG30zzbW1za0vnScEXw4Ci8j4G_G5MmNaK1JBzanTD3FT1jIwBkR0epqZe8KyiGdw294WtzBU6Wo92m5Z9w18mqbGInlJ0y-TdxiCnQPLX_WTktuCtsOI81e6EURR36hLU_vsvIyl4RnT3V52xmAyfpz7kbBqErg4hhdmh_6Vb6oY9yQQqEDtu1nxGN5tPmAQst-z30UEz501X8HeH5O0g")' }}></div>
                        <div className="relative p-8 h-full flex flex-col justify-end">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="size-3 bg-red-500 rounded-full animate-ping"></span>
                                <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Live Scene Transmission</p>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Sector 4 Deployment Map</h3>
                            <p className="text-slate-400 text-sm max-w-md mb-6">Real-time unit tracking and encrypted communication channel enabled. All data being hashed to investigation block #9902A.</p>
                            <div className="flex gap-3">
                                <button className="bg-white text-navy-950 px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-100 transition-colors">
                                    <span className="material-symbols-outlined">map</span>
                                    Full Screen Map
                                </button>
                                <button className="bg-white/10 text-white border border-white/20 px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-white/20 transition-colors">
                                    Radio Comms
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
