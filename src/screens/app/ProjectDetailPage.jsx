"use client";

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Clock, DollarSign, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { useData } from '@/context/DataContext';
import { formatDurationShort, formatDate, formatTime, formatDateShort } from '@/lib/utils';

export default function ProjectDetailPage() {
  const params = useParams();
  const idParam = params?.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;
  const { getProjectById, getEntriesByProject } = useData();

  const project = id ? getProjectById(id) : undefined;
  const entries = id ? getEntriesByProject(id) : [];

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">Project not found</h2>
        <p className="text-muted-foreground mb-4">The project you're looking for doesn't exist.</p>
        <Button asChild>
          <Link href="/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Link>
        </Button>
      </div>
    );
  }

  const totalSeconds = entries.reduce((sum, e) => sum + e.duration, 0);
  const billableSeconds = entries.filter(e => e.billable).reduce((sum, e) => sum + e.duration, 0);
  const totalEarnings = project.hourlyRate ? (billableSeconds / 3600) * project.hourlyRate : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/projects">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex items-center gap-3">
          <div
            className="h-6 w-6 rounded-full shrink-0"
            style={{ backgroundColor: project.color }}
          />
          <PageHeader
            title={project.name}
            description={project.client}
          />
        </div>
        <Badge variant={project.status === 'active' ? 'default' : 'secondary'} className="ml-auto">
          {project.status}
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Time"
          value={formatDurationShort(totalSeconds)}
          icon={Clock}
        />
        <StatCard
          title="Entries"
          value={entries.length.toString()}
          icon={Calendar}
        />
        {project.billable && (
          <>
            <StatCard
              title="Billable Time"
              value={formatDurationShort(billableSeconds)}
              icon={Clock}
            />
            <StatCard
              title="Total Earnings"
              value={`$${totalEarnings.toFixed(2)}`}
              icon={DollarSign}
            />
          </>
        )}
      </div>

      <Tabs defaultValue="entries">
        <TabsList>
          <TabsTrigger value="entries">Time Entries</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="entries" className="mt-4">
          <Card>
            <CardContent className="p-0">
              {entries.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  No time entries for this project yet.
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {entries.map(entry => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{entry.description || 'No description'}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDateShort(entry.startTime)} · {formatTime(entry.startTime)} - {formatTime(entry.endTime)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatDurationShort(entry.duration)}</p>
                        {entry.billable && project.hourlyRate && (
                          <p className="text-sm text-muted-foreground">
                            ${((entry.duration / 3600) * project.hourlyRate).toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Client</p>
                  <p className="font-medium">{project.client || 'None'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium capitalize">{project.status}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Billable</p>
                  <p className="font-medium">{project.billable ? 'Yes' : 'No'}</p>
                </div>
                {project.billable && (
                  <div>
                    <p className="text-sm text-muted-foreground">Hourly Rate</p>
                    <p className="font-medium">${project.hourlyRate}/hr</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium">{formatDate(project.createdAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

