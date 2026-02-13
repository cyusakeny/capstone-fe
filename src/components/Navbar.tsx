"use client";

import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 flex items-center bg-slate-50/90 dark:bg-navy-950/90 backdrop-blur-xl px-6 md:px-12 py-4 border-b border-slate-200 dark:border-navy-800 justify-between">
            <div className="flex items-center gap-2">
                <div className="text-primary-navy dark:text-accent-blue flex size-10 shrink-0 items-center justify-center">
                    <span className="material-symbols-outlined text-[32px]">shield_locked</span>
                </div>
                <h2 className="text-primary-navy dark:text-white text-xl font-bold leading-tight tracking-tight">SecureReport</h2>
            </div>
            <div className="hidden md:flex items-center gap-8">
                <Link className="text-slate-600 dark:text-slate-400 hover:text-primary-navy dark:hover:text-white font-medium text-sm transition-colors" href="#">Platform</Link>
                <Link className="text-slate-600 dark:text-slate-400 hover:text-primary-navy dark:hover:text-white font-medium text-sm transition-colors" href="#">Solutions</Link>
                <Link className="text-slate-600 dark:text-slate-400 hover:text-primary-navy dark:hover:text-white font-medium text-sm transition-colors" href="#">Security</Link>
            </div>
            <div className="flex items-center gap-4">
                <button className="text-primary-navy dark:text-slate-300 text-sm font-bold hover:opacity-80">Help</button>
                <button className="bg-primary-navy text-white px-5 py-2 rounded-lg text-sm font-bold shadow-lg shadow-navy-900/10 hover:bg-navy-800 transition-all">Get Started</button>
            </div>
        </nav>
    );
}
