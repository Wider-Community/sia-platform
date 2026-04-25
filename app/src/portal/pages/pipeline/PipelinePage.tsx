import { useState, useMemo } from "react";
import { useList, useUpdate } from "@refinedev/core";
import { KanbanBoard, type KanbanColumn } from "@/portal/components/KanbanBoard";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Organization {
  id: string;
  name: string;
  type: string;
  status: string;
  stage?: string;
  country: string;
  updatedAt: string;
  [key: string]: unknown;
}

const PIPELINE_STAGES = [
  { id: "prospect", title: "Prospect", color: "#94a3b8" },
  { id: "engaged", title: "Engaged", color: "#3b82f6" },
  { id: "due_diligence", title: "Due Diligence", color: "#f59e0b" },
  { id: "negotiation", title: "Negotiation", color: "#8b5cf6" },
  { id: "active_partner", title: "Active Partner", color: "#22c55e" },
  { id: "inactive", title: "Inactive", color: "#6b7280" },
];

const STATUS_TO_STAGE: Record<string, string> = {
  active: "active_partner",
  prospect: "prospect",
  inactive: "inactive",
};

function getStage(org: Organization): string {
  if (org.stage) return org.stage;
  return STATUS_TO_STAGE[org.status] ?? "prospect";
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function OrgCard({ org }: { org: Organization }) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-3 space-y-2">
        <div className="font-medium text-sm leading-tight">{org.name}</div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px] capitalize">
            {org.type}
          </Badge>
          <span className="text-xs text-muted-foreground">{org.country}</span>
        </div>
        <div className="text-[10px] text-muted-foreground">
          Updated {formatDate(org.updatedAt)}
        </div>
      </CardContent>
    </Card>
  );
}

export function PipelinePage() {
  const { data, isLoading } = useList<Organization>({
    resource: "organizations",
    pagination: { mode: "off" },
  });
  const { mutate: updateOrg } = useUpdate();

  const [pendingMove, setPendingMove] = useState<{
    itemId: string;
    fromColumn: string;
    toColumn: string;
  } | null>(null);

  const orgs = data?.data ?? [];

  const columns: KanbanColumn<Organization>[] = useMemo(() => {
    return PIPELINE_STAGES.map((stage) => ({
      ...stage,
      items: orgs.filter((org) => getStage(org) === stage.id),
    }));
  }, [orgs]);

  function handleDragEnd(itemId: string, fromColumn: string, toColumn: string) {
    setPendingMove({ itemId, fromColumn, toColumn });
  }

  function confirmMove() {
    if (!pendingMove) return;
    updateOrg({
      resource: "organizations",
      id: pendingMove.itemId,
      values: { stage: pendingMove.toColumn },
    });
    setPendingMove(null);
  }

  const targetStage = PIPELINE_STAGES.find((s) => s.id === pendingMove?.toColumn);
  const movingOrg = orgs.find((o) => o.id === pendingMove?.itemId);

  return (
    <div className="space-y-6">
      <h1
        className="text-2xl font-bold tracking-tight"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Pipeline
      </h1>

      <Tabs defaultValue="board">
        <TabsList>
          <TabsTrigger value="board">Board</TabsTrigger>
          <TabsTrigger value="list">List</TabsTrigger>
        </TabsList>

        <TabsContent value="board" className="mt-4">
          {isLoading ? (
            <div className="text-sm text-muted-foreground">Loading...</div>
          ) : (
            <KanbanBoard<Organization>
              columns={columns}
              onDragEnd={handleDragEnd}
              renderCard={(org) => <OrgCard org={org} />}
            />
          )}
        </TabsContent>

        <TabsContent value="list" className="mt-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orgs.map((org) => {
                  const stage = PIPELINE_STAGES.find((s) => s.id === getStage(org));
                  return (
                    <TableRow key={org.id}>
                      <TableCell className="font-medium">{org.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {org.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{org.country}</TableCell>
                      <TableCell>
                        <Badge
                          style={{ backgroundColor: stage?.color, color: "white", borderColor: "transparent" }}
                        >
                          {stage?.title ?? getStage(org)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(org.updatedAt)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <AlertDialog open={!!pendingMove} onOpenChange={(open) => !open && setPendingMove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Move Organization</AlertDialogTitle>
            <AlertDialogDescription>
              Move <strong>{movingOrg?.name}</strong> to{" "}
              <strong>{targetStage?.title}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmMove}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
