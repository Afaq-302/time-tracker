import { cn } from '@/lib/utils';

export function ProjectBadge({ name, color, className }) {
  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <div 
        className="h-3 w-3 rounded-full shrink-0" 
        style={{ backgroundColor: color }}
      />
      <span className="text-sm font-medium truncate">{name}</span>
    </div>
  );
}
