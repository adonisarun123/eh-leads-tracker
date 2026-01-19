import { Lead } from '@/types';

export function calculateLeadScore(lead: Lead): number {
    if (lead.score) return lead.score; // Return existing score if present

    let score = 0;

    // Source scoring
    switch (lead.source) {
        case 'Referral': score += 10; break;
        case 'Website': score += 6; break;
        case 'Ads': score += 4; break;
        default: score += 2; // Unknown
    }

    // Completeness
    if (lead.email) score += 2;
    if (lead.notes && lead.notes.length > 0) score += 2;

    // Priority
    switch (lead.priority) {
        case 'High': score += 8; break;
        case 'Medium': score += 4; break;
        case 'Low': score += 1; break;
    }

    // Service Type (High demand services)
    if (lead.service_required && ['Nanny', 'Elder care'].includes(lead.service_required)) {
        score += 3;
    }

    return score;
}

export function getScoreColor(score: number) {
    if (score >= 20) return 'text-red-600 font-bold'; // Hot
    if (score >= 10) return 'text-orange-500 font-semibold'; // Warm
    return 'text-blue-500'; // Cold
}
