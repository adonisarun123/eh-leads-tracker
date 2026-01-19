import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, TrendingUp, AlertCircle } from 'lucide-react';

export function Insights({ insights }: { insights: string[] }) {
    if (insights.length === 0) return null;

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {insights.map((insight, idx) => (
                <Card key={idx} className="bg-muted/50 border-primary/20">
                    <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                        <Lightbulb className="h-5 w-5 text-yellow-500" />
                        <CardTitle className="text-sm font-medium">Insight</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm">{insight}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
