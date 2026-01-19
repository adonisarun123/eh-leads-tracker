'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, Pencil, Phone, CalendarClock, UserPlus } from 'lucide-react';
import { Lead, LeadStatus } from '@/types';
import { useUpdateLead } from '@/hooks/useLeads';
import { toast } from 'sonner';

interface LeadActionsProps {
    lead: Lead;
}

const STATUSES: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Trial Scheduled', 'Converted', 'Lost'];

export function LeadActions({ lead }: LeadActionsProps) {
    const { mutate: updateLead } = useUpdateLead();

    const handleStatusChange = (status: string) => {
        updateLead(
            { id: lead.id, updates: { status: status as LeadStatus }, source_table: lead.source_table },
            {
                onSuccess: () => toast.success(`Status updated to ${status}`),
                onError: () => toast.error('Failed to update status'),
            }
        );
    };

    const handleMarkContacted = () => {
        updateLead(
            {
                id: lead.id,
                updates: { last_contacted_at: new Date().toISOString(), status: 'Contacted' },
                source_table: lead.source_table
            },
            {
                onSuccess: () => toast.success('Marked as contacted'),
                onError: () => toast.error('Failed to update'),
            }
        );
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(lead.phone)}>
                    Copy Phone
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>
                    <Eye className="mr-2 h-4 w-4" /> View Details
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                    <Pencil className="mr-2 h-4 w-4" /> Edit Lead
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={handleMarkContacted}>
                    <Phone className="mr-2 h-4 w-4" /> Mark Contacted
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                    <CalendarClock className="mr-2 h-4 w-4" /> Schedule Follow-up
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Change Status</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                        <DropdownMenuRadioGroup value={lead.status} onValueChange={handleStatusChange}>
                            {STATUSES.map((status) => (
                                <DropdownMenuRadioItem key={status} value={status}>
                                    {status}
                                </DropdownMenuRadioItem>
                            ))}
                        </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                </DropdownMenuSub>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
