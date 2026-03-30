"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LegalPage() {
    const [activeSection, setActiveSection] = useState("privacy");

    const sections = [
        { id: "privacy", label: "Privacy Policy" },
        { id: "terms", label: "Terms of Service" },
        { id: "eula", label: "EULA" },
    ];

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 100;
            for (const section of sections) {
                const element = document.getElementById(section.id);
                if (element && element.offsetTop <= scrollPosition && element.offsetTop + element.offsetHeight > scrollPosition) {
                    setActiveSection(section.id);
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-slate-50 dark:bg-navy-950">
            <Navbar />

            <main className="flex-1 max-w-[1200px] mx-auto w-full px-6 py-12 md:py-20 flex flex-col md:flex-row gap-12">
                {/* Sidebar Navigation */}
                <aside className="md:w-64 shrink-0 flex flex-col gap-2 sticky top-32 h-fit">
                    <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4 ml-4">Legal Documents</h3>
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => {
                                document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth" });
                                setActiveSection(section.id);
                            }}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${activeSection === section.id
                                ? "bg-white dark:bg-navy-900 shadow-sm text-primary-navy dark:text-accent-blue font-bold border border-slate-200 dark:border-navy-800"
                                : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-900/50"
                                }`}
                        >
                            <span className="material-symbols-outlined text-xl">
                                {section.id === "privacy" ? "lock" : section.id === "terms" ? "gavel" : "assignment_turned_in"}
                            </span>
                            {section.label}
                        </button>
                    ))}
                </aside>

                {/* Content Area */}
                <div className="flex-1 flex flex-col gap-24">
                    {/* Privacy Policy */}
                    <section id="privacy" className="scroll-mt-32">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="size-12 rounded-2xl bg-primary-navy/5 dark:bg-accent-blue/5 flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary-navy dark:text-accent-blue text-2xl font-bold">lock</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Privacy Policy</h1>
                        </div>

                        <div className="prose prose-slate dark:prose-invert max-w-none">
                            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
                                Last updated: March 29, 2026. Your privacy is paramount at SecureReport. We use cryptographic standards to ensure your data remains your own.
                            </p>

                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">1. Data Collection & Hashing</h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                When you submit a report, we generate a unique cryptographic hash of the content. This hash is stored on a public blockchain to provide an immutable record of your report's timestamp and integrity. Personal identifiers are encrypted and only accessible by authorized law enforcement personnel during active investigations.
                            </p>

                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">2. Blockchain Transparency</h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                While the contents of your report are private, the metadata related to its submission (status changes, assignment to officers) is recorded on-chain. This ensures that the progress of justice is transparent and cannot be tampered with by any single entity.
                            </p>

                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">3. Data Retention</h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                Reports are archived for a period required by local jurisdiction laws. However, the cryptographic proof on the blockchain remains permanent.
                            </p>
                        </div>
                    </section>

                    {/* Terms of Service */}
                    <section id="terms" className="scroll-mt-32">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="size-12 rounded-2xl bg-primary-navy/5 dark:bg-accent-blue/5 flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary-navy dark:text-accent-blue text-2xl font-bold">gavel</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Terms of Service</h1>
                        </div>

                        <div className="prose prose-slate dark:prose-invert max-w-none">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">1. User Conduct & Integrity</h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                Submitting false reports or intentionally misleading information is strictly prohibited. Users found engaging in malicious reporting may face account suspension and potential legal prosecution under local statutes regarding filing a false police report.
                            </p>

                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">2. Accountability</h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                Users are responsible for maintaining the security of their cryptographic keys or login credentials. Unauthorized access resulting from user negligence is the sole responsibility of the user.
                            </p>

                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">3. Intellectual Property</h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                The SecureReport platform, including its unique algorithms and interface design, is the property of SecureReport Tech Inc. Users are granted a limited license to use the service for reporting purposes only.
                            </p>
                        </div>
                    </section>

                    {/* EULA */}
                    <section id="eula" className="scroll-mt-32 pb-12">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="size-12 rounded-2xl bg-primary-navy/5 dark:bg-accent-blue/5 flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary-navy dark:text-accent-blue text-2xl font-bold">assignment_turned_in</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">End User License Agreement</h1>
                        </div>

                        <div className="prose prose-slate dark:prose-invert max-w-none">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">1. License Grant</h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                SecureReport grants you a personal, non-transferable, non-exclusive license to use the SecureReport software on your devices in accordance with these terms.
                            </p>

                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">2. Limitation of Liability</h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                SecureReport provides a technological platform for evidence management. We do not guarantee the outcome of any criminal investigation or legal proceeding. Under no circumstances shall SecureReport Tech Inc. be liable for any direct, indirect, or consequential damages resulting from the use or inability to use our services.
                            </p>

                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">3. Restrictions on Use</h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                You may not: (a) decompile, reverse engineer, disassemble, or attempt to derive the source code of the Software; (b) modify, adapt, or create derivative works based upon the Software; or (c) remove any proprietary notices or labels on the Software.
                            </p>

                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">4. Termination</h3>
                            <p className="text-slate-600 dark:text-slate-400 pb-12">
                                We reserve the right to terminate your access to the platform at any time, without notice, if we believe you have breached these terms or engaged in activities harmful to the community or the integrity of the justice system.
                            </p>
                        </div>
                    </section>

                    {/* Agreement Section */}
                    <section className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-3xl p-8 mb-20 shadow-xl shadow-navy-950/5">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Accept Legal Terms</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">
                                    By clicking the button below, you acknowledge that you have read and agree to our Privacy Policy, Terms of Service, and End User License Agreement.
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    localStorage.setItem("legal-agreed", "true");
                                    alert("Thank you for accepting our legal terms.");
                                }}
                                className="bg-primary-navy dark:bg-accent-blue text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-navy-900/10 hover:opacity-90 transition-all flex items-center gap-3"
                            >
                                <span className="material-symbols-outlined">check_circle</span>
                                I Agree to the Terms
                            </button>
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
