import { useMemo } from 'react';
import { Lead } from '@/types';

interface LeadStats {
    totalLeads: number;
    newLeads: number;
    unassigned: number;
    overdue: number;
    conversionRate: number;
}

export function useLeadStats(leads: Lead[] | undefined, totalCount: number): LeadStats {
    return useMemo(() => {
        if (!leads || leads.length === 0) {
            return {
                totalLeads: 0,
                newLeads: 0,
                unassigned: 0,
                overdue: 0,
                conversionRate: 0,
            };
        }

        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        // Calculate new leads (created in last 7 days)
        const newLeads = leads.filter(lead => {
            const createdAt = new Date(lead.created_at);
            return createdAt >= sevenDaysAgo;
        }).length;

        // Calculate unassigned leads
        const unassigned = leads.filter(lead => !lead.assigned_to).length;

        // Calculate overdue follow-ups
        const overdue = leads.filter(lead => {
            if (!lead.next_followup_at) return false;
            const followupDate = new Date(lead.next_followup_at);
            return followupDate < now;
        }).length;

        // Calculate conversion rate
        const convertedCount = leads.filter(lead => lead.status === 'Converted').length;
        const conversionRate = totalCount > 0 ? Math.round((convertedCount / totalCount) * 100) : 0;

        return {
            totalLeads: totalCount,
            newLeads,
            unassigned,
            overdue,
            conversionRate,
        };
    }, [leads, totalCount]);
}
