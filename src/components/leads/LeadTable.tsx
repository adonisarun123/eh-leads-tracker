'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Lead } from '@/types';
import { LeadActions } from './LeadActions';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { calculateLeadScore, getScoreColor } from '@/lib/scoring';

interface LeadTableProps {
    leads: Lead[];
}

export function LeadTable({ leads }: LeadTableProps) {
    if (leads.length === 0) {
        return <div className="p-8 text-center text-muted-foreground">No leads found.</div>;
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Created</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead className="hidden md:table-cell">City</TableHead>
                        <TableHead className="hidden md:table-cell">Score</TableHead>
                        <TableHead className="hidden md:table-cell">Priority</TableHead>
                        <TableHead className="hidden lg:table-cell">Assigned To</TableHead>
                        <TableHead className="hidden lg:table-cell">Next Follow-up</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {leads.map((lead) => (
                        <TableRow key={lead.id}>
                            <TableCell className="font-medium whitespace-nowrap text-xs text-muted-foreground">
                                {lead.created_at ? formatDistanceToNow(parseISO(lead.created_at), { addSuffix: true }) : '-'}
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="font-semibold">{lead.name}</span>
                                    <span className="text-xs text-muted-foreground md:hidden">{lead.phone}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <StatusBadge status={lead.status} />
                            </TableCell>
                            <TableCell className="text-sm">{lead.source}</TableCell>
                            <TableCell className="text-sm">{lead.service_required}</TableCell>
                            <TableCell className="hidden md:table-cell">{lead.city}</TableCell>
                            <TableCell className="hidden md:table-cell">
                                <span className={getScoreColor(calculateLeadScore(lead))}>
                                    {calculateLeadScore(lead)}
                                </span>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                                <PriorityBadge priority={lead.priority} />
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">{lead.assigned_to || 'Unassigned'}</TableCell>
                            <TableCell className="hidden lg:table-cell">
                                {lead.next_followup_at ? formatDistanceToNow(parseISO(lead.next_followup_at), { addSuffix: true }) : '-'}
                            </TableCell>
                            <TableCell className="text-right">
                                <LeadActions lead={lead} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    let variant: "default" | "secondary" | "destructive" | "outline" = "outline";
    const styles = "whitespace-nowrap";

    switch (status) {
        case 'New': variant = "default"; break;
        case 'Contacted': variant = "secondary"; break;
        case 'Converted': variant = "default"; break; // Maybe green?
        case 'Lost': variant = "destructive"; break;
        default: variant = "outline";
    }

    // To customize colors further we can use classes directly instead of variants
    const colorMap: Record<string, string> = {
        'New': 'bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200',
        'Contacted': 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200',
        'Qualified': 'bg-purple-100 text-purple-800 hover:bg-purple-100 border-purple-200',
        'Trial Scheduled': 'bg-indigo-100 text-indigo-800 hover:bg-indigo-100 border-indigo-200',
        'Converted': 'bg-green-100 text-green-800 hover:bg-green-100 border-green-200',
        'Lost': 'bg-red-100 text-red-800 hover:bg-red-100 border-red-200',
    };

    return <Badge variant="outline" className={cn(styles, colorMap[status])}>{status}</Badge>;
}

function PriorityBadge({ priority }: { priority: string }) {
    const colorMap: Record<string, string> = {
        'High': 'text-red-600 border-red-200 bg-red-50',
        'Medium': 'text-orange-600 border-orange-200 bg-orange-50',
        'Low': 'text-slate-600 border-slate-200 bg-slate-50',
    };
    return <Badge variant="outline" className={cn(colorMap[priority])}>{priority}</Badge>;
}
