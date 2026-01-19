'use client';

import { useState } from 'react';
import { useLeads, useLeadsSubscription } from '@/hooks/useLeads';
import { useLeadStats } from '@/hooks/useLeadStats';
import { KPIStrip } from '@/components/leads/KPIStrip';
import { LeadFilters } from '@/components/leads/LeadFilters';
import { LeadTable } from '@/components/leads/LeadTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LeadFilterParams, LeadStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Loader2, Plus } from 'lucide-react';

export default function LeadsPage() {
    const [filters, setFilters] = useState<LeadFilterParams>({});
    const [activeTab, setActiveTab] = useState<string>('all');
    const [page, setPage] = useState(0);

    // Combine tab selection with filters
    const activeFilters = { ...filters };
    if (activeTab !== 'all') {
        activeFilters.status = [activeTab as LeadStatus];
    }

    useLeadsSubscription();

    const { data, isLoading, isError, error } = useLeads(activeFilters, page);

    // Calculate real stats from actual lead data
    const stats = useLeadStats(data?.data, data?.count || 0);

    const handleTabChange = (val: string) => {
        setActiveTab(val);
        setPage(0); // Reset page on tab change
    };

    return (
        <div className="container py-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Leads Dashboard</h1>
                    <p className="text-muted-foreground">Manage your pipeline and track conversions.</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add New Lead
                </Button>
            </div>

            <KPIStrip stats={stats} />

            <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <TabsList className="w-full md:w-auto overflow-x-auto justify-start">
                        <TabsTrigger value="all">All Leads</TabsTrigger>
                        <TabsTrigger value="New">New</TabsTrigger>
                        <TabsTrigger value="Contacted">Contacted</TabsTrigger>
                        <TabsTrigger value="Qualified">Qualified</TabsTrigger>
                        <TabsTrigger value="Trial Scheduled">Trail Scheduled</TabsTrigger>
                        <TabsTrigger value="Converted">Converted</TabsTrigger>
                        <TabsTrigger value="Lost">Lost</TabsTrigger>
                    </TabsList>
                </div>

                <div className="mt-4">
                    <LeadFilters filters={filters} onFilterChange={setFilters} />
                </div>

                <TabsContent value={activeTab} className="mt-0">
                    {isLoading ? (
                        <div className="flex items-center justify-center p-12">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : isError ? (
                        <div className="p-8 text-center text-red-500">
                            Error loading leads: {(error as Error).message}
                        </div>
                    ) : (
                        <>
                            <LeadTable leads={data?.data || []} />
                            <div className="flex items-center justify-end gap-2 py-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(p => Math.max(0, p - 1))}
                                    disabled={page === 0}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(p => p + 1)}
                                    disabled={!data || data.data.length < 20}
                                >
                                    Next
                                </Button>
                            </div>
                        </>
                    )}
                </TabsContent>
                {/* We reuse the same content area for all tabs as we control the filter via state */}
                <TabsContent value="New"></TabsContent>
                <TabsContent value="Contacted"></TabsContent>
                <TabsContent value="Qualified"></TabsContent>
                <TabsContent value="Trial Scheduled"></TabsContent>
                <TabsContent value="Converted"></TabsContent>
                <TabsContent value="Lost"></TabsContent>

            </Tabs>
        </div>
    );
}
