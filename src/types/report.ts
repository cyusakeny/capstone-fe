export interface Report {
    id: string;
    referenceNumber?: string | null;
    reporterName?: string;
    reporterPhone?: string;
    reporterEmail?: string;
    reporterHash?: string;
    assigned_officer_id: string;
    category: string;
    title: string;
    description: string;
    location: string;
    latitude: string;
    longitude: string;
    incident_date: string;
    incident_time: string;
    status: string;
    investigativeNotes?: string;
    created_at: string;
    updated_at: string;
}

export interface EvidenceFile {
    id: string;
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    path: string;
    created_at: string;
    updated_at: string;
}

export interface Evidence {
    id: string;
    reportId: string;
    fileId: string;
    description: string;
    created_at: string;
    updated_at: string;
    file: EvidenceFile;
}
