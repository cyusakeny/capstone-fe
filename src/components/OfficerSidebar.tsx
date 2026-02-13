"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
    { id: "cases", label: "Cases", icon: "folder_open", href: "/officer/case-management" },
    { id: "analytics", label: "Analytics", icon: "analytics", href: "#" },
    { id: "network", label: "Network Nodes", icon: "hub", href: "#" },
    { id: "audit", label: "Global Audit", icon: "history", href: "#" },
];

export default function OfficerSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-primary text-white flex flex-col shrink-0 h-screen fixed left-0 top-0">
            <div className="p-6 flex items-center gap-3">
                <div className="bg-white/10 p-2 rounded-lg">
                    <span className="material-symbols-outlined text-white">shield_lock</span>
                </div>
                <span className="font-bold text-lg tracking-tight">CaseGuard</span>
            </div>

            <nav className="flex-1 px-4 space-y-1 mt-4">
                {NAV_LINKS.map((link) => {
                    const isActive = pathname.startsWith(link.href) && link.href !== "#";
                    return (
                        <Link
                            key={link.id}
                            href={link.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"
                                }`}
                        >
                            <span className="material-symbols-outlined">{link.icon}</span>
                            <span className="font-medium">{link.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 mt-auto border-t border-white/10">
                <div className="flex items-center gap-3 px-4 py-3">
                    <div className="h-8 w-8 rounded-full bg-slate-600 flex items-center justify-center text-xs font-bold uppercase">
                        JM
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold whitespace-nowrap">Off. Martinez</span>
                        <span className="text-[10px] text-slate-400 tracking-wider">ID: #4492</span>
                    </div>
                    <span className="material-symbols-outlined ml-auto text-slate-400 text-sm cursor-pointer hover:text-white transition-colors">
                        settings
                    </span>
                </div>
            </div>
        </aside>
    );
}
