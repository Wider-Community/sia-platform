import { useForm } from "@refinedev/react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useList } from "@refinedev/core";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { AnimatedButton } from "../../components/AnimatedButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AnimatedInput } from "../../components/AnimatedInput";
import { AnimatedTextarea } from "../../components/AnimatedTextarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { PageShell } from "../../components/PageShell";
import { PageHeader } from "../../components/PageHeader";
import type { BaseRecord } from "@refinedev/core";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  organizationId: z.string().optional(),
  organizationName: z.string().optional(),
  engagementId: z.string().optional(),
  engagementName: z.string().optional(),
  dueDate: z.string().min(1, "Due date is required"),
  status: z.enum(["open", "done"]),
  priority: z.enum(["low", "medium", "high"]),
});

type FormValues = z.infer<typeof formSchema>;

export function TaskCreatePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const prefilledOrgId = searchParams.get("organizationId") ?? "";
  const prefilledOrgName = searchParams.get("organizationName") ?? "";
  const prefilledEngId = searchParams.get("engagementId") ?? "";
  const prefilledEngName = searchParams.get("engagementName") ?? "";

  const orgs = useList({ resource: "organizations", pagination: { mode: "off" } });
  const orgData = orgs.result?.data ?? [];

  const engagements = useList({ resource: "engagements", pagination: { mode: "off" } });
  const engData = engagements.result?.data ?? [];

  const {
    refineCore: { onFinish },
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    refineCoreProps: {
      resource: "tasks",
      action: "create",
      redirect: "list",
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      title: "",
      description: "",
      organizationId: prefilledOrgId,
      organizationName: prefilledOrgName,
      engagementId: prefilledEngId,
      engagementName: prefilledEngName,
      dueDate: "",
      status: "open",
      priority: "medium",
    },
  });

  const priorityValue = watch("priority");
  const orgIdValue = watch("organizationId");
  const engIdValue = watch("engagementId");

  // Filter engagements by selected organization
  const filteredEngagements = orgIdValue
    ? engData.filter((e: BaseRecord) => e.organizationId === orgIdValue)
    : engData;

  const handleOrgChange = (orgId: string) => {
    setValue("organizationId", orgId);
    const org = orgData.find((o: BaseRecord) => o.id === orgId);
    setValue("organizationName", (org?.name as string) ?? "");
    // Clear engagement when org changes
    setValue("engagementId", "");
    setValue("engagementName", "");
  };

  const handleEngagementChange = (engId: string) => {
    setValue("engagementId", engId);
    const eng = engData.find((e: BaseRecord) => e.id === engId);
    setValue("engagementName", (eng?.title as string) ?? "");
  };

  return (
    <PageShell>
      <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader title="New Task" backTo="/portal/tasks" />

      <form onSubmit={handleSubmit(onFinish)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Task Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <AnimatedInput id="title" error={!!errors.title} {...register("title")} />
              {errors.title && (
                <p className="text-sm text-destructive">{String(errors.title.message)}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <AnimatedTextarea id="description" rows={3} {...register("description")} />
            </div>

            <div className="space-y-2">
              <Label>Organization</Label>
              <Select value={orgIdValue || "none"} onValueChange={(v) => handleOrgChange(v === "none" ? "" : v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select organization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {orgData.map((org: BaseRecord) => (
                    <SelectItem key={org.id as string} value={org.id as string}>
                      {org.name as string}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Engagement</Label>
              <Select value={engIdValue || "none"} onValueChange={(v) => handleEngagementChange(v === "none" ? "" : v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select engagement (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {filteredEngagements.map((eng: BaseRecord) => (
                    <SelectItem key={eng.id as string} value={eng.id as string}>
                      {eng.title as string}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date *</Label>
                <Input id="dueDate" type="date" {...register("dueDate")} />
                {errors.dueDate && (
                  <p className="text-sm text-destructive">{String(errors.dueDate.message)}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={priorityValue} onValueChange={(v) => setValue("priority", v as FormValues["priority"])}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <AnimatedButton type="submit" loading={isSubmitting}>
            Create Task
          </AnimatedButton>
        </div>
      </form>
    </div>
    </PageShell>
  );
}
