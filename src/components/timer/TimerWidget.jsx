import { useState } from 'react';
import { Play, Pause, Square, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { TimerDisplay } from './TimerDisplay';
import { ProjectBadge } from '@/components/ui/ProjectBadge';
import { cn } from '@/lib/utils';

export function TimerWidget({
  elapsed,
  isRunning,
  isPaused,
  projectId,
  description,
  billable,
  projects,
  onStart,
  onPause,
  onResume,
  onStop,
  onDiscard,
  onUpdateDescription,
  onUpdateProject,
  onUpdateBillable,
  variant = 'default',
}) {
  const [selectedProject, setSelectedProject] = useState(projectId || '');
  const [desc, setDesc] = useState(description);

  const activeProjects = projects.filter(p => p.status === 'active');
  const selectedProjectData = projects.find(p => p.id === (projectId || selectedProject));

  const handleStart = () => {
    if (!selectedProject) return;
    onStart(selectedProject, desc, billable);
  };

  const handleProjectChange = (value) => {
    setSelectedProject(value);
    if (isRunning || isPaused) {
      onUpdateProject(value);
    }
  };

  const handleDescriptionChange = (value) => {
    setDesc(value);
    if (isRunning || isPaused) {
      onUpdateDescription(value);
    }
  };

  const handleBillableChange = (value) => {
    onUpdateBillable?.(value);
  };

  if (variant === 'compact') {
  return (
    <Card
      className={cn(
        "transition-all duration-300",
        isRunning && !isPaused && "border-timer-active shadow-lg timer-glow"
      )}
    >
      <CardContent className="p-4">
        {/* Make the whole bar wrap + allow shrinking */}
        <div className="flex flex-wrap items-center gap-3 min-w-0">
          {/* Left group */}
          <div className="flex items-center gap-3 min-w-0">
            <TimerDisplay
              seconds={elapsed}
              isRunning={isRunning}
              isPaused={isPaused}
              size="sm"
            />

            {selectedProjectData && (
              <ProjectBadge
                name={selectedProjectData.name}
                color={selectedProjectData.color}
              />
            )}
          </div>

          {/* Right group (push to right when space exists) */}
          <div className="flex flex-wrap items-center gap-3 ml-auto min-w-0 w-full sm:w-auto">
            {/* Billable */}
            <div className="flex items-center gap-2 text-sm whitespace-nowrap">
              <span className="text-muted-foreground">Billable</span>
              <Switch checked={!!billable} onCheckedChange={handleBillableChange} />
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2 min-w-0 w-full sm:w-auto">
              {!isRunning && !isPaused ? (
                <>
                  {/* Select should shrink / wrap instead of overflowing */}
                  <div className="min-w-0 flex-1 sm:flex-none">
                    <Select value={selectedProject} onValueChange={handleProjectChange}>
                      <SelectTrigger className="w-full sm:w-[180px] min-w-0">
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent>
                        {activeProjects.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            <div className="flex items-center gap-2 min-w-0">
                              <div
                                className="h-2 w-2 rounded-full shrink-0"
                                style={{ backgroundColor: project.color }}
                              />
                              <span className="truncate">{project.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={handleStart}
                    disabled={!selectedProject}
                    size="icon"
                    className="shrink-0"
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  {isPaused ? (
                    <Button onClick={onResume} size="icon" variant="outline" className="shrink-0">
                      <Play className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button onClick={onPause} size="icon" variant="outline" className="shrink-0">
                      <Pause className="h-4 w-4" />
                    </Button>
                  )}

                  <Button onClick={onStop} size="icon" variant="default" className="shrink-0">
                    <Square className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


  return (
    <Card className={cn(
      "transition-all duration-300",
      isRunning && !isPaused && "border-timer-active shadow-xl timer-glow"
    )}>
      <CardContent className="p-8">
        <div className="flex flex-col items-center text-center">
          <TimerDisplay seconds={elapsed} isRunning={isRunning} isPaused={isPaused} size="lg" />

          {selectedProjectData && (isRunning || isPaused) && (
            <div className="mt-4">
              <ProjectBadge name={selectedProjectData.name} color={selectedProjectData.color} />
            </div>
          )}

          <div className="mt-8 w-full max-w-md space-y-4">
            <Select value={projectId || selectedProject} onValueChange={handleProjectChange}>
              <SelectTrigger className="w-full">
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

            <Input
              placeholder="What are you working on?"
              value={isRunning || isPaused ? description : desc}
              onChange={(e) => handleDescriptionChange(e.target.value)}
            />

            <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
              <div>
                <p className="text-sm font-medium">Billable</p>
                <p className="text-xs text-muted-foreground">Include this time in billing</p>
              </div>
              <Switch checked={!!billable} onCheckedChange={handleBillableChange} />
            </div>

            <div className="flex justify-center gap-3">
              {!isRunning && !isPaused ? (
                <Button onClick={handleStart} disabled={!selectedProject} size="lg" className="px-12">
                  <Play className="h-5 w-5 mr-2" />
                  Start Timer
                </Button>
              ) : (
                <>
                  {isPaused ? (
                    <Button onClick={onResume} size="lg" variant="outline">
                      <Play className="h-5 w-5 mr-2" />
                      Resume
                    </Button>
                  ) : (
                    <Button onClick={onPause} size="lg" variant="outline">
                      <Pause className="h-5 w-5 mr-2" />
                      Pause
                    </Button>
                  )}
                  <Button onClick={onStop} size="lg">
                    <Square className="h-5 w-5 mr-2" />
                    Stop & Save
                  </Button>
                  <Button onClick={onDiscard} size="lg" variant="ghost" className="text-destructive">
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
