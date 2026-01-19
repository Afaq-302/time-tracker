import { Card, CardContent } from './card';
import { cn } from '@/lib/utils';

export function StatCard({ title, value, subtitle, icon: Icon, trend, className }) {
  return (
    <Card className={cn("card-hover", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
            {trend && (
              <p className={cn(
                "text-sm font-medium",
                trend.positive ? "text-success" : "text-destructive"
              )}>
                {trend.positive ? '+' : ''}{trend.value}% from last week
              </p>
            )}
          </div>
          {Icon && (
            <div className="rounded-lg bg-primary/10 p-2.5">
              <Icon className="h-5 w-5 text-primary" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
