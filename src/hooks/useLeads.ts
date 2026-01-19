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
            let query = supabase
                .from('leads')
                .select('*', { count: 'exact' });

            // Apply Filters
            if (filters.status && filters.status.length > 0) {
                query = query.in('status', filters.status);
            }
            if (filters.search) {
                const searchTerm = `%${filters.search}%`;
                // Search across name, email, phone, notes
                query = query.or(`name.ilike.${searchTerm},email.ilike.${searchTerm},phone.ilike.${searchTerm},notes.ilike.${searchTerm}`);
            }
            if (filters.city && filters.city.length > 0) {
                query = query.in('city', filters.city);
            }
            if (filters.source && filters.source.length > 0) {
                query = query.in('source', filters.source);
            }
            if (filters.service_required && filters.service_required.length > 0) {
                query = query.in('service_required', filters.service_required);
            }
            if (filters.assigned_to && filters.assigned_to.length > 0) {
                query = query.in('assigned_to', filters.assigned_to);
            }
            if (filters.priority && filters.priority.length > 0) {
                query = query.in('priority', filters.priority);
            }
            if (filters.dateRange) {
                if (filters.dateRange.from) query = query.gte('created_at', filters.dateRange.from.toISOString());
                if (filters.dateRange.to) query = query.lte('created_at', filters.dateRange.to.toISOString());
            }
            if (filters.overdue) {
                query = query.lt('next_followup_at', new Date().toISOString());
            }

            // Attention Needed: Overdue OR (High Priority AND Unassigned)
            if (filters.attention) {
                // This is complex in logic, standard Supabase query might need 'or' with groups which is tricky in JS client chain.
                // Simplified: Fetch logic or use raw params. 
                // Let's implement specific: "overdue OR (priority=High AND assigned_to=null)"
                // Supabase JS 'or' accepts logic.
                // query.or('next_followup_at.lt.now,and(priority.eq.High,assigned_to.is.null)')
                const now = new Date().toISOString();
                const orQuery = `next_followup_at.lt.${now},and(priority.eq.High,assigned_to.is.null)`;
                query = query.or(orQuery);
            }

            // Pagination
            const from = page * pageSize;
            const to = from + pageSize - 1;
            query = query.range(from, to);

            // Default Sort
            query = query.order('created_at', { ascending: false });

            const { data, error, count } = await query;

            if (error) {
                throw error;
            }

            return { data: data as Lead[], count };
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
        mutationFn: async ({ id, updates }: { id: string; updates: Partial<Lead> }) => {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('leads')
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
