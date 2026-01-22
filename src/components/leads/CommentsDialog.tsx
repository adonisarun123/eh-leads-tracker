'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Lead } from '@/types';
import { useUpdateLead } from '@/hooks/useLeads';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface CommentsDialogProps {
    lead: Lead;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CommentsDialog({ lead, open, onOpenChange }: CommentsDialogProps) {
    const [notes, setNotes] = useState(lead.notes || '');
    const { mutate: updateLead, isPending } = useUpdateLead();

    const handleSave = () => {
        updateLead(
            {
                id: lead.id,
                updates: { notes },
                source_table: lead.source_table
            },
            {
                onSuccess: () => {
                    toast.success('Comments saved successfully');
                    onOpenChange(false);
                },
                onError: () => {
                    toast.error('Failed to save comments');
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Comments &amp; Notes</DialogTitle>
                    <DialogDescription>
                        Add comments and notes for <strong>{lead.name}</strong>
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            id="notes"
                            placeholder="Add your comments and notes here..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={10}
                            className="resize-none"
                        />
                        <p className="text-xs text-muted-foreground">
                            Keep track of conversations, important details, and follow-up tasks.
                        </p>
                    </div>

                    {lead.message && (
                        <div className="grid gap-2">
                            <Label>Original Message</Label>
                            <div className="p-3 bg-muted rounded-md text-sm">
                                {lead.message}
                            </div>
                        </div>
                    )}

                    {lead.specificRequirements && (
                        <div className="grid gap-2">
                            <Label>Specific Requirements</Label>
                            <div className="p-3 bg-muted rounded-md text-sm">
                                {lead.specificRequirements}
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Comments
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
