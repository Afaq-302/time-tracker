"use client";

import { useState, useMemo } from 'react';
import { Plus, Search, MoreHorizontal, Edit, Trash2, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { ProjectBadge } from '@/components/ui/ProjectBadge';
import { useData } from '@/context/DataContext';
import { formatDurationShort, formatTime, formatDateShort, getStartOfDay, getStartOfWeek } from '@/lib/utils';
import { EntryFormDialog } from '@/components/entries/EntryFormDialog';

export default function EntriesPage() {
  const { projects, entries, deleteEntry } = useData();
  const [search, setSearch] = useState('');
  const [projectFilter, setProjectFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('week');
  const [billableFilter, setBillableFilter] = useState('all');
  const [formOpen, setFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const filteredEntries = useMemo(() => {
    const now = new Date();
    const todayStart = getStartOfDay(now);
    const weekStart = getStartOfWeek(now);

    return entries.filter(entry => {
      const project = projects.find(p => p.id === entry.projectId);
      const entryDate = new Date(entry.startTime);

      // Date filter
      if (dateFilter === 'today' && entryDate < todayStart) return false;
      if (dateFilter === 'week' && entryDate < weekStart) return false;

      // Project filter
      if (projectFilter !== 'all' && entry.projectId !== projectFilter) return false;

      // Billable filter
      if (billableFilter === 'billable' && !entry.billable) return false;
      if (billableFilter === 'non-billable' && entry.billable) return false;

      // Search
      if (search) {
        const searchLower = search.toLowerCase();
        const matchesDescription = entry.description?.toLowerCase().includes(searchLower);
        const matchesProject = project?.name.toLowerCase().includes(searchLower);
        if (!matchesDescription && !matchesProject) return false;
      }

      return true;
    });
  }, [entries, projects, search, projectFilter, dateFilter, billableFilter]);

  const totalTime = filteredEntries.reduce((sum, e) => sum + e.duration, 0);

  const handleDelete = (entryId) => {
    deleteEntry(entryId);
    setDeleteConfirm(null);
  };

  const entryToEdit = entries.find(e => e.id === editingEntry);
  const entryToDelete = entries.find(e => e.id === deleteConfirm);

  // Group entries by date
  const groupedEntries = useMemo(() => {
    const groups = {};
    
    filteredEntries.forEach(entry => {
      const date = new Date(entry.startTime).toDateString();
      if (!groups[date]) groups[date] = [];
      groups[date].push(entry);
    });

    return Object.entries(groups).map(([date, entries]) => ({
      date: new Date(date),
      entries,
      totalDuration: entries.reduce((sum, e) => sum + e.duration, 0),
    }));
  }, [filteredEntries]);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Time Entries"
        description={`${filteredEntries.length} entries · ${formatDurationShort(totalTime)} total`}
        action={
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Entry
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search entries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-[130px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
        <Select value={projectFilter} onValueChange={setProjectFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Projects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {projects.filter(p => p.status === 'active').map(project => (
              <SelectItem key={project.id} value={project.id}>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: project.color }} />
                  {project.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={billableFilter} onValueChange={setBillableFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="billable">Billable</SelectItem>
            <SelectItem value="non-billable">Non-billable</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Entries List */}
      {groupedEntries.length === 0 ? (
        <EmptyState
          icon={Plus}
          title="No entries found"
          description={search || projectFilter !== 'all' ? "Try adjusting your filters" : "Create your first time entry"}
          actionLabel="New Entry"
          onAction={() => setFormOpen(true)}
        />
      ) : (
        <div className="space-y-6">
          {groupedEntries.map(group => (
            <div key={group.date.toISOString()}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-muted-foreground">
                  {formatDateShort(group.date)}
                </h3>
                <span className="text-sm font-medium">
                  {formatDurationShort(group.totalDuration)}
                </span>
              </div>
              <Card>
                <CardContent className="p-0 divide-y divide-border">
                  {group.entries.map(entry => {
                    const project = projects.find(p => p.id === entry.projectId);
                    return (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {project && (
                              <ProjectBadge name={project.name} color={project.color} />
                            )}
                            {entry.billable && (
                              <Badge variant="secondary" className="text-xs">Billable</Badge>
                            )}
                            {entry.entryType === 'manual' && (
                              <Badge variant="outline" className="text-xs">Manual</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {entry.description || 'No description'}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 ml-4">
                          <div className="text-right">
                            <p className="font-medium">{formatDurationShort(entry.duration)}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatTime(entry.startTime)} - {formatTime(entry.endTime)}
                            </p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setEditingEntry(entry.id)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => setDeleteConfirm(entry.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <EntryFormDialog
        open={formOpen || !!editingEntry}
        onOpenChange={(open) => {
          if (!open) {
            setFormOpen(false);
            setEditingEntry(null);
          }
        }}
        entry={entryToEdit}
        projects={projects}
      />

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Entry</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this time entry? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteConfirm) {
                  handleDelete(deleteConfirm);
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
