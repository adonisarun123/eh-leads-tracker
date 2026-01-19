'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { Lead } from '@/types';
import { useUpdateLead } from '@/hooks/useLeads';
import { toast } from 'sonner';

interface EditLeadDialogProps {
    lead: Lead;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

interface FormData {
    budget: string;
    startDate: Date | undefined;
    nextFollowUp: Date | undefined;
}

export function EditLeadDialog({ lead, open, onOpenChange }: EditLeadDialogProps) {
    const { mutate: updateLead, isPending } = useUpdateLead();

    // Initialize state with lead data
    const [budget, setBudget] = useState(lead.budget || '');
    const [startDate, setStartDate] = useState<Date | undefined>(lead.startDate ? new Date(lead.startDate) : undefined);
    const [nextFollowUp, setNextFollowUp] = useState<Date | undefined>(lead.next_followup_at ? new Date(lead.next_followup_at) : undefined);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const updates: Partial<Lead> = {
            budget: budget,
            startDate: startDate ? startDate.toISOString() : null as any, // Handle removing date if needed, though UI specific
            next_followup_at: nextFollowUp ? nextFollowUp.toISOString() : null as any
        };

        // Clean up undefined/nulls if API doesn't like them or strict types
        if (!startDate) delete updates.startDate;
        if (!nextFollowUp) delete updates.next_followup_at;
        if (!budget) delete updates.budget;

        updateLead(
            { id: lead.id, updates, source_table: lead.source_table },
            {
                onSuccess: () => {
                    toast.success('Lead updated successfully');
                    onOpenChange(false);
                },
                onError: (error) => {
                    toast.error(`Failed to update lead: ${error.message}`);
                }
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Lead Details</DialogTitle>
                    <DialogDescription>
                        Update key information for {lead.name}.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="budget" className="text-right">
                            Budget
                        </Label>
                        <Input
                            id="budget"
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                            className="col-span-3"
                            placeholder="e.g. 15k-20k"
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Start Date</Label>
                        <div className="col-span-3">
                            <DatePicker date={startDate} setDate={setStartDate} />
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Next Follow-up</Label>
                        <div className="col-span-3">
                            <DatePicker date={nextFollowUp} setDate={setNextFollowUp} />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function DatePicker({ date, setDate }: { date: Date | undefined; setDate: (d: Date | undefined) => void }) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
}
