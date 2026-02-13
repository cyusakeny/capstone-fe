"use client";

import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-white dark:bg-background-dark border-t border-slate-200 dark:border-slate-800 py-20">
            <div className="max-w-[1440px] mx-auto px-6 md:px-12">
                <div className="flex flex-col md:flex-row justify-between items-center gap-12">
                    <div className="flex flex-col items-center md:items-start gap-4">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary-navy dark:text-accent-blue text-3xl font-bold">shield_locked</span>
                            <span className="font-bold text-2xl tracking-tight text-slate-900 dark:text-white">SecureReport</span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs text-center md:text-left leading-relaxed">
                            Building trust between citizens and law enforcement through cryptographic proof and transparency.
                        </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-12">
                        <div className="flex flex-col gap-4 text-center md:text-left">
                            <h5 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Resources</h5>
                            <Link className="text-slate-500 hover:text-primary-navy dark:text-slate-400 dark:hover:text-white text-sm transition-colors" href="#">Whitepaper</Link>
                            <Link className="text-slate-500 hover:text-primary-navy dark:text-slate-400 dark:hover:text-white text-sm transition-colors" href="#">Documentation</Link>
                        </div>
                        <div className="flex flex-col gap-4 text-center md:text-left">
                            <h5 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Legal</h5>
                            <Link className="text-slate-500 hover:text-primary-navy dark:text-slate-400 dark:hover:text-white text-sm transition-colors" href="#">Privacy Policy</Link>
                            <Link className="text-slate-500 hover:text-primary-navy dark:text-slate-400 dark:hover:text-white text-sm transition-colors" href="#">Terms of Service</Link>
                        </div>
                        <div className="flex flex-col gap-4 text-center md:text-left">
                            <h5 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Contact</h5>
                            <Link className="text-slate-500 hover:text-primary-navy dark:text-slate-400 dark:hover:text-white text-sm transition-colors" href="#">Support Center</Link>
                            <Link className="text-slate-500 hover:text-primary-navy dark:text-slate-400 dark:hover:text-white text-sm transition-colors" href="#">Contact Sales</Link>
                        </div>
                    </div>
                </div>
                <div className="mt-20 pt-10 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-400 dark:text-slate-500 text-xs font-medium">
                        © 2024 SecureReport Tech Inc. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <span className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-primary-navy transition-colors">public</span>
                        <span className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-primary-navy transition-colors">share</span>
                        <span className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-primary-navy transition-colors">verified</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
