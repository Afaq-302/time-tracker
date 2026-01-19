"use client";

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Clock, FolderKanban, TrendingUp, Plus, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { TimerWidget } from '@/components/timer/TimerWidget';
import { ProjectBadge } from '@/components/ui/ProjectBadge';
import { useData } from '@/context/DataContext';
import { useTimer } from '@/hooks/useTimer';
import { formatDurationShort, formatDateShort, getStartOfDay, getStartOfWeek } from '@/lib/utils';
import { EntryFormDialog } from '@/components/entries/EntryFormDialog';

export default function DashboardPage() {
  const { projects, entries, addEntry } = useData();
  const timer = useTimer(addEntry);
  const [manualOpen, setManualOpen] = useState(false);

  const stats = useMemo(() => {
    const now = new Date();
    const todayStart = getStartOfDay(now);
    const weekStart = getStartOfWeek(now);

    const todayEntries = entries.filter(e => new Date(e.startTime) >= todayStart);
    const weekEntries = entries.filter(e => new Date(e.startTime) >= weekStart);

    const todaySeconds = todayEntries.reduce((sum, e) => sum + e.duration, 0);
    const weekSeconds = weekEntries.reduce((sum, e) => sum + e.duration, 0);

    const activeProjects = projects.filter(p => p.status === 'active');

    return {
      todayTime: formatDurationShort(todaySeconds),
      weekTime: formatDurationShort(weekSeconds),
      activeProjects: activeProjects.length,
      todayEntries: todayEntries.length,
    };
  }, [entries, projects]);

  const recentEntries = useMemo(() => {
    return entries.slice(0, 5).map(entry => ({
      ...entry,
      project: projects.find(p => p.id === entry.projectId),
    }));
  }, [entries, projects]);

  const projectStats = useMemo(() => {
    const weekStart = getStartOfWeek(new Date());
    const weekEntries = entries.filter(e => new Date(e.startTime) >= weekStart);

    const byProject = weekEntries.reduce((acc, entry) => {
      acc[entry.projectId] = (acc[entry.projectId] || 0) + entry.duration;
      return acc;
    }, {});

    return Object.entries(byProject)
      .map(([projectId, seconds]) => ({
        project: projects.find(p => p.id === projectId),
        seconds,
      }))
      .filter(p => p.project)
      .sort((a, b) => b.seconds - a.seconds)
      .slice(0, 5);
  }, [entries, projects]);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Dashboard"
        description="Track your time and see your progress"
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setManualOpen(true)}>
              Add Manual Entry
            </Button>
            <Button asChild>
              <Link href="/timer">
                <Plus className="h-4 w-4 mr-2" />
                Start Timer
              </Link>
            </Button>
          </div>
        }
      />

      {/* Timer Widget */}
      <TimerWidget
        elapsed={timer.elapsed}
        isRunning={timer.isRunning}
        isPaused={timer.isPaused}
        projectId={timer.projectId}
        description={timer.description}
        billable={timer.billable}
        projects={projects}
        onStart={timer.start}
        onPause={timer.pause}
        onResume={timer.resume}
        onStop={timer.stop}
        onDiscard={timer.discard}
        onUpdateDescription={timer.updateDescription}
        onUpdateProject={timer.updateProject}
        onUpdateBillable={timer.updateBillable}
        variant="compact"
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Today"
          value={stats.todayTime}
          subtitle={`${stats.todayEntries} entries`}
          icon={Clock}
        />
        <StatCard
          title="This Week"
          value={stats.weekTime}
          icon={TrendingUp}
        />
        <StatCard
          title="Active Projects"
          value={stats.activeProjects.toString()}
          icon={FolderKanban}
        />
        <StatCard
          title="Billable This Week"
          value={formatDurationShort(
            entries
              .filter(e => e.billable && new Date(e.startTime) >= getStartOfWeek(new Date()))
              .reduce((sum, e) => sum + e.duration, 0)
          )}
          icon={TrendingUp}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Entries */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Entries</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/entries">
                View all
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentEntries.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-6">
                No entries yet. Start tracking your time!
              </p>
            ) : (
              recentEntries.map(entry => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {entry.project && (
                        <ProjectBadge name={entry.project.name} color={entry.project.color} />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {entry.description || 'No description'}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-medium">{formatDurationShort(entry.duration)}</p>
                    <p className="text-xs text-muted-foreground">{formatDateShort(entry.startTime)}</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Project Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">This Week by Project</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/reports">
                View reports
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {projectStats.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-6">
                No time tracked this week yet.
              </p>
            ) : (
              projectStats.map(({ project, seconds }) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <ProjectBadge name={project.name} color={project.color} />
                  <span className="font-medium">{formatDurationShort(seconds)}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <EntryFormDialog
        open={manualOpen}
        onOpenChange={setManualOpen}
        projects={projects}
      />
    </div>
  );
}

