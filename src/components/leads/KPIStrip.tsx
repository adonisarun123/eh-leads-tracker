import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserPlus, Clock, Calculator } from 'lucide-react';

interface KPIStats {
    totalLeads: number;
    newLeads: number; // last 7 days
    unassigned: number;
    overdue: number;
    conversionRate: number;
}

export function KPIStrip({ stats }: { stats: KPIStats }) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.totalLeads}</div>
                    <p className="text-xs text-muted-foreground">
                        {stats.newLeads} new in last 7 days
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Unassigned</CardTitle>
                    <UserPlus className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.unassigned}</div>
                    <p className="text-xs text-muted-foreground">
                        Requires attention
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Overdue Follow-ups</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.overdue}</div>
                    <p className="text-xs text-muted-foreground">
                        Need action today
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                    <Calculator className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.conversionRate}%</div>
                    <p className="text-xs text-muted-foreground">
                        Last 30 days
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
