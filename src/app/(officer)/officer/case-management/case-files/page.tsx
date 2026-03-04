"use client";

import React, { useState, useEffect } from "react";
import OfficerHeaderV2 from "@/components/OfficerHeaderV2";
import { getReports, getOfficersByRole, assignOfficerToReport, createOfficer } from "@/lib/api";
import { Report } from "@/types/report";

const UNASSIGNED_CASES = [
    { id: "9901", type: "Cyber Intrusion", category: "Felony", location: "Global Data Center", time: "5 mins ago" },
    { id: "9902", type: "Financial Fraud", category: "White Collar", location: "Metropolitan Bank", time: "15 mins ago" },
    { id: "9903", type: "Property Damage", category: "Misdemeanor", location: "Central Park", time: "1h ago" },
];

const REGISTERED_OFFICERS = [
    { badge: "8824", name: "Sgt. Miller", department: "Patrol", role: "Admin" },
    { badge: "8825", name: "Ofc. Chen", department: "Cyber", role: "Officer" },
    { badge: "8826", name: "Det. Rodriguez", department: "Major Crimes", role: "Officer" },
];

export default function CaseFilesPage() {
    const [isAdmin] = useState(true); // Mock admin state
    const [officerName, setOfficerName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [badgeNumber, setBadgeNumber] = useState("");
    const [rank, setRank] = useState("Sergeant");
    const [department, setDepartment] = useState("Patrol");
    const [officerRole, setOfficerRole] = useState("OFFICER");

    const [reports, setReports] = useState<Report[]>([]);
    const [availableOfficers, setAvailableOfficers] = useState<{ id: string; name: string; badge_number: string; rank: string }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRegistering, setIsRegistering] = useState(false);
    const [isCommitting, setIsCommitting] = useState(false);
    const [assignments, setAssignments] = useState<Record<string, string>>({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [reportsData, officersData] = await Promise.all([
                    getReports(),
                    getOfficersByRole('OFFICER')
                ]);

                if (Array.isArray(reportsData)) {
                    // Filter for only submitted reports as requested by admin
                    const submittedOnly = reportsData.filter(r => r.status.toUpperCase() === 'SUBMITTED');
                    setReports(submittedOnly);
                }
                setAvailableOfficers(officersData);
            } catch (err) {
                console.error("Failed to fetch administrative data:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (!isAdmin) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center min-h-screen p-8 bg-slate-50">
                <div className="bg-white p-12 rounded-2xl shadow-xl border border-slate-200 text-center max-w-md">
                    <span className="material-symbols-outlined text-red-500 text-6xl mb-6">lock_person</span>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Restricted</h2>
                    <p className="text-slate-500 mb-8">This administrative module is only available to personnel with Level 4 clearance or higher.</p>
                    <button
                        onClick={() => window.location.href = '/officer/case-management'}
                        className="w-full bg-primary-navy text-white px-6 py-3 rounded-lg font-bold hover:bg-opacity-90 transition-all"
                    >
                        Return to Command Center
                    </button>
                </div>
            </div>
        );
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsRegistering(true);
        try {
            await createOfficer({
                name: officerName,
                email,
                password,
                badge_number: badgeNumber,
                department,
                rank,
                role: officerRole
            });
            alert("Personnel registered successfully. Credentials have been encrypted and stored.");

            // Clear form
            setOfficerName("");
            setEmail("");
            setPassword("");
            setBadgeNumber("");

            // Refresh officer list
            const officersData = await getOfficersByRole('OFFICER');
            setAvailableOfficers(officersData);
        } catch (err: any) {
            console.error("Registration failed:", err);
            alert("Registration failed: " + (err.message || "Unknown error"));
        } finally {
            setIsRegistering(false);
        }
    };

    const handleBulkCommit = async () => {
        const assignmentEntries = Object.entries(assignments);
        if (assignmentEntries.length === 0) {
            alert("No assignments to commit.");
            return;
        }

        setIsCommitting(true);
        try {
            await Promise.all(
                assignmentEntries.map(([reportId, officerId]) =>
                    assignOfficerToReport(reportId, officerId)
                )
            );
            alert("All assignments committed to the secure ledger.");

            // Refresh reports to remove assigned ones
            const reportsData = await getReports();
            if (Array.isArray(reportsData)) {
                setReports(reportsData.filter(r => r.status.toUpperCase() === 'SUBMITTED'));
            }
            setAssignments({});
        } catch (err) {
            console.error("Failed to commit assignments:", err);
            alert("An error occurred during bulk commitment.");
        } finally {
            setIsCommitting(false);
        }
    };

    const handleAssign = (caseId: string, officerId: string) => {
        setAssignments({ ...assignments, [caseId]: officerId });
    };

    if (isLoading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-slate-50">
                <div className="size-10 border-3 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
                <p className="text-slate-500 font-medium">Accessing Tactical Ledger...</p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col min-h-screen bg-slate-50/50">
            <OfficerHeaderV2 />

            <main className="p-8 max-w-7xl mx-auto w-full space-y-8">
                <div className="flex items-end justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Case & Officer Management</h1>
                        <p className="text-slate-500 mt-1">Administrative console for personnel registration and tactical assignment.</p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 font-bold text-xs uppercase tracking-wider">
                        <span className="material-symbols-outlined text-sm">security_update_good</span>
                        Admin Mode Active
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Register Officer Form */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">person_add</span>
                                Register Personnel
                            </h3>
                            <form onSubmit={handleRegister} className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={officerName}
                                        onChange={(e) => setOfficerName(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                                        placeholder="e.g. John Doe"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Email</label>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                                            placeholder="john@police.gov"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Badge Number</label>
                                        <input
                                            type="text"
                                            required
                                            value={badgeNumber}
                                            onChange={(e) => setBadgeNumber(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                                            placeholder="BADGE001"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Secure Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Rank</label>
                                        <select
                                            value={rank}
                                            onChange={(e) => setRank(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                                        >
                                            <option>Officer</option>
                                            <option>Detective</option>
                                            <option>Sergeant</option>
                                            <option>Inspector</option>
                                            <option>CIP</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Role</label>
                                        <select
                                            value={officerRole}
                                            onChange={(e) => setOfficerRole(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                                        >
                                            <option value="OFFICER">Officer</option>
                                            <option value="ADMIN">Admin</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Department</label>
                                    <select
                                        value={department}
                                        onChange={(e) => setDepartment(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                                    >
                                        <option>Patrol</option>
                                        <option>Cyber</option>
                                        <option>Major Crimes</option>
                                        <option>Forensics</option>
                                    </select>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isRegistering}
                                    className="w-full bg-primary text-white font-black uppercase text-xs tracking-widest py-4 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all mt-4 disabled:opacity-50"
                                >
                                    {isRegistering ? "Securing Credentials..." : "Register Personnel"}
                                </button>
                            </form>
                        </div>

                        <div className="bg-primary-navy p-6 rounded-2xl text-white">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-white/10 rounded-lg">
                                    <span className="material-symbols-outlined">info</span>
                                </div>
                                <h4 className="font-bold">Admin Notice</h4>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed">
                                Registered personnel will receive a secure biometric key via encrypted channel. All assignments are logged onto the immutable blockchain ledger.
                            </p>
                        </div>
                    </div>

                    {/* Case Assignment Table */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Case Assignment Matrix</h3>
                                    <p className="text-sm text-slate-500">Assign incoming investigations to available field officers.</p>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50">
                                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200">Incident</th>
                                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200">Location</th>
                                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200">Tactical Assignment</th>
                                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {reports.map((c) => (
                                            <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-5">
                                                    <div className="text-sm font-bold text-slate-900">{c.title}</div>
                                                    <div className="text-[11px] text-slate-400 mt-0.5">#{c.referenceNumber || c.id.slice(0, 8)} • {c.category}</div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="text-xs text-slate-600 font-medium">{c.location}</div>
                                                    <div className="text-[10px] text-slate-400 italic">Received {new Date(c.created_at).toLocaleDateString()}</div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <select
                                                        className="w-full bg-slate-100 border-none rounded-lg px-3 py-2 text-xs font-bold text-slate-700 focus:ring-1 focus:ring-primary outline-none"
                                                        value={assignments[c.id] || ""}
                                                        onChange={(e) => handleAssign(c.id, e.target.value)}
                                                    >
                                                        <option value="">Unassigned</option>
                                                        {availableOfficers.map(o => (
                                                            <option key={o.id} value={o.id}>{o.rank} {o.name} (#{o.badge_number})</option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="px-6 py-5">
                                                    {assignments[c.id] ? (
                                                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-green-100 text-green-700 text-[10px] font-bold uppercase">
                                                            <span className="size-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                                            Assigned
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-red-100 text-red-600 text-[10px] font-bold uppercase">
                                                            <span className="size-1.5 bg-red-500 rounded-full"></span>
                                                            Pending
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                                <button
                                    onClick={handleBulkCommit}
                                    disabled={isCommitting || Object.keys(assignments).length === 0}
                                    className="px-6 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-slate-800 transition-all disabled:opacity-50 disabled:grayscale"
                                >
                                    {isCommitting ? "Syncing Ledger..." : "Commit Assignments to Chain"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
