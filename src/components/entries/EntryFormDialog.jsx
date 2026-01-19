import { useState, useEffect, useCallback } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useData } from '@/context/DataContext';
import { ProjectFormDialog } from '@/components/projects/ProjectFormDialog';
import { TimerWidget } from '@/components/timer/TimerWidget';
import { useTimer } from '@/hooks/useTimer';

export function EntryFormDialog({ open, onOpenChange, entry, projects }) {
  const { addEntry, updateEntry } = useData();
  const [projectId, setProjectId] = useState('');
  const [entryType, setEntryType] = useState('manual');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [durationSec, setDurationSec] = useState(0);
  const [billable, setBillable] = useState(true);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);

  const activeProjects = projects.filter(p => p.status === 'active');
  const timer = useTimer((timerEntry) => {
    addEntry({ ...timerEntry, entryType: 'timer' });
    onOpenChange(false);
  });

  const buildDateTime = useCallback((dateValue, timeValue) => {
    if (!dateValue || !timeValue) return null;
    const value = new Date(`${dateValue}T${timeValue}`);
    return Number.isNaN(value.getTime()) ? null : value;
  }, []);

  const syncDurationFromTimes = useCallback((dateValue, startValue, endValue) => {
    const start = buildDateTime(dateValue, startValue);
    const end = buildDateTime(dateValue, endValue);
    if (!start || !end) {
      setDurationSec(0);
      return;
    }
    const diff = Math.floor((end.getTime() - start.getTime()) / 1000);
    setDurationSec(diff > 0 ? diff : 0);
  }, [buildDateTime]);

  useEffect(() => {
    if (entry) {
      setProjectId(entry.projectId);
      setEntryType(entry.entryType || 'manual');
      setDescription(entry.description || '');
      const start = new Date(entry.startTime);
      const end = entry.endTime ? new Date(entry.endTime) : null;
      setDate(start.toISOString().split('T')[0]);
      setStartTime(start.toTimeString().slice(0, 5));
      setEndTime(end ? end.toTimeString().slice(0, 5) : '');
      if (end) {
        syncDurationFromTimes(start.toISOString().split('T')[0], start.toTimeString().slice(0, 5), end.toTimeString().slice(0, 5));
      } else {
        setDurationSec(entry.duration || 0);
      }
      setBillable(entry.billable);
    } else {
      const now = new Date();
      setProjectId('');
      setEntryType('manual');
      setDescription('');
      setDate(now.toISOString().split('T')[0]);
      setStartTime('09:00');
      setEndTime('10:00');
      setDurationSec(3600);
      setBillable(true);
    }
  }, [entry, open, syncDurationFromTimes]);

  useEffect(() => {
    if (entryType !== 'manual') return;
    syncDurationFromTimes(date, startTime, endTime);
  }, [date, startTime, endTime, entryType, syncDurationFromTimes]);

  const handleDurationChange = (value) => {
    const minutes = Number(value);
    if (Number.isNaN(minutes) || minutes < 0) {
      setDurationSec(0);
      return;
    }
    const nextSeconds = Math.round(minutes * 60);
    setDurationSec(nextSeconds);
    const start = buildDateTime(date, startTime);
    if (start) {
      const end = new Date(start.getTime() + nextSeconds * 1000);
      setEndTime(end.toTimeString().slice(0, 5));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const start = buildDateTime(date, startTime);
    const end = buildDateTime(date, endTime);
    if (!start || !end) {
      return;
    }

    const duration = durationSec;
    if (duration <= 0) {
      return; // Invalid time range
    }

    const data = {
      projectId,
      entryType: entryType || 'manual',
      description: description || undefined,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      duration,
      billable,
    };

    if (entry) {
      updateEntry(entry.id, data);
    } else {
      addEntry(data);
    }
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{entry ? 'Edit Entry' : 'New Time Entry'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Entry Type</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={entryType === 'timer' ? 'default' : 'outline'}
                onClick={() => setEntryType('timer')}
                disabled={!!entry}
                className="flex-1"
              >
                Timer
              </Button>
              <Button
                type="button"
                variant={entryType === 'manual' ? 'default' : 'outline'}
                onClick={() => setEntryType('manual')}
                disabled={!!entry}
                className="flex-1"
              >
                Manual
              </Button>
            </div>
          </div>

          {entryType === 'timer' && !entry ? (
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
          ) : (
            <>
          <div className="space-y-2">
            <Label htmlFor="project">Project *</Label>
            <Select value={projectId} onValueChange={setProjectId} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                {activeProjects.map(project => (
                  <SelectItem key={project.id} value={project.id}>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: project.color }} />
                      {project.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="ghost"
              className="px-0 text-sm"
              onClick={() => setProjectDialogOpen(true)}
            >
              Create new project
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What did you work on?"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start">Start Time *</Label>
              <Input
                id="start"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end">End Time *</Label>
              <Input
                id="end"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              min="0"
              step="1"
              value={Math.floor(durationSec / 60)}
              onChange={(e) => handleDurationChange(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="billable">Billable</Label>
              <p className="text-sm text-muted-foreground">Mark this entry as billable</p>
            </div>
            <Switch
              id="billable"
              checked={billable}
              onCheckedChange={setBillable}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!projectId}>
              {entry ? 'Save Changes' : 'Create Entry'}
            </Button>
          </DialogFooter>
            </>
          )}
        </form>
      </DialogContent>
      <ProjectFormDialog
        open={projectDialogOpen}
        onOpenChange={setProjectDialogOpen}
        onCreated={(created) => {
          setProjectId(created.id);
        }}
      />
    </Dialog>
  );
}
