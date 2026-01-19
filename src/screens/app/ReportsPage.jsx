"use client";

import { useMemo, useState } from 'react';
import { Download, Calendar, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { ProjectBadge } from '@/components/ui/ProjectBadge';
import { useData } from '@/context/DataContext';
import { exportToCSV } from '@/lib/csv';
import { formatDurationShort, getStartOfDay, getStartOfWeek, getStartOfMonth } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

export default function ReportsPage() {
  const { projects, entries } = useData();
  const [dateRange, setDateRange] = useState('week');

  const stats = useMemo(() => {
    const now = new Date();
    const todayStart = getStartOfDay(now);
    const weekStart = getStartOfWeek(now);
    const monthStart = getStartOfMonth(now);

    let rangeStart;
    switch (dateRange) {
      case 'week':
        rangeStart = weekStart;
        break;
      case 'month':
        rangeStart = monthStart;
        break;
      default:
        rangeStart = new Date(0);
    }

    const filteredEntries = entries.filter(e => new Date(e.startTime) >= rangeStart);

    const totalSeconds = filteredEntries.reduce((sum, e) => sum + e.duration, 0);
    const billableSeconds = filteredEntries.filter(e => e.billable).reduce((sum, e) => sum + e.duration, 0);
    
    // Calculate earnings
    let totalEarnings = 0;
    filteredEntries.forEach(entry => {
      if (entry.billable) {
        const project = projects.find(p => p.id === entry.projectId);
        if (project?.hourlyRate) {
          totalEarnings += (entry.duration / 3600) * project.hourlyRate;
        }
      }
    });

    // By project
    const byProject = filteredEntries.reduce((acc, entry) => {
      acc[entry.projectId] = (acc[entry.projectId] || 0) + entry.duration;
      return acc;
    }, {});

    const projectStats = Object.entries(byProject)
      .map(([projectId, seconds]) => ({
        project: projects.find(p => p.id === projectId),
        seconds,
        percentage: totalSeconds > 0 ? (seconds / totalSeconds) * 100 : 0,
      }))
      .filter(p => p.project)
      .sort((a, b) => b.seconds - a.seconds);

    // By day (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      return date;
    }).reverse();

    const dailyStats = last7Days.map(date => {
      const dayEnd = new Date(date);
      dayEnd.setDate(dayEnd.getDate() + 1);
      
      const dayEntries = entries.filter(e => {
        const entryDate = new Date(e.startTime);
        return entryDate >= date && entryDate < dayEnd;
      });

      return {
        date,
        seconds: dayEntries.reduce((sum, e) => sum + e.duration, 0),
      };
    });

    const maxDailySeconds = Math.max(...dailyStats.map(d => d.seconds), 1);

    return {
      totalTime: formatDurationShort(totalSeconds),
      billableTime: formatDurationShort(billableSeconds),
      totalEarnings: `$${totalEarnings.toFixed(2)}`,
      entriesCount: filteredEntries.length,
      projectStats,
      dailyStats,
      maxDailySeconds,
      filteredEntries,
    };
  }, [entries, projects, dateRange]);

  const handleExport = () => {
    exportToCSV(stats.filteredEntries, projects);
    toast({
      title: 'Export successful',
      description: 'Your time entries have been downloaded as CSV.',
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Reports"
        description="Analyze your time tracking data"
        action={
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        }
      />

      {/* Date Range Filter */}
      <div className="flex justify-end">
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Time" value={stats.totalTime} icon={Calendar} />
        <StatCard title="Billable Time" value={stats.billableTime} icon={TrendingUp} />
        <StatCard title="Earnings" value={stats.totalEarnings} icon={TrendingUp} />
        <StatCard title="Entries" value={stats.entriesCount.toString()} icon={Calendar} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* By Project */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Time by Project</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.projectStats.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-6">
                No data for this period.
              </p>
            ) : (
              stats.projectStats.map(({ project, seconds, percentage }) => (
                <div key={project.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <ProjectBadge name={project.name} color={project.color} />
                    <span className="text-sm font-medium">{formatDurationShort(seconds)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: project.color,
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Daily Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Last 7 Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between h-48 gap-2">
              {stats.dailyStats.map((day, i) => {
                const heightPercent = (day.seconds / stats.maxDailySeconds) * 100;
                const dayName = day.date.toLocaleDateString('en-US', { weekday: 'short' });
                const isToday = day.date.toDateString() === new Date().toDateString();
                
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div className="flex-1 w-full flex items-end">
                      <div
                        className={`w-full rounded-t-md transition-all duration-500 ${
                          isToday ? 'bg-primary' : 'bg-primary/40'
                        }`}
                        style={{ height: `${Math.max(heightPercent, 4)}%` }}
                      />
                    </div>
                    <span className={`text-xs ${isToday ? 'font-semibold text-primary' : 'text-muted-foreground'}`}>
                      {dayName}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
