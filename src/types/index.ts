export type LeadStatus =
    | 'New'
    | 'Contacted'
    | 'Qualified'
    | 'Trial Scheduled'
    | 'Converted'
    | 'Lost';

export type LeadPriority = 'High' | 'Medium' | 'Low';

export interface Lead {
    id: string; // uuid
    created_at: string; // timestamp
    updated_at: string; // timestamp
    name: string;
    phone: string;
    email: string | null;
    city: string | null;
    source: string; // Website / WhatsApp / Referral / Ads / Walk-in
    campaign: string | null;
    service_required: string; // Maid / Cook / Nanny / Elder care
    status: LeadStatus;
    assigned_to: string | null; // text or uuid
    notes: string | null;
    last_contacted_at: string | null; // timestamp
    next_followup_at: string | null; // timestamp
    priority: LeadPriority;
    score: number | null;
}

export interface LeadFilterParams {
    status?: LeadStatus[];
    search?: string;
    city?: string[];
    source?: string[];
    service_required?: string[];
    assigned_to?: string[];
    priority?: LeadPriority[];
    dateRange?: { from: Date; to: Date };
    overdue?: boolean;
    attention?: boolean;
}
