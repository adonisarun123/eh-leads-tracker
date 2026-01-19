import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Lead } from '@/types';
import { startOfDay, subDays, format, differenceInHours } from 'date-fns';

export interface AnalyticsData {
    volumeTrend: { date: string; count: number }[];
    bySource: { name: string; value: number }[];
    byCity: { name: string; value: number }[];
    byService: { name: string; value: number }[];
    funnel: { step: string; count: number }[];
    insights: string[];
    conversionRate: number;
}

export function useAnalytics() {
    return useQuery({
        queryKey: ['analytics'],
        queryFn: async (): Promise<AnalyticsData> => {
            // Fetch data for last 30 days
            const thirtyDaysAgo = subDays(startOfDay(new Date()), 30).toISOString();

            const { data: leads, error } = await supabase
                .from('leads')
                .select('*')
                .gte('created_at', thirtyDaysAgo);

            if (error) throw error;
            if (!leads) return emptyAnalytics();

            return aggregateData(leads as Lead[]);
        },
    });
}

function emptyAnalytics(): AnalyticsData {
    return {
        volumeTrend: [],
        bySource: [],
        byCity: [],
        byService: [],
        funnel: [],
        insights: [],
        conversionRate: 0,
    };
}

function aggregateData(leads: Lead[]): AnalyticsData {
    const volumeMap = new Map<string, number>();
    const sourceMap = new Map<string, number>();
    const cityMap = new Map<string, number>();
    const serviceMap = new Map<string, number>();
    const statusCounts = new Map<string, number>();

    let convertedCount = 0;
    let totalQualified = 0;

    // Initialize last 30 days for volume
    for (let i = 0; i < 30; i++) {
        const d = subDays(new Date(), i);
        volumeMap.set(format(d, 'yyyy-MM-dd'), 0);
    }

    leads.forEach(lead => {
        // Volume
        const dateKey = format(new Date(lead.created_at), 'yyyy-MM-dd');
        volumeMap.set(dateKey, (volumeMap.get(dateKey) || 0) + 1);

        // Source
        if (lead.source) sourceMap.set(lead.source, (sourceMap.get(lead.source) || 0) + 1);

        // City
        if (lead.city) cityMap.set(lead.city, (cityMap.get(lead.city) || 0) + 1);

        // Service
        if (lead.service_required) serviceMap.set(lead.service_required, (serviceMap.get(lead.service_required) || 0) + 1);

        // Status / Funnel
        statusCounts.set(lead.status, (statusCounts.get(lead.status) || 0) + 1);

        if (lead.status === 'Converted') convertedCount++;
        if (['Qualified', 'Trial Scheduled', 'Converted'].includes(lead.status)) totalQualified++;
    });

    // Funnel: New -> Contacted -> Qualified -> Trial -> Converted
    // Actually funnel numbers should be cumulative in a real funnel, but for now exact counts
    // Or we can simulate flow. E.g. Qualified includes Converted?
    // Let's just show distribution by steps for simplicity requested
    const funnel = [
        { step: 'New', count: statusCounts.get('New') || 0 },
        { step: 'Contacted', count: statusCounts.get('Contacted') || 0 },
        { step: 'Qualified', count: statusCounts.get('Qualified') || 0 },
        { step: 'Trial', count: statusCounts.get('Trial Scheduled') || 0 },
        { step: 'Converted', count: statusCounts.get('Converted') || 0 },
    ];

    // Formats
    const volumeTrend = Array.from(volumeMap.entries())
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));

    const bySource = Array.from(sourceMap.entries()).map(([name, value]) => ({ name, value }));
    const byCity = Array.from(cityMap.entries()).map(([name, value]) => ({ name, value }));
    const byService = Array.from(serviceMap.entries()).map(([name, value]) => ({ name, value }));

    // Generate Insights
    const insights: string[] = [];

    // Best Source
    const bestSource = bySource.sort((a, b) => b.value - a.value)[0];
    if (bestSource) insights.push(`Primary lead source is ${bestSource.name} (${bestSource.value} leads).`);

    // Unassigned
    const unassigned = leads.filter(l => !l.assigned_to).length;
    if (unassigned > 0) insights.push(`${unassigned} leads are unassigned.`);

    // Overdue
    const overdue = leads.filter(l => l.next_followup_at && new Date(l.next_followup_at) < new Date()).length;
    if (overdue > 0) insights.push(`${overdue} follow-ups are overdue.`);

    return {
        volumeTrend,
        bySource,
        byCity,
        byService,
        funnel,
        insights,
        conversionRate: leads.length > 0 ? (convertedCount / leads.length) * 100 : 0
    };
}
