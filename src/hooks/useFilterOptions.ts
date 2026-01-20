import { Lead } from '@/types';
import { useMemo } from 'react';

export function useFilterOptions(leads: Lead[] | undefined) {
    return useMemo(() => {
        if (!leads || leads.length === 0) {
            return {
                cities: [],
                sources: [],
                services: [],
            };
        }

        const citiesSet = new Set<string>();
        const sourcesSet = new Set<string>();
        const servicesSet = new Set<string>();

        leads.forEach(lead => {
            if (lead.city) citiesSet.add(lead.city);
            if (lead.source) sourcesSet.add(lead.source);
            if (lead.service_required) servicesSet.add(lead.service_required);
        });

        return {
            cities: Array.from(citiesSet).sort(),
            sources: Array.from(sourcesSet).sort(),
            services: Array.from(servicesSet).sort(),
        };
    }, [leads]);
}
