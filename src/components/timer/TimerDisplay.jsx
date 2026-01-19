import { cn, formatDuration } from '@/lib/utils';

export function TimerDisplay({ seconds, isRunning, isPaused, size = 'md' }) {
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl md:text-7xl',
  };

  return (
    <div className="relative">
      <div
        className={cn(
          "font-mono font-bold tracking-tight transition-colors duration-300",
          sizeClasses[size],
          isRunning && !isPaused && "text-timer-active",
          isPaused && "text-timer-paused",
          !isRunning && !isPaused && "text-foreground"
        )}
      >
        {formatDuration(seconds)}
      </div>
      {isRunning && !isPaused && (
        <div className="absolute -inset-4 rounded-lg bg-timer-active/10 animate-pulse-slow -z-10" />
      )}
    </div>
  );
}
