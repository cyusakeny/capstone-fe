"use client";

import Link from "next/link";

export default function Hero() {
    return (
        <div className="relative bg-slate-50/80 dark:bg-navy-950/20">
            <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-10 md:py-20">
                <div
                    className="relative min-h-[600px] flex flex-col items-center justify-center text-center rounded-[2.5rem] overflow-hidden p-8 md:p-16 shadow-2xl border border-white/5"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(10, 25, 47, 0.9) 0%, rgba(2, 6, 23, 0.98) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuB4eKDXMPTFScVqOnNCxgDqq0e2sZV4vQBBZ2scpLecFHBqXBX6YwkSaBinnAF0H4Q2kwDi1qB2zAdmjTdD8Uycyo-nuu4qTOKM4GTdHerHNhQjVwAoTlOusd-LEVmD1h39LCx4BkijndGxNh_qXoBjitjmlphXwlRZYmiGYGJOEO_2siZtnhYdMPkeCNEyzys-6ZmVKkwOF15OQxvektZCu4X07CuTNhYT-q_R_wvnoJO9mBYegy7cygMiakN8p4yGWErnmk42PJTi")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-blue/20 border border-accent-blue/30 text-accent-blue text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-blue opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-blue"></span>
                        </span>
                        Blockchain Verified Network
                    </div>
                    <h1 className="text-white text-4xl md:text-7xl font-black leading-[1.05] tracking-tight max-w-4xl mb-6">
                        Verified Justice. <br className="hidden md:block" /><span className="text-slate-400">Secured by Blockchain.</span>
                    </h1>
                    <p className="text-slate-300 text-lg md:text-xl font-normal leading-relaxed max-w-2xl mb-12">
                        A professional, tamper-proof system for crime reporting and investigation management. Ensuring institutional integrity at every digital touchpoint.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
                        <Link href="/citizen-dashboard" className="px-8 py-4 bg-accent-blue text-white rounded-xl text-base font-bold shadow-xl shadow-accent-blue/20 hover:bg-accent-blue/90 transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center">
                            Citizen Portal
                        </Link>
                        <Link href="/officer/case-management" className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl text-base font-bold hover:bg-white/20 transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center">
                            Officer Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
