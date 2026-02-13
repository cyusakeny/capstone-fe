"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface OfficerHeaderProps {
    caseId?: string;
    caseType?: string;
    showBack?: boolean;
}

export default function OfficerHeader({ caseId, caseType, showBack = false }: OfficerHeaderProps) {
    const router = useRouter();

    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 sticky top-0 z-30">
            <div className="flex items-center gap-4">
                {showBack && (
                    <>
                        <button
                            onClick={() => router.back()}
                            className="text-slate-400 hover:text-primary transition-colors flex items-center justify-center p-1 rounded-md hover:bg-slate-50"
                        >
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>
                        <div className="h-6 w-px bg-slate-200"></div>
                    </>
                )}
                <div>
                    <h1 className="text-lg font-bold">
                        {caseId ? (
                            <>
                                {caseId} <span className="text-slate-400 font-normal ml-2">/ {caseType}</span>
                            </>
                        ) : (
                            "Dashboard"
                        )}
                    </h1>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="hidden sm:flex items-center gap-2 bg-green-50 border border-green-100 px-3 py-1.5 rounded-full">
                    <span className="text-green-600 material-symbols-outlined text-sm">verified</span>
                    <span className="text-[11px] uppercase font-bold tracking-wider text-green-700">Blockchain Secured</span>
                </div>
                <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-slate-800 transition-colors shadow-sm">
                    <span className="material-symbols-outlined text-sm">cloud_sync</span>
                    <span className="hidden xs:inline">Sync Ledger</span>
                    <span className="xs:hidden">Sync</span>
                </button>
            </div>
        </header>
    );
}
