'use client';

import { useAnalytics, AnalyticsFilters } from '@/hooks/useAnalytics';
import { AnalyticsCharts } from '@/components/analytics/AnalyticsCharts';
import { Insights } from '@/components/analytics/Insights';
import { AnalyticsToolbar } from '@/components/analytics/AnalyticsToolbar';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function AnalyticsPage() {
    const [filters, setFilters] = useState<AnalyticsFilters>({});
    const { data, isLoading, error } = useAnalytics(filters);

    if (error) {
        return (
            <div className="p-8 text-center text-red-500">
                Error loading analytics: {(error as Error).message}
            </div>
        );
    }

    return (
        <div className="container py-6 space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                    <p className="text-muted-foreground">Insights and performance metrics.</p>
                </div>
            </div>

            <AnalyticsToolbar filters={filters} onFilterChange={setFilters} />

            {isLoading ? (
                <div className="flex h-[50vh] items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : data ? (
                <>
                    <Insights insights={data.insights} />
                    <AnalyticsCharts data={data} />
                </>
            ) : null}
        </div>
    );
}
