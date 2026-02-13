"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard", href: "/officer/case-management" },
    { id: "cases", label: "Case Files", icon: "folder_open", href: "#" },
    { id: "blockchain", label: "Blockchain Ledger", icon: "link", href: "#" },
    { id: "map", label: "Jurisdiction Map", icon: "map", href: "#" },
    { id: "reports", label: "Intelligence Reports", icon: "bar_chart", href: "#" },
];

export default function OfficerSidebarV2() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-primary-navy text-slate-300 flex-shrink-0 flex flex-col hidden lg:flex h-screen fixed left-0 top-0">
            <div className="p-6">
                <div className="flex items-center gap-3 mb-10">
                    <div className="size-8 bg-primary rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-xl">shield</span>
                    </div>
                    <h1 className="font-bold text-white tracking-tight text-lg">CaseGuard AI</h1>
                </div>

                <nav className="space-y-1">
                    {NAV_LINKS.map((link) => {
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
                    <div
                        className="size-10 rounded-full bg-cover bg-center border border-white/20"
                        style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDVfiXIl3wwAH-_ThHy9yLAypQatdq1wfpiLbZMWuFXObz5ckVqlcOcghtdlp4T_TWwbnXLxcCihVvtx2IxEBEb_YaXbOOYaK1d_fCjHBljQZXioFfE8d-CKYn0VJflxTJGm3dYsStx9Qp7TuZ7qwBiH9QK9AG4uEsD0B54EQl2PCud3QqClTwxcEXS0wdKpye7-zHnE_3VfF3l_mNFs8Bm0kMpFRFpJRXUg8bOudrX8mNzIA7iBb8A2LrRRxNOd8C6oDT6WlbWQxDl")' }}
                    ></div>
                    <div className="overflow-hidden">
                        <p className="text-xs font-bold text-white truncate">Sgt. Miller</p>
                        <p className="text-[10px] text-slate-500 font-medium">Badge #8824</p>
                    </div>
                    <button className="ml-auto text-slate-500 hover:text-white">
                        <span className="material-symbols-outlined text-xl">settings</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}
