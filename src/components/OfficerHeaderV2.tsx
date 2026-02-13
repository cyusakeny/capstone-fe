"use client";

import React from "react";

export default function OfficerHeaderV2() {
    return (
        <header className="h-16 border-b border-slate-200 flex items-center justify-between px-8 bg-white/80 backdrop-blur-xl sticky top-0 z-40">
            <div className="flex items-center gap-4">
                <h2 className="text-lg font-bold text-slate-800">Officer Command Center</h2>
                <div className="hidden md:flex items-center bg-slate-100 rounded-full px-4 py-1.5 gap-2 border border-slate-200">
                    <span className="material-symbols-outlined text-[18px] text-slate-400">search</span>
                    <input
                        className="bg-transparent border-none text-xs focus:ring-0 p-0 w-64 placeholder:text-slate-400"
                        placeholder="Search case numbers, suspects..."
                        type="text"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 border-r border-slate-200 pr-4 mr-2">
                    <span className="text-[11px] font-bold text-slate-400 px-2 py-1 bg-slate-50 rounded">WEB-VERSION 2.4.0</span>
                </div>
                <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
                    <span className="material-symbols-outlined">notifications</span>
                    <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                <button className="flex items-center gap-2 bg-primary text-white (color: #136dec) px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-primary/90 transition-colors">
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    New Incident
                </button>
            </div>
        </header>
    );
}
