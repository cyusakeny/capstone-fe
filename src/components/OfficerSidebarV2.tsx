"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard", href: "/officer/case-management" },
    { id: "personnel", label: "Personnel Management", icon: "folder_shared", href: "/officer/case-management/case-files", adminOnly: true },
    { id: "logs", label: "My Logs", icon: "link", href: "/officer/logs" },
    { id: "reports", label: "Intelligence Reports", icon: "description", href: "/officer/reports" },
    { id: "profile", label: "My Profile", icon: "account_circle", href: "/officer/profile" },
];

export default function OfficerSidebarV2() {
    const pathname = usePathname();
    const [user, setUser] = React.useState<{ name: string; role: string; type?: string } | null>(null);

    React.useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse officer from localStorage", e);
            }
        }
    }, []);

    const displayName = user?.name || "Officer Terminal";
    const userRole = user?.role || "OFFICER";
    const isAdmin = userRole === 'ADMIN';

    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=2563eb&color=fff&bold=true`;

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        window.location.href = '/auth/officer/login';
    };

    return (
        <aside className="w-64 bg-primary-navy text-slate-300 flex-shrink-0 flex flex-col hidden lg:flex h-screen fixed left-0 top-0">
            <div className="p-6">
                <div className="flex items-center gap-3 mb-10">
                    <div className="size-8 bg-primary rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-xl">shield</span>
                    </div>
                    <h1 className="font-bold text-white tracking-tight text-lg">Officer Portal</h1>
                </div>

                <nav className="space-y-1">
                    {NAV_LINKS.map((link) => {
                        // Skip rendering if it's admin-only and user is not admin
                        if (link.adminOnly && !isAdmin) return null;

                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.id}
                                href={link.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-r-md transition-colors ${isActive
                                    ? "text-white bg-white/10 border-l-3 border-primary"
                                    : "hover:bg-white/5"
                                    }`}
                            >
                                <span className={`material-symbols-outlined text-[22px]`}>
                                    {link.icon}
                                </span>
                                <span className={`text-sm ${isActive ? "font-semibold" : "font-medium"}`}>
                                    {link.label}
                                </span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="mt-auto p-6">
                <div className="bg-navy-900 rounded-xl p-4 border border-white/10">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Duty Status</p>
                    <div className="flex items-center gap-2">
                        <div className="size-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-bold text-white">Active Patrol</span>
                    </div>
                </div>

                <div className="mt-6 flex items-center gap-3 px-2">
                    <div className="size-10 rounded-full border border-white/20 shadow-sm overflow-hidden shrink-0">
                        <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-xs font-bold text-white truncate">{displayName}</p>
                        <p className="text-[10px] text-slate-500 font-medium truncate">{userRole}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="ml-auto text-slate-500 hover:text-white transition-colors"
                        title="Sign Out"
                    >
                        <span className="material-symbols-outlined text-xl">logout</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}
