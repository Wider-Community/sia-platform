import { useForm } from "@refinedev/react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { useList } from "@refinedev/core";
import { Button } from "@/components/ui/button";
import { AnimatedButton } from "../../components/AnimatedButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { PageShell } from "../../components/PageShell";
import { PageHeader } from "../../components/PageHeader";
import { taskSchema } from "../../schemas";
import type { BaseRecord } from "@refinedev/core";

type FormValues = {
  title: string;
  description?: string;
  organizationId?: string;
  organizationName?: string;
  engagementId?: string;
  engagementName?: string;
  dueDate: string;
  status: "open" | "done";
  priority: "low" | "medium" | "high";
  assignedTo?: string;
};

export function TaskEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const orgs = useList({ resource: "organizations", pagination: { mode: "off" } });
  const orgData = orgs.result?.data ?? [];

  const engagements = useList({ resource: "engagements", pagination: { mode: "off" } });
  const engData = engagements.result?.data ?? [];

  const {
    refineCore: { formLoading, onFinish },
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    refineCoreProps: {
      resource: "tasks",
      action: "edit",
      id,
      redirect: false,
      onMutationSuccess: () => {
        navigate(`/portal/tasks/${id}`);
      },
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(taskSchema) as any,
    defaultValues: {
      title: "",
      description: "",
      organizationId: "",
      organizationName: "",
      engagementId: "",
      engagementName: "",
      dueDate: "",
      status: "open",
      priority: "medium",
      assignedTo: "",
    },
  });

  const priorityValue = watch("priority");
  const statusValue = watch("status");
  const orgIdValue = watch("organizationId");
  const engIdValue = watch("engagementId");

  const filteredEngagements = orgIdValue
    ? engData.filter((e: BaseRecord) => e.organizationId === orgIdValue)
    : engData;

  const handleOrgChange = (orgId: string) => {
    setValue("organizationId", orgId);
    const org = orgData.find((o: BaseRecord) => o.id === orgId);
    setValue("organizationName", (org?.name as string) ?? "");
    setValue("engagementId", "");
    setValue("engagementName", "");
  };

  const handleEngagementChange = (engId: string) => {
    setValue("engagementId", engId);
    const eng = engData.find((e: BaseRecord) => e.id === engId);
    setValue("engagementName", (eng?.title as string) ?? "");
  };

  return (
    <PageShell loading={formLoading}>
      <div className="mx-auto max-w-2xl space-y-6">
        <PageHeader title="Edit Task" backTo={`/portal/tasks/${id}`} />

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

              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={statusValue} onValueChange={(v) => setValue("status", v as FormValues["status"])}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="assignedTo">Assigned To</Label>
                <AnimatedInput id="assignedTo" {...register("assignedTo")} />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <AnimatedButton type="submit" loading={isSubmitting}>
              Save Changes
            </AnimatedButton>
          </div>
        </form>
      </div>
    </PageShell>
  );
}
