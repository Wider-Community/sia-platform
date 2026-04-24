import { useList } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, FileText, Activity } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { BaseRecord } from "@refinedev/core";

export function PortalDashboardPage() {
  const orgs = useList({ resource: "organizations", pagination: { mode: "off" } });
  const files = useList({ resource: "files", pagination: { mode: "off" } });
  const events = useList({
    resource: "activity-events",
    pagination: { pageSize: 5 },
    sorters: [{ field: "createdAt", order: "desc" }],
  });

  const stats = [
    {
      title: "Total Organizations",
      value: orgs.result?.total ?? 0,
      icon: Building2,
      loading: orgs.query.isLoading,
    },
    {
      title: "Total Files",
      value: files.result?.total ?? 0,
      icon: FileText,
      loading: files.query.isLoading,
    },
    {
      title: "Recent Events",
      value: events.result?.total ?? 0,
      icon: Activity,
      loading: events.query.isLoading,
    },
  ];

  const eventData = events.result?.data ?? [];

  return (
    <div className="space-y-6">
      <h1
        className="text-3xl font-bold tracking-tight"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Dashboard
      </h1>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {stat.loading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold">{stat.value}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {events.query.isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : eventData.length ? (
            <div className="space-y-3">
              {eventData.map((event: BaseRecord) => (
                <div
                  key={event.id as string}
                  className="flex items-center gap-3 rounded-md border p-3 text-sm"
                >
                  <Activity className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="font-medium capitalize">
                    {event.action as string}
                  </span>
                  <span className="text-muted-foreground">
                    {event.entityType as string}
                  </span>
                  <span className="truncate">{event.entityName as string}</span>
                  <span className="ml-auto whitespace-nowrap text-xs text-muted-foreground">
                    {new Date(event.createdAt as string).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No recent activity</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
