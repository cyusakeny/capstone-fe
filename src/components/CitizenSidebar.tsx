"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SIDEBAR_LINKS = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard", href: "/citizen-dashboard" },
    { id: "reports", label: "My Reports", icon: "description", href: "/my-reports" },
    { id: "myprofile", label: "My Profile", icon: "person", href: "/citizen-dashboard/profile" },
    { id: "blockchain", label: "Blockchain", icon: "database", href: "/citizen-dashboard/blockchain" }
];

export default function CitizenSidebar() {
    const pathname = usePathname();
    const [user, setUser] = React.useState<{ name: string } | null>(null);

    React.useEffect(() => {
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

    return (
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
                {SIDEBAR_LINKS.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.id}
                            href={link.href}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                ? "bg-accent-blue text-white font-semibold"
                                : "text-slate-400 hover:text-white hover:bg-white/10"
                                }`}
                        >
                            <span
                                className="material-symbols-outlined"
                                style={{ fontVariationSettings: `'FILL' ${isActive ? 1 : 0}` }}
                            >
                                {link.icon}
                            </span>
                            <span>{link.label}</span>
                        </Link>
                    );
                })}

                <div className="pt-4 pb-2 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Support
                </div>
                <Link href="#" className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined">help_center</span>
                    <span>Help Center</span>
                </Link>
                <Link href="/citizen-dashboard/settings" className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined">settings</span>
                    <span>Settings</span>
                </Link>
            </nav>

            <div className="p-4 border-t border-white/10 bg-black/20">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full border-2 border-accent-blue shadow-sm overflow-hidden shrink-0">
                        <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 overflow-hidden text-left">
                        <p className="text-sm font-bold truncate">{displayName}</p>
                        <div className="flex items-center gap-1">
                            <span className="size-1.5 rounded-full bg-emerald-500"></span>
                            <span className="text-[10px] text-emerald-500 font-medium whitespace-nowrap">Biometric Verified</span>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            localStorage.removeItem('access_token');
                            localStorage.removeItem('user');
                            window.location.href = '/auth/citizen/login';
                        }}
                        className="text-slate-400 hover:text-white shrink-0"
                    >
                        <span className="material-symbols-outlined text-sm">logout</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}
