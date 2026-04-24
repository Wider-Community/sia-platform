import { useMemo } from "react";
import { useList } from "@refinedev/core";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, FileSignature, AlertTriangle, CheckSquare } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { BaseRecord } from "@refinedev/core";
import { KpiCard } from "../../components/KpiCard";
import { VerticalTimeline, type TimelineEvent } from "../../components/VerticalTimeline";
import { evaluateSLA, type SLAResult } from "../../lib/sla-engine";

export function PortalDashboardPage() {
  const navigate = useNavigate();

  const orgs = useList({ resource: "organizations", pagination: { mode: "off" } });
  const tasks = useList({ resource: "tasks", pagination: { mode: "off" } });
  const signingRequests = useList({ resource: "signing-requests", pagination: { mode: "off" } });
  const events = useList({
    resource: "activity-events",
    pagination: { mode: "off" },
    sorters: [{ field: "createdAt", order: "desc" }],
  });
  const slaRules = useList({ resource: "sla-rules", pagination: { mode: "off" } });

  const orgData = orgs.result?.data ?? [];
  const taskData = tasks.result?.data ?? [];
  const eventData = events.result?.data ?? [];
  const signingData = signingRequests.result?.data ?? [];
  const ruleData = slaRules.result?.data ?? [];

  const isLoading = orgs.query.isLoading || tasks.query.isLoading || events.query.isLoading;

  // SLA evaluation
  const slaResults = useMemo<SLAResult[]>(() => {
    if (orgData.length === 0 || ruleData.length === 0) return [];
    const orgRules = ruleData.filter((r: BaseRecord) => r.entityType === "organization");
    return evaluateSLA(
      orgData,
      eventData,
      orgRules as Array<{ name: string; entityType: string; thresholdDays: number }>,
    );
  }, [orgData, eventData, ruleData]);

  // KPI values
  const totalOrgs = orgData.length;
  const activeSigningRequests = signingData.filter(
    (s: BaseRecord) => s.status === "sent" || s.status === "partially_signed",
  ).length;
  const overdueCount = slaResults.filter((r) => r.status === "overdue").length;
  const today = new Date().toISOString().split("T")[0];
  const tasksDueToday = taskData.filter(
    (t: BaseRecord) => t.status === "open" && (t.dueDate as string)?.startsWith(today),
  ).length;

  // Priority queue: orgs sorted by SLA status
  const priorityQueue = useMemo(() => {
    const statusOrder: Record<string, number> = { overdue: 0, at_risk: 1, on_track: 2 };
    const slaMap = new Map(slaResults.map((r) => [r.entityId, r]));
    return orgData
      .map((org: BaseRecord) => ({
        id: org.id as string,
        name: org.name as string,
        status: org.status as string,
        sla: slaMap.get(org.id as string),
      }))
      .sort((a, b) => {
        const aOrder = statusOrder[a.sla?.status ?? "on_track"] ?? 2;
        const bOrder = statusOrder[b.sla?.status ?? "on_track"] ?? 2;
        return aOrder - bOrder;
      });
  }, [orgData, slaResults]);

  // Activity by week chart data
  const weeklyActivity = useMemo(() => {
    const weeks = new Map<string, number>();
    const now = new Date();
    for (let i = 7; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i * 7);
      const weekLabel = `W${getWeekNumber(d)}`;
      weeks.set(weekLabel, 0);
    }
    for (const ev of eventData) {
      const d = new Date(ev.createdAt as string);
      const weekLabel = `W${getWeekNumber(d)}`;
      if (weeks.has(weekLabel)) {
        weeks.set(weekLabel, (weeks.get(weekLabel) ?? 0) + 1);
      }
    }
    return Array.from(weeks.entries()).map(([week, count]) => ({ week, count }));
  }, [eventData]);

  // Recent tasks (open, sorted by due date)
  const recentTasks = taskData
    .filter((t: BaseRecord) => t.status === "open")
    .sort((a: BaseRecord, b: BaseRecord) =>
      (a.dueDate as string).localeCompare(b.dueDate as string),
    )
    .slice(0, 5);

  // Recent activity as timeline events
  const timelineEvents: TimelineEvent[] = eventData.slice(0, 8).map((e: BaseRecord) => ({
    id: e.id as string,
    title: `${capitalize(e.action as string)} ${e.entityType as string}`,
    description: e.entityName as string,
    timestamp: e.createdAt as string,
    variant: (e.action as string) === "deleted" ? "destructive" as const : "default" as const,
  }));

  const slaBadge = (status?: string) => {
    if (status === "overdue") return <Badge className="bg-red-500 hover:bg-red-600 text-white">Overdue</Badge>;
    if (status === "at_risk") return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">At Risk</Badge>;
    return <Badge className="bg-green-500 hover:bg-green-600 text-white">On Track</Badge>;
  };

  return (
    <div className="space-y-6">
      <h1
        className="text-3xl font-bold tracking-tight"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Operations Dashboard
      </h1>

      {/* Row 1: KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <KpiCard
          title="Total Organizations"
          value={totalOrgs}
          icon={Building2}
          loading={orgs.query.isLoading}
        />
        <KpiCard
          title="Active Signing Requests"
          value={activeSigningRequests}
          icon={FileSignature}
          loading={signingRequests.query.isLoading}
        />
        <KpiCard
          title="Overdue Items"
          value={overdueCount}
          icon={AlertTriangle}
          loading={isLoading}
        />
        <KpiCard
          title="Tasks Due Today"
          value={tasksDueToday}
          icon={CheckSquare}
          loading={tasks.query.isLoading}
        />
      </div>

      {/* Row 2: Priority Queue */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Priority Queue</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : priorityQueue.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organization</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>SLA Status</TableHead>
                  <TableHead>Days Since Activity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {priorityQueue.map((item) => (
                  <TableRow
                    key={item.id}
                    className="cursor-pointer"
                    onClick={() => navigate(`/portal/organizations/${item.id}`)}
                  >
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">{item.status}</Badge>
                    </TableCell>
                    <TableCell>{slaBadge(item.sla?.status)}</TableCell>
                    <TableCell>{item.sla?.daysSinceActivity ?? "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground">No organizations to display.</p>
          )}
        </CardContent>
      </Card>

      {/* Row 3: Tasks + Activity side by side */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Open Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {tasks.query.isLoading ? (
              <Skeleton className="h-32 w-full" />
            ) : recentTasks.length > 0 ? (
              <div className="space-y-2">
                {recentTasks.map((task: BaseRecord) => (
                  <div
                    key={task.id as string}
                    className="flex items-center justify-between rounded-md border p-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{task.title as string}</p>
                      <p className="text-xs text-muted-foreground">
                        Due: {new Date(task.dueDate as string).toLocaleDateString()}
                        {task.organizationName && ` · ${task.organizationName}`}
                      </p>
                    </div>
                    <Badge
                      variant={
                        (task.priority as string) === "high"
                          ? "destructive"
                          : (task.priority as string) === "medium"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {task.priority as string}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No open tasks.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {events.query.isLoading ? (
              <Skeleton className="h-32 w-full" />
            ) : (
              <VerticalTimeline events={timelineEvents} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Activity by Week</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyActivity}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="week" className="text-xs" />
                <YAxis className="text-xs" allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--foreground))",
                  }}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function getWeekNumber(d: Date): number {
  const start = new Date(d.getFullYear(), 0, 1);
  const diff = d.getTime() - start.getTime();
  return Math.ceil((diff / 86400000 + start.getDay() + 1) / 7);
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
