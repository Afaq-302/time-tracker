import { formatDate, formatTime, formatDurationShort } from './utils';

export function exportToCSV(entries, projects) {
  const projectMap = new Map(projects.map(p => [p.id, p]));

  const headers = [
    'Date',
    'Project',
    'Client',
    'Start',
    'End',
    'Duration (minutes)',
    'Duration (HH:MM)',
    'Billable',
    'Rate',
    'Amount',
    'Notes',
  ];

  const rows = entries.map(entry => {
    const project = projectMap.get(entry.projectId);
    const durationMinutes = Math.round(entry.duration / 60);
    const hours = Math.floor(entry.duration / 3600);
    const minutes = Math.floor((entry.duration % 3600) / 60);
    const durationHHMM = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    const amount = project?.hourlyRate 
      ? ((entry.duration / 3600) * project.hourlyRate).toFixed(2) 
      : '';

    return [
      formatDate(entry.startTime),
      project?.name || 'Unknown',
      project?.client || '',
      formatTime(entry.startTime),
      formatTime(entry.endTime),
      durationMinutes.toString(),
      durationHHMM,
      entry.billable ? 'Yes' : 'No',
      project?.hourlyRate?.toString() || '',
      amount,
      entry.description || '',
    ];
  });

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `time-entries-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
