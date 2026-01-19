import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useData } from '@/context/DataContext';
import { PROJECT_COLORS } from '@/types';
import { cn } from '@/lib/utils';

export function ProjectFormDialog({ open, onOpenChange, project, onCreated }) {
  const { addProject, updateProject } = useData();
  const [name, setName] = useState('');
  const [client, setClient] = useState('');
  const [color, setColor] = useState('#3b82f6');
  const [billable, setBillable] = useState(false);
  const [hourlyRate, setHourlyRate] = useState('');

  useEffect(() => {
    if (project) {
      setName(project.name);
      setClient(project.client || '');
      setColor(project.color);
      setBillable(project.billable);
      setHourlyRate(project.hourlyRate?.toString() || '');
    } else {
      setName('');
      setClient('');
      setColor('#3b82f6');
      setBillable(false);
      setHourlyRate('');
    }
  }, [project, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const data = {
      name,
      client: client || undefined,
      color,
      billable,
      hourlyRate: billable && hourlyRate ? parseFloat(hourlyRate) : undefined,
      status: 'active',
    };

    if (project) {
      updateProject(project.id, data);
      onOpenChange(false);
      return;
    }

    const created = addProject(data);
    if (created && typeof created.then === 'function') {
      created.then((result) => {
        if (result) {
          onCreated?.(result);
        }
        onOpenChange(false);
      });
    } else {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{project ? 'Edit Project' : 'Create Project'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Website Redesign"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="client">Client (optional)</Label>
            <Input
              id="client"
              value={client}
              onChange={(e) => setClient(e.target.value)}
              placeholder="Acme Corp"
            />
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex gap-2 flex-wrap">
              {Object.entries(PROJECT_COLORS).map(([key, value]) => (
                <button
                  key={key}
                  type="button"
                  className={cn(
                    "h-8 w-8 rounded-full transition-all",
                    color === value && "ring-2 ring-offset-2 ring-ring"
                  )}
                  style={{ backgroundColor: value }}
                  onClick={() => setColor(value)}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="billable">Billable</Label>
              <p className="text-sm text-muted-foreground">Track billable hours for this project</p>
            </div>
            <Switch
              id="billable"
              checked={billable}
              onCheckedChange={setBillable}
            />
          </div>

          {billable && (
            <div className="space-y-2">
              <Label htmlFor="rate">Hourly Rate ($)</Label>
              <Input
                id="rate"
                type="number"
                min="0"
                step="0.01"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                placeholder="150.00"
              />
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{project ? 'Save Changes' : 'Create Project'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
