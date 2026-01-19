'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { AnalyticsFilters } from '@/hooks/useAnalytics';

interface AnalyticsToolbarProps {
    filters: AnalyticsFilters;
    onFilterChange: (filters: AnalyticsFilters) => void;
}

const CITIES = ['Bangalore', 'Hyderabad', 'Mumbai', 'Delhi', 'Chennai', 'Pune'];
const SERVICES = ['Maid', 'Cook', 'Nanny', 'Elder care', 'Patient Care', 'Babysitter'];

export function AnalyticsToolbar({ filters, onFilterChange }: AnalyticsToolbarProps) {
    // Fully controlled component
    const date = filters.dateRange;

    const handleDateSelect = (range: DateRange | undefined) => {
        // cast range to any or compatible type if needed, but since we updated AnalyticsFilters to be optional, it fits generally
        // Actually DateRange is { from: ..., to: ... } where from is required but can be undefined in some versions or usually defined.
        // We will just pass it.
        onFilterChange({ ...filters, dateRange: range as any });
    };

    const handleCityChange = (val: string) => {
        onFilterChange({ ...filters, city: val === 'all' ? undefined : val });
    };

    const handleServiceChange = (val: string) => {
        onFilterChange({ ...filters, service: val === 'all' ? undefined : val });
    };

    return (
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-lg border shadow-sm">
            <div className="flex flex-1 flex-col sm:flex-row gap-2 w-full">
                {/* Date Range Picker */}
                <div className="grid gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                id="date"
                                variant={"outline"}
                                className={cn(
                                    "w-[260px] justify-start text-left font-normal",
                                    !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date?.from ? (
                                    date.to ? (
                                        <>
                                            {format(date.from, "LLL dd, y")} -{" "}
                                            {format(date.to, "LLL dd, y")}
                                        </>
                                    ) : (
                                        format(date.from, "LLL dd, y")
                                    )
                                ) : (
                                    <span>Pick a date range</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={date?.from}
                                selected={date as DateRange}
                                onSelect={handleDateSelect}
                                numberOfMonths={2}
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                {/* City Select */}
                <Select value={filters.city || 'all'} onValueChange={handleCityChange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All Cities" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Cities</SelectItem>
                        {CITIES.map((city) => (
                            <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Service Select */}
                <Select value={filters.service || 'all'} onValueChange={handleServiceChange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All Services" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Services</SelectItem>
                        {SERVICES.map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Button
                    variant="ghost"
                    onClick={() => {
                        onFilterChange({});
                    }}
                    className="px-2 lg:px-3"
                >
                    Reset
                </Button>
            </div>
        </div>
    );
}
