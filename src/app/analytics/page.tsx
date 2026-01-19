'use client';

import { useAnalytics } from '@/hooks/useAnalytics';
import { AnalyticsCharts } from '@/components/analytics/AnalyticsCharts';
import { Insights } from '@/components/analytics/Insights';
import { Loader2 } from 'lucide-react';

export default function AnalyticsPage() {
    const { data, isLoading, error } = useAnalytics();

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-center text-red-500">
                Error loading analytics: {(error as Error).message}
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="container py-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                <p className="text-muted-foreground">Insights and performance metrics for the last 30 days.</p>
            </div>

            <Insights insights={data.insights} />
            <AnalyticsCharts data={data} />
        </div>
    );
}
