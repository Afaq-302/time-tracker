"use client";

import { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { TimerWidget } from '@/components/timer/TimerWidget';
import { useData } from '@/context/DataContext';
import { useTimer } from '@/hooks/useTimer';
import { EntryFormDialog } from '@/components/entries/EntryFormDialog';

export default function TimerPage() {
  const { projects, addEntry } = useData();
  const timer = useTimer(addEntry);
  const [manualOpen, setManualOpen] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Timer"
        description="Focus on your work and track your time"
        action={
          <Button variant="outline" onClick={() => setManualOpen(true)}>
            Add Manual Entry
          </Button>
        }
      />

      <div className="max-w-2xl mx-auto">
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
          variant="default"
        />
      </div>

      <EntryFormDialog
        open={manualOpen}
        onOpenChange={setManualOpen}
        projects={projects}
      />
    </div>
  );
}
