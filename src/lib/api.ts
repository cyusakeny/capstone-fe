const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
    const url = `${API_URL}${endpoint}`;
    const headers: Record<string, string> = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...((options.headers as Record<string, string>) || {}),
    };

    // Add Authorization header if token exists
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('access_token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch (e) {
            errorData = { message: `API request failed with status ${response.status}` };
        }
        throw new Error(errorData.message || `API request failed with status ${response.status}`);
    }

    return response.json();
}

export async function apiUpload(file: File) {
    const url = `${API_URL}/files/upload`;
    const formData = new FormData();
    formData.append('file', file);

    const headers: Record<string, string> = {
        'Accept': '*/*',
    };

    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('access_token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `File upload failed with status ${response.status}`);
    }

    return response.json();
}

export async function createEvidence(reportId: string, fileId: string, description: string) {
    return apiFetch('/evidence', {
        method: 'POST',
        body: JSON.stringify({
            reportId,
            fileId,
            description,
        }),
    });
}

export async function getEvidenceByReportId(reportId: string) {
    return apiFetch(`/evidence/report/${reportId}`);
}

export async function getReports() {
    return apiFetch('/reports');
}

export async function getReportById(reportId: string) {
    return apiFetch(`/reports/${reportId}`);
}

export async function addInvestigativeNotes(reportId: string, notes: string) {
    return apiFetch(`/reports/${reportId}/notes`, {
        method: 'PATCH',
        body: JSON.stringify({ notes }),
    });
}

export async function updateReportStatus(reportId: string, status: string) {
    return apiFetch(`/reports/${reportId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
    });
}

export async function getOfficersByRole(role: string) {
    return apiFetch(`/officers/role/${role}`);
}

export async function assignOfficerToReport(reportId: string, officerId: string) {
    return apiFetch(`/reports/${reportId}/assign`, {
        method: 'PATCH',
        body: JSON.stringify({ officerId }),
    });
}

export async function createOfficer(officerData: any) {
    return apiFetch('/officers', {
        method: 'POST',
        body: JSON.stringify(officerData),
    });
}

export async function getUserById(userId: string) {
    return apiFetch(`/users/${userId}`);
}

export async function getIntelligenceReportsSubmissions() {
    return apiFetch(`/intelligence-reports/submitted`);
}

export async function getIntelligenceReportsIncoming() {
    return apiFetch(`/intelligence-reports/assigned`);
}

export async function createIntelligenceReport(reportData: any) {
    return apiFetch('/intelligence-reports', {
        method: 'POST',
        body: JSON.stringify(reportData),
    });
}

export async function getBlockchainReportsMe() {
    return apiFetch('/blockchain/reports/me');
}

export async function getBlockchainReportAudits(reportId: string) {
    return apiFetch(`/blockchain/audit/report/${reportId}`);
}

export async function getBlockchainUserAudits(userId: string) {
    return apiFetch(`/blockchain/audit/user/${userId}`);
}

export async function getAccessLogsByUserId(userId: string) {
    return apiFetch(`/access-logs/user/${userId}`);
}

export async function getBlockchainReportEvidence(reportId: string) {
    return apiFetch(`/blockchain/report/${reportId}/evidence`);
}

export function getFileUrl(fileId: string) {
    return `${API_URL}/files/view/${fileId}`;
}
