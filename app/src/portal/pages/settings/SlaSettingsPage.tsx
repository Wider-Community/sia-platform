import { useList, useUpdate, useCreate } from "@refinedev/core";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Pencil, Check, X, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { BaseRecord } from "@refinedev/core";

interface EditingRule {
  id: string;
  name: string;
  entityType: string;
  thresholdDays: number;
  description: string;
}

export function SlaSettingsPage() {
  const navigate = useNavigate();
  const { result, query } = useList({
    resource: "sla-rules",
    pagination: { mode: "off" },
    sorters: [{ field: "createdAt", order: "asc" }],
  });
  const { mutate: updateRule } = useUpdate();
  const { mutate: createRule } = useCreate();
  const [editing, setEditing] = useState<EditingRule | null>(null);
  const [seeded, setSeeded] = useState(false);

  const rules = result?.data ?? [];

  useEffect(() => {
    if (query.isLoading || seeded) return;
    if (rules.length === 0) {
      const defaults = [
        { name: "Contact organization", entityType: "organization", thresholdDays: 14, description: "Reach out to each organization at least every 14 days" },
        { name: "Follow up signing request", entityType: "signing-request", thresholdDays: 7, description: "Follow up on pending signing requests within 7 days" },
        { name: "Complete task by due date", entityType: "task", thresholdDays: 0, description: "Tasks should be completed by their due date" },
      ];
      defaults.forEach((r) => createRule({ resource: "sla-rules", values: r }));
      setSeeded(true);
    }
  }, [query.isLoading, rules.length, createRule, seeded]);

  const startEdit = (rule: BaseRecord) => {
    setEditing({
      id: rule.id as string,
      name: rule.name as string,
      entityType: rule.entityType as string,
      thresholdDays: rule.thresholdDays as number,
      description: (rule.description as string) ?? "",
    });
  };

  const saveEdit = () => {
    if (!editing) return;
    updateRule({
      resource: "sla-rules",
      id: editing.id,
      values: {
        name: editing.name,
        entityType: editing.entityType,
        thresholdDays: editing.thresholdDays,
        description: editing.description,
      },
    });
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/portal")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1
          className="text-3xl font-bold tracking-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          SLA Rules
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Service Level Agreement Rules</CardTitle>
        </CardHeader>
        <CardContent>
          {query.isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Entity Type</TableHead>
                  <TableHead>Threshold (days)</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules.map((rule: BaseRecord) => {
                  const isEditing = editing?.id === rule.id;
                  if (isEditing && editing) {
                    return (
                      <TableRow key={rule.id as string}>
                        <TableCell>
                          <Input
                            value={editing.name}
                            onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                            className="h-8"
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            value={editing.entityType}
                            onValueChange={(v) => setEditing({ ...editing, entityType: v })}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="organization">Organization</SelectItem>
                              <SelectItem value="signing-request">Signing Request</SelectItem>
                              <SelectItem value="task">Task</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={editing.thresholdDays}
                            onChange={(e) => setEditing({ ...editing, thresholdDays: Number(e.target.value) })}
                            className="h-8 w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={editing.description}
                            onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                            className="h-8"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={saveEdit}>
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditing(null)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  }
                  return (
                    <TableRow key={rule.id as string}>
                      <TableCell className="font-medium">{rule.name as string}</TableCell>
                      <TableCell className="capitalize">{(rule.entityType as string).replace("-", " ")}</TableCell>
                      <TableCell>{rule.thresholdDays as number}</TableCell>
                      <TableCell className="text-muted-foreground">{(rule.description as string) ?? ""}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => startEdit(rule)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {rules.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      No SLA rules configured. Default rules are being created...
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
