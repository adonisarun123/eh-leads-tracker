import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import { Lead, LeadFilterParams } from '@/types';
import { useEffect } from 'react';
import { toast } from 'sonner';

export function useLeads(filters: LeadFilterParams, page: number = 0, pageSize: number = 20) {
    return useQuery({
        queryKey: ['leads', filters, page],
        queryFn: async () => {
            const supabase = createClient();

            // Fetch from both tables in parallel
            const [leadsResponse, hireResponse] = await Promise.all([
                supabase.from('leads').select('*'),
                supabase.from('hire_helper_leads').select('*')
            ]);

            if (leadsResponse.error) throw leadsResponse.error;
            if (hireResponse.error) throw hireResponse.error;

            // Normalize and Merge
            const normalizeLead = (row: any, sourceTable: 'leads' | 'hire_helper_leads'): Lead => {
                // Capitalize status if needed (e.g. 'new' -> 'New')
                const status = row.status ? row.status.charAt(0).toUpperCase() + row.status.slice(1).toLowerCase() : 'New';

                return {
                    ...row,
                    id: row.id.toString(), // Ensure ID is string
                    service_required: row.service, // Map service -> service_required
                    status: status,
                    source_table: sourceTable,
                    // Ensure other fields match Lead interface if necessary
                    priority: row.priority || 'Medium', // Default priority
                };
            };

            const leadsData = (leadsResponse.data || []).map(l => normalizeLead(l, 'leads'));
            const hireData = (hireResponse.data || []).map(l => normalizeLead(l, 'hire_helper_leads'));

            let allLeads = [...leadsData, ...hireData];

            // Apply Filters (In-Memory)
            if (filters.status && filters.status.length > 0) {
                allLeads = allLeads.filter(l => filters.status?.includes(l.status as any));
            }
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                allLeads = allLeads.filter(l =>
                    l.name.toLowerCase().includes(searchLower) ||
                    l.email?.toLowerCase().includes(searchLower) ||
                    l.phone?.toLowerCase().includes(searchLower) ||
                    l.city?.toLowerCase().includes(searchLower)
                );
            }
            if (filters.city && filters.city.length > 0) {
                allLeads = allLeads.filter(l => filters.city?.includes(l.city || ''));
            }
            if (filters.source && filters.source.length > 0) {
                allLeads = allLeads.filter(l => filters.source?.includes(l.source || ''));
            }
            if (filters.service_required && filters.service_required.length > 0) {
                allLeads = allLeads.filter(l => filters.service_required?.includes(l.service_required || ''));
            }
            // Assigned To filter skipped for simplicity unless strict requirement
            // Priority filter
            if (filters.priority && filters.priority.length > 0) {
                allLeads = allLeads.filter(l => filters.priority?.includes(l.priority as any));
            }

            // Date Range
            if (filters.dateRange) {
                if (filters.dateRange.from) {
                    const fromTime = filters.dateRange.from.getTime();
                    allLeads = allLeads.filter(l => new Date(l.created_at).getTime() >= fromTime);
                }
                if (filters.dateRange.to) {
                    const toTime = filters.dateRange.to.getTime();
                    allLeads = allLeads.filter(l => new Date(l.created_at).getTime() <= toTime);
                }
            }

            // Attention Needed
            if (filters.attention) {
                const now = new Date().getTime();
                allLeads = allLeads.filter(l => {
                    const isOverdue = l.next_followup_at ? new Date(l.next_followup_at).getTime() < now : false;
                    const isUrgentUnassigned = l.priority === 'High' && !l.assigned_to;
                    return isOverdue || isUrgentUnassigned;
                });
            }

            // Sorting (Created At Descending)
            allLeads.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

            // Pagination
            const totalCount = allLeads.length;
            const from = page * pageSize;
            const to = from + pageSize;
            const paginatedLeads = allLeads.slice(from, to);

            return { data: paginatedLeads, count: totalCount };
        },
    });
}

export function useLead(id: string) {
    return useQuery({
        queryKey: ['lead', id],
        queryFn: async () => {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('leads')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data as Lead;
        },
        enabled: !!id,
    });
}

export function useUpdateLead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, updates, source_table }: { id: string; updates: Partial<Lead>; source_table?: 'leads' | 'hire_helper_leads' }) => {
            const supabase = createClient();
            const table = source_table || 'leads';
            const { data, error } = await supabase
                .from(table)
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['leads'] });
            queryClient.invalidateQueries({ queryKey: ['lead', data.id] });
        },
    });
}

export function useCreateLead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>) => {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('leads')
                .insert(lead)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leads'] });
        },
    });
}

export function useLeadsSubscription() {
    const queryClient = useQueryClient();

    useEffect(() => {
        // Request notification permission on mount
        if (typeof window !== 'undefined' && 'Notification' in window) {
            if (Notification.permission === 'default') {
                Notification.requestPermission();
            }
        }

        const supabase = createClient();
        const channel = supabase
            .channel('leads-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'leads',
                },
                (payload) => {
                    // Invalidate relevant queries to refresh data immediately
                    queryClient.invalidateQueries({ queryKey: ['leads'] });

                    if (payload.eventType === 'INSERT') {
                        const newLead = payload.new as Lead;
                        toast.info(`New Lead: ${newLead.name}`);

                        // Trigger Browser Notification
                        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
                            new Notification('New Lead Arrived!', {
                                body: `${newLead.name} from ${newLead.source} | ${newLead.service_required}`,
                                icon: '/favicon.ico' // Assuming default nextjs favicon exists
                            });
                        }
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [queryClient]);
}
