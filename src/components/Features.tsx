"use client";

export default function Features() {
    return (
        <>
            <section className="bg-slate-50/80 dark:bg-navy-950/20 border-b border-slate-100 dark:border-navy-900/50">
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-24">
                    <div className="text-center mb-16">
                        <h4 className="text-primary-navy dark:text-accent-blue text-[10px] font-black leading-normal tracking-[0.3em] uppercase mb-4">How it Works</h4>
                        <h2 className="text-3xl md:text-5xl font-extrabold text-navy-900 dark:text-white tracking-tight">Three steps to accountability</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        <div className="hidden md:block absolute top-10 left-[15%] right-[15%] h-[1px] bg-slate-200 dark:bg-navy-800 z-0"></div>
                        <div className="flex flex-col items-center text-center relative z-10 group">
                            <div className="flex items-center justify-center size-20 rounded-2xl bg-primary-navy dark:bg-accent-blue text-white dark:text-navy-900 shadow-2xl group-hover:scale-105 transition-all mb-6">
                                <span className="material-symbols-outlined text-3xl font-bold">edit_note</span>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-navy-900 dark:text-white">1. Report</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-[280px]">
                                Securely submit evidence, photos, and incident details via our military-grade encrypted digital portal.
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center relative z-10 group">
                            <div className="flex items-center justify-center size-20 rounded-2xl bg-primary-navy dark:bg-accent-blue text-white dark:text-navy-900 shadow-2xl group-hover:scale-105 transition-all mb-6">
                                <span className="material-symbols-outlined text-3xl font-bold">verified_user</span>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-navy-900 dark:text-white">2. Verify</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-[280px]">
                                Every data point is timestamped and hashed on the blockchain, creating an immutable audit trail.
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center relative z-10 group">
                            <div className="flex items-center justify-center size-20 rounded-2xl bg-primary-navy dark:bg-accent-blue text-white dark:text-navy-900 shadow-2xl group-hover:scale-105 transition-all mb-6">
                                <span className="material-symbols-outlined text-3xl font-bold">insights</span>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-navy-900 dark:text-white">3. Track</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-[280px]">
                                Monitor real-time case status and investigation milestones with complete departmental transparency.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-primary-navy dark:bg-black border-y border-navy-800 py-32 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-blue/10 rounded-full blur-[120px] -mr-64 -mt-64"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary-navy/20 rounded-full blur-[120px] -ml-64 -mb-64"></div>

                <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                        <div className="max-w-xl">
                            <h4 className="text-accent-blue text-[10px] font-black uppercase tracking-[0.3em] mb-4">The Foundation</h4>
                            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-[1.05] mb-6">Core Pillars of Justice</h2>
                            <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed">Our foundation is built on three essential values that define modern public safety technology.</p>
                        </div>
                        <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-3 transition-all border border-white/10 backdrop-blur-md">
                            Vision details <span className="material-symbols-outlined text-lg">arrow_forward</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="group bg-white p-10 rounded-3xl shadow-2xl transition-all hover:-translate-y-2 border border-white/10">
                            <div className="text-white bg-primary-navy w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-navy-900/20">
                                <span className="material-symbols-outlined text-[36px]">lock_person</span>
                            </div>
                            <h3 className="text-navy-900 text-2xl font-black mb-4">Uncompromising Security</h3>
                            <p className="text-slate-600 leading-relaxed text-lg">
                                End-to-end encryption ensures that only authorized personnel can access sensitive case information.
                            </p>
                        </div>
                        <div className="group bg-white p-10 rounded-3xl shadow-2xl transition-all hover:-translate-y-2 border border-white/10">
                            <div className="text-white bg-primary-navy w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-navy-900/20">
                                <span className="material-symbols-outlined text-[36px]">hub</span>
                            </div>
                            <h3 className="text-navy-900 text-2xl font-black mb-4">Total Transparency</h3>
                            <p className="text-slate-600 leading-relaxed text-lg">
                                Blockchain technology provides an immutable record of every action taken during an investigation.
                            </p>
                        </div>
                        <div className="group bg-white p-10 rounded-3xl shadow-2xl transition-all hover:-translate-y-2 border border-white/10">
                            <div className="text-white bg-primary-navy w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-navy-900/20">
                                <span className="material-symbols-outlined text-[36px]">speed</span>
                            </div>
                            <h3 className="text-navy-900 text-2xl font-black mb-4">Rapid Efficiency</h3>
                            <p className="text-slate-600 leading-relaxed text-lg">
                                Streamlined digital workflows eliminate bureaucratic paperwork and accelerate the speed of justice.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
