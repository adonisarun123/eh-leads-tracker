'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
    return (
        <div className="container py-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Manage application configurations.</p>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Supabase Connection</CardTitle>
                        <CardDescription>
                            Environment variables for database connection. Read-only.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label>Supabase URL</Label>
                            <Input readOnly value={process.env.NEXT_PUBLIC_SUPABASE_URL} className="bg-muted" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Dropdown Configurations</CardTitle>
                        <CardDescription>
                            Lead statuses, sources, and priorities used across the app.
                            <br />
                            <span className="text-xs text-muted-foreground">To modify these, update the `settings` table in Supabase.</span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>Lead Statuses</Label>
                            <div className="flex flex-wrap gap-2">
                                {['New', 'Contacted', 'Qualified', 'Trial Scheduled', 'Converted', 'Lost'].map(s => (
                                    <Badge key={s} variant="secondary">{s}</Badge>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Sources</Label>
                            <div className="flex flex-wrap gap-2">
                                {['Website', 'WhatsApp', 'Referral', 'Ads', 'Walk-in'].map(s => (
                                    <Badge key={s} variant="outline">{s}</Badge>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Service Types</Label>
                            <div className="flex flex-wrap gap-2">
                                {['Maid', 'Cook', 'Nanny', 'Elder care'].map(s => (
                                    <Badge key={s} variant="outline">{s}</Badge>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
