import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface TimelineEvent {
  id: string;
  icon?: ReactNode;
  title: string;
  description?: string;
  timestamp: string;
  variant?: "default" | "success" | "warning" | "destructive";
}

const dotColor: Record<string, string> = {
  default: "bg-muted-foreground",
  success: "bg-green-500",
  warning: "bg-yellow-500",
  destructive: "bg-red-500",
};

export function VerticalTimeline({ events }: { events: TimelineEvent[] }) {
  if (events.length === 0) {
    return <p className="text-sm text-muted-foreground">No events yet.</p>;
  }

  return (
    <div className="relative space-y-0">
      {events.map((event, i) => (
        <div key={event.id} className="relative flex gap-4 pb-6 last:pb-0">
          {/* Connecting line */}
          {i < events.length - 1 && (
            <div className="absolute left-[11px] top-6 h-full w-px bg-border" />
          )}
          {/* Dot */}
          <div className="relative z-10 mt-1.5 flex h-6 w-6 shrink-0 items-center justify-center">
            {event.icon ?? (
              <div className={cn("h-2.5 w-2.5 rounded-full", dotColor[event.variant ?? "default"])} />
            )}
          </div>
          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium leading-tight">{event.title}</p>
            {event.description && (
              <p className="mt-0.5 text-sm text-muted-foreground truncate">{event.description}</p>
            )}
            <p className="mt-1 text-xs text-muted-foreground">
              {new Date(event.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
