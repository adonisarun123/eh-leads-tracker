'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { LeadFilterParams, LeadPriority, LeadStatus } from '@/types';
import { Search, X } from 'lucide-react';
import { useState } from 'react';

// TODO: Move these to a constants file or fetch from DB
const STATUS_OPTIONS: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Trial Scheduled', 'Converted', 'Lost'];
const PRIORITY_OPTIONS: LeadPriority[] = ['High', 'Medium', 'Low'];
const SOURCE_OPTIONS = ['Website', 'WhatsApp', 'Referral', 'Ads', 'Walk-in'];
const SERVICE_OPTIONS = ['Maid', 'Cook', 'Nanny', 'Elder care'];

interface LeadFiltersProps {
    filters: LeadFilterParams;
    onFilterChange: (filters: LeadFilterParams) => void;
    cities?: string[];
    sources?: string[];
    services?: string[];
}

export function LeadFilters({ filters, onFilterChange, cities = [], sources = [], services = [] }: LeadFiltersProps) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = () => {
        onFilterChange({ ...filters, search });
    };

    const clearFilters = () => {
        setSearch('');
        onFilterChange({});
    };

    return (
        <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col xl:flex-row gap-4">
                <div className="flex w-full xl:w-auto gap-2">
                    <Input
                        placeholder="Search leads..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        className="w-full md:w-[300px]"
                    />
                    <Button variant="outline" size="icon" onClick={handleSearch}>
                        <Search className="h-4 w-4" />
                    </Button>
                </div>
                <div className="flex flex-1 flex-wrap items-center gap-2">
                    <Select
                        value={filters.city?.[0] || 'all'}
                        onValueChange={(val) => onFilterChange({ ...filters, city: val === 'all' ? undefined : [val] })}
                    >
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="All Cities" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Cities</SelectItem>
                            {cities.map((city) => (
                                <SelectItem key={city} value={city}>{city}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters.source?.[0] || 'all'}
                        onValueChange={(val) => onFilterChange({ ...filters, source: val === 'all' ? undefined : [val] })}
                    >
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="All Sources" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Sources</SelectItem>
                            {(sources.length > 0 ? sources : SOURCE_OPTIONS).map(opt => (
                                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters.service_required?.[0] || 'all'}
                        onValueChange={(val) => onFilterChange({ ...filters, service_required: val === 'all' ? undefined : [val] })}
                    >
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="All Services" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Services</SelectItem>
                            {(services.length > 0 ? services : SERVICE_OPTIONS).map(opt => (
                                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters.priority?.[0] || 'all'}
                        onValueChange={(val) => onFilterChange({ ...filters, priority: val === 'all' ? undefined : [val as LeadPriority] })}
                    >
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="All Priorities" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Priorities</SelectItem>
                            {PRIORITY_OPTIONS.map(opt => (
                                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button
                        variant={filters.attention ? "destructive" : "outline"}
                        onClick={() => onFilterChange({ ...filters, attention: !filters.attention })}
                    >
                        Attention Needed
                    </Button>

                    <Button variant="ghost" onClick={clearFilters} className="px-2 lg:px-3 ml-auto">
                        Reset
                        <X className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
