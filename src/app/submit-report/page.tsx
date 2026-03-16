"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Report } from "@/types/report";
import { apiFetch, apiUpload, createEvidence } from "@/lib/api";

type Step = 1 | 2 | 3 | 4;

interface FormData {
    reporterName: string;
    reporterPhone: string;
    reporterEmail: string;
    title: string;
    category: string;
    incident_date: string;
    location: string;
    latitude: string;
    longitude: string;
    description: string;
    evidence: File[];
}

const STEPS = [
    { id: 1, label: "Reporter Info", icon: "person" },
    { id: 2, label: "Incident Details", icon: "description" },
    { id: 3, label: "Evidence Upload", icon: "cloud_upload" },
    { id: 4, label: "Review & Submit", icon: "visibility" },
];

export default function SubmitReport() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState<Step>(1);
    const [formData, setFormData] = useState<FormData>({
        reporterName: "",
        reporterPhone: "",
        reporterEmail: "",
        title: "",
        category: "Theft or Robbery",
        incident_date: new Date().toISOString().slice(0, 16),
        location: "",
        latitude: "",
        longitude: "",
        description: "",
        evidence: [],
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submissionResponse, setSubmissionResponse] = useState<Report | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    const updateFormData = (data: Partial<FormData>) => {
        setFormData((prev) => ({ ...prev, ...data }));
    };

    const nextStep = () => {
        // Validation logic
        if (currentStep === 2) {
            if (!formData.title || !formData.latitude || !formData.longitude || !formData.location) {
                setError("Please fill in all incident details, including coordinates and location.");
                return;
            }
        }

        setError(null);
        setCurrentStep((prev) => (prev < 4 ? (prev + 1) as Step : prev));
    };

    const prevStep = () => {
        setError(null);
        setCurrentStep((prev) => (prev > 1 ? (prev - 1) as Step : prev));
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Get user info from localStorage
            const userJson = localStorage.getItem('user');
            const user = userJson ? JSON.parse(userJson) : null;

            const payload = {
                reporterName: formData.reporterName,
                reporterPhone: formData.reporterPhone,
                reporterEmail: formData.reporterEmail,
                assigned_officer_id: "officer_id_123",
                category: formData.category,
                title: formData.title,
                description: formData.description,
                location: formData.location,
                latitude: formData.latitude,
                longitude: formData.longitude,
                incident_date: new Date(formData.incident_date).toISOString(),
                incident_time: new Date(formData.incident_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };

            // 1. Create the report
            const report: Report = await apiFetch('/reports', {
                method: 'POST',
                body: JSON.stringify(payload),
            });

            console.log("Report Created:", report);

            // 2. Upload evidence files and link them
            if (formData.evidence.length > 0) {
                const uploadPromises = formData.evidence.map(async (file) => {
                    try {
                        const uploadRes = await apiUpload(file);
                        await createEvidence(report.id, uploadRes.id, `Evidence for ${formData.title}`);
                    } catch (uploadErr) {
                        console.error(`Failed to upload file ${file.name}:`, uploadErr);
                    }
                });
                await Promise.all(uploadPromises);
            }

            setSubmissionResponse(report);
            setIsSubmitted(true);
        } catch (err: unknown) {
            console.error("Report Submission Error:", err);
            const errorMessage = err instanceof Error ? err.message : "Failed to submit report. Please try again.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted && submissionResponse) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
                <div className="max-w-2xl w-full bg-white p-10 rounded-3xl border border-border-gray shadow-2xl">
                    <div className="size-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="material-symbols-outlined text-4xl">task_alt</span>
                    </div>
                    <h2 className="text-3xl font-black text-primary-navy mb-4">Report Filed Successfully</h2>
                    <p className="text-slate-500 mb-8 max-w-md mx-auto">Your report has been encrypted and recorded. A specialized officer will be assigned to your case shortly.</p>

                    <div className="bg-slate-50 rounded-2xl p-6 mb-8 text-left border border-slate-100">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reference Number</p>
                                <p className="font-mono text-primary-navy tracking-wider text-base">{submissionResponse.referenceNumber || submissionResponse.id}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</p>
                                <p className="font-bold text-amber-600">{submissionResponse.status}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Link href="/my-reports" className="flex-1 bg-primary-navy text-white py-4 rounded-2xl font-bold hover:bg-primary-navy/90 transition-all shadow-lg">
                            Track My Case
                        </Link>
                        <Link href="/citizen-dashboard" className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all">
                            Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Reporter Information</h2>
                        <p className="text-slate-500 mb-8">Confirm your contact details for investigation follow-ups.</p>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Full Name</label>
                                <input
                                    type="text"
                                    value={formData.reporterName}
                                    onChange={(e) => updateFormData({ reporterName: e.target.value })}
                                    className="w-full h-12 rounded-lg border-slate-200 focus:border-accent-blue focus:ring-accent-blue px-3 outline-none transition-all"
                                    placeholder="Enter your full name"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Phone Number</label>
                                <input
                                    type="tel"
                                    value={formData.reporterPhone}
                                    onChange={(e) => updateFormData({ reporterPhone: e.target.value })}
                                    className="w-full h-12 rounded-lg border-slate-200 focus:border-accent-blue focus:ring-accent-blue px-3 outline-none transition-all"
                                    placeholder="+1 (555) 0123"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Email Address</label>
                                <input
                                    type="email"
                                    value={formData.reporterEmail}
                                    onChange={(e) => updateFormData({ reporterEmail: e.target.value })}
                                    className="w-full h-12 rounded-lg border-slate-200 focus:border-accent-blue focus:ring-accent-blue px-3 outline-none transition-all"
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Incident Details & Location</h2>
                        <p className="text-slate-500 mb-8">Provide precise information about the event.</p>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Report Title</label>
                                <input
                                    type="text"
                                    placeholder="Brief summary of the incident"
                                    value={formData.title}
                                    onChange={(e) => updateFormData({ title: e.target.value })}
                                    className="w-full h-12 rounded-lg border-slate-200 focus:border-accent-blue focus:ring-accent-blue px-3 outline-none transition-all"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Crime Category</label>
                                <select
                                    className="w-full h-12 rounded-lg border-slate-200 focus:border-accent-blue focus:ring-accent-blue px-3 outline-none transition-all appearance-none bg-white"
                                    value={formData.category}
                                    onChange={(e) => updateFormData({ category: e.target.value })}
                                >
                                    <option>Theft or Robbery</option>
                                    <option>Vandalism / Property Damage</option>
                                    <option>Assault</option>
                                    <option>Fraud / Cybercrime</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Incident Date & Time</label>
                                <input
                                    type="datetime-local"
                                    value={formData.incident_date}
                                    onChange={(e) => updateFormData({ incident_date: e.target.value })}
                                    className="w-full h-12 rounded-lg border-slate-200 focus:border-accent-blue focus:ring-accent-blue px-3 outline-none transition-all"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Latitude</label>
                                <input
                                    type="text"
                                    placeholder="40.7128"
                                    value={formData.latitude}
                                    onChange={(e) => updateFormData({ latitude: e.target.value })}
                                    className="w-full h-12 rounded-lg border-slate-200 focus:border-accent-blue focus:ring-accent-blue px-3 outline-none transition-all"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Longitude</label>
                                <input
                                    type="text"
                                    placeholder="-74.0060"
                                    value={formData.longitude}
                                    onChange={(e) => updateFormData({ longitude: e.target.value })}
                                    className="w-full h-12 rounded-lg border-slate-200 focus:border-accent-blue focus:ring-accent-blue px-3 outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Exact Location</label>
                            <div className="relative w-full h-48 rounded-xl overflow-hidden border border-slate-200">
                                <img alt="Map" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBjUJLyzQteOl0J61FEi14xk_fSeZ3FwMMsAzHTEoDvjmORwgFd8i9lc_7_XC7aNjV18S2y5jvK7hJuSiy_-XUE5okhqN3XUoHUNg_LmwsawZxs2siJkW0avtadgVUsfP8MMBN6gifKbOCtLpFZQbr0ZkXz2Qyj6Nna_a-0magGkH3aVZCm8B6aMDvWeGOIW0ektBZWRN4WmleOc8DSbh3yPcI4pYb2YAJGoRh7HARdeIBd7_p1O_yvqRQ9aU1JW7qQ9vXnlKUS98p" />
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <span className="material-symbols-outlined text-accent-blue text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                                </div>
                            </div>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => updateFormData({ location: e.target.value })}
                                className="w-full h-12 rounded-lg border-slate-200 focus:border-accent-blue focus:ring-accent-blue px-3 outline-none transition-all mt-2"
                                placeholder="Enter full address..."
                                required
                            />
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Evidence Upload</h2>
                        <p className="text-slate-500 mb-8">Upload photos or videos. These will be hashed onto the blockchain.</p>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Incident Description</label>
                            <textarea
                                className="w-full rounded-lg border-slate-200 focus:border-accent-blue focus:ring-accent-blue p-4 text-sm outline-none transition-all"
                                rows={4}
                                value={formData.description}
                                onChange={(e) => updateFormData({ description: e.target.value })}
                                placeholder="Describe what happened..."
                            />
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {formData.evidence.map((file, idx) => (
                                <div key={idx} className="relative aspect-square rounded-xl border border-slate-200 bg-slate-50 overflow-hidden group">
                                    {file.type.startsWith('image/') ? (
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt="preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center">
                                            <span className="material-symbols-outlined text-slate-400 text-3xl">description</span>
                                            <span className="text-[10px] text-slate-500 mt-1 truncate px-2 w-full text-center">{file.name}</span>
                                        </div>
                                    )}
                                    <button
                                        onClick={() => {
                                            const newEvidence = [...formData.evidence];
                                            newEvidence.splice(idx, 1);
                                            updateFormData({ evidence: newEvidence });
                                        }}
                                        className="absolute top-1 right-1 size-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <span className="material-symbols-outlined text-sm">close</span>
                                    </button>
                                </div>
                            ))}
                            <label className="aspect-square rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors">
                                <input
                                    type="file"
                                    multiple
                                    className="hidden"
                                    onChange={(e) => {
                                        if (e.target.files) {
                                            updateFormData({ evidence: [...formData.evidence, ...Array.from(e.target.files)] });
                                        }
                                    }}
                                />
                                <span className="material-symbols-outlined text-slate-400 text-3xl">cloud_upload</span>
                                <span className="text-[10px] font-bold text-slate-500 mt-2 uppercase">Upload</span>
                            </label>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Review & Submit</h2>
                        <p className="text-slate-500 mb-8">Check your report one last time before it&apos;s encrypted and filed.</p>
                        <div className="bg-slate-50 rounded-xl p-6 space-y-4 border border-slate-100">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase">Title</p>
                                    <p className="font-semibold text-navy-900">{formData.title || "No Title"}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase">Category</p>
                                    <p className="font-semibold text-navy-900">{formData.category}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase">Incident Date</p>
                                    <p className="font-semibold text-navy-900">{formData.incident_date.replace("T", " ")}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase">Coordinates</p>
                                    <p className="font-semibold text-navy-900">{formData.latitude}, {formData.longitude}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-xs font-bold text-slate-400 uppercase">Location</p>
                                    <p className="font-semibold text-navy-900">{formData.location}</p>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-slate-200">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-xs font-bold text-slate-400 uppercase">Description</p>
                                    {formData.evidence.length > 0 && (
                                        <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                                            {formData.evidence.length} Evidence {formData.evidence.length === 1 ? 'File' : 'Files'} Attached
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-slate-700 italic">{formData.description || "No description provided."}</p>
                            </div>
                        </div>
                        <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100 flex items-start gap-3">
                            <span className="material-symbols-outlined text-emerald-600">verified</span>
                            <p className="text-xs text-emerald-800 font-medium">Ready for on-chain integrity verification. Once submitted, this report becomes an immutable record.</p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="flex min-h-screen bg-white">
            {/* Sidebar Stepper */}
            <aside className="w-80 bg-slate-50 border-r border-slate-200 p-8 hidden md:flex flex-col sticky top-0 h-screen">
                <div className="mb-12">
                    <Link href="/citizen-dashboard" className="flex items-center gap-2 mb-8 group">
                        <span className="material-symbols-outlined text-primary-navy text-3xl group-hover:text-accent-blue transition-colors">shield_person</span>
                        <h1 className="text-xl font-bold tracking-tight text-primary-navy">SecureReport</h1>
                    </Link>
                    <nav className="space-y-8 relative">
                        <div className="absolute left-5 top-2 bottom-2 w-px bg-slate-200 -z-10" />
                        {STEPS.map((step) => {
                            const active = currentStep === step.id;
                            const completed = currentStep > step.id;
                            return (
                                <div key={step.id} className="flex items-start gap-4">
                                    <div className={`size-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 z-10 ${active ? "bg-primary-navy text-white ring-4 ring-primary-navy/10" :
                                        completed ? "bg-emerald-500 text-white" :
                                            "bg-white border-2 border-slate-200 text-slate-400"
                                        }`}>
                                        {completed ? <span className="material-symbols-outlined text-lg">check</span> : step.id}
                                    </div>
                                    <div>
                                        <p className={`text-[10px] font-bold uppercase tracking-widest ${active ? "text-accent-blue" : "text-slate-400"}`}>Step {step.id}</p>
                                        <p className={`text-sm font-bold ${active ? "text-slate-900" : "text-slate-500"}`}>{step.label}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </nav>
                </div>

                <div className="mt-auto p-4 bg-primary-navy/5 rounded-xl border border-primary-navy/10">
                    <p className="text-[11px] text-primary-navy/70 leading-relaxed italic">
                        <span className="material-symbols-outlined text-xs align-middle mr-1">info</span>
                        Encrypted and timestamped using blockchain technology for evidentiary integrity.
                    </p>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center">
                <div className="w-full max-w-3xl px-6 py-12 flex-1">
                    {renderStep()}

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-xs text-red-600 font-medium">
                            {error}
                        </div>
                    )}

                    <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between">
                        <button
                            disabled={currentStep === 1}
                            onClick={prevStep}
                            className={`px-8 h-12 rounded-lg border border-slate-200 font-bold text-sm transition-all ${currentStep === 1 ? "opacity-30 cursor-not-allowed" : "text-slate-600 hover:bg-slate-50"
                                }`}
                        >
                            Back
                        </button>
                        <button
                            onClick={currentStep === 4 ? handleSubmit : nextStep}
                            disabled={isLoading}
                            className={`px-10 h-12 rounded-lg bg-primary-navy text-white font-bold hover:bg-navy-800 transition-all shadow-lg shadow-primary-navy/20 flex items-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {currentStep === 4 ? (isLoading ? "Submitting..." : "Submit Report") : "Continue"}
                            {!isLoading && <span className="material-symbols-outlined text-sm">arrow_forward</span>}
                        </button>

                    </div>
                </div>
            </main>
        </div>
    );
}
