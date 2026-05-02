import { useState } from "react";
import { useCreate, useList } from "@refinedev/core";
import { toast } from "sonner";
import {
  Plus,
  CheckSquare,
  Layers,
  StickyNote,
  Users,
  Link2,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// ── Types ──

export interface LucidContext {
  organizationId?: string;
  organizationName?: string;
  engagementId?: string;
  engagementName?: string;
}

type EntityType = "task" | "engagement" | "note" | "contact" | "match";

interface TypeOption {
  type: EntityType;
  label: string;
  icon: typeof Plus;
}

const TYPE_OPTIONS: TypeOption[] = [
  { type: "task", label: "Task", icon: CheckSquare },
  { type: "engagement", label: "Engagement", icon: Layers },
  { type: "note", label: "Note", icon: StickyNote },
  { type: "contact", label: "Contact", icon: Users },
  { type: "match", label: "Match", icon: Link2 },
];

// ── Type Selector ──

function LucidTypeSelector({ onSelect }: { onSelect: (t: EntityType) => void }) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
      {TYPE_OPTIONS.map(({ type, label, icon: Icon }) => (
        <button
          key={type}
          type="button"
          onClick={() => onSelect(type)}
          className="flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Icon className="h-6 w-6" />
          <span className="text-sm font-medium">{label}</span>
        </button>
      ))}
    </div>
  );
}

// ── Context Badge ──

function ContextBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <Label className="text-muted-foreground text-xs">{label}</Label>
      <Badge variant="secondary">{value}</Badge>
    </div>
  );
}

// ── Task Form ──

function TaskForm({
  context,
  onSuccess,
  onCancel,
}: {
  context?: LucidContext;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const { mutate, isLoading } = useCreate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;
    mutate(
      {
        resource: "tasks",
        values: {
          title: title.trim(),
          dueDate,
          priority,
          status: "open",
          organizationId: context?.organizationId ?? "",
          organizationName: context?.organizationName ?? "",
          engagementId: context?.engagementId ?? "",
          engagementName: context?.engagementName ?? "",
        },
      },
      {
        onSuccess: () => {
          toast.success("Task created");
          onSuccess();
        },
        onError: () => toast.error("Failed to create task"),
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {context?.organizationName && (
        <ContextBadge label="Organization" value={context.organizationName} />
      )}
      {context?.engagementName && (
        <ContextBadge label="Engagement" value={context.engagementName} />
      )}
      <div className="space-y-2">
        <Label htmlFor="task-title">Title *</Label>
        <Input
          id="task-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          required
          autoFocus
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="task-due">Due Date *</Label>
          <Input
            id="task-due"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Priority</Label>
          <Select value={priority} onValueChange={setPriority}>
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
      <FormActions type="Task" isLoading={isLoading} onCancel={onCancel} />
    </form>
  );
}

// ── Engagement Form ──

function EngagementForm({
  context,
  onSuccess,
  onCancel,
}: {
  context?: LucidContext;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("deal");
  const [stage] = useState("prospect");
  const { mutate, isLoading } = useCreate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    mutate(
      {
        resource: "engagements",
        values: {
          title: title.trim(),
          category,
          stage,
          priority: "medium",
          organizationId: context?.organizationId ?? "",
          createdBy: "current-user",
        },
      },
      {
        onSuccess: () => {
          toast.success("Engagement created");
          onSuccess();
        },
        onError: () => toast.error("Failed to create engagement"),
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {context?.organizationName && (
        <ContextBadge label="Organization" value={context.organizationName} />
      )}
      <div className="space-y-2">
        <Label htmlFor="eng-title">Title *</Label>
        <Input
          id="eng-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Engagement title"
          required
          autoFocus
        />
      </div>
      <div className="space-y-2">
        <Label>Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="deal">Deal</SelectItem>
            <SelectItem value="project">Project</SelectItem>
            <SelectItem value="opportunity">Opportunity</SelectItem>
            <SelectItem value="initiative">Initiative</SelectItem>
            <SelectItem value="regulatory">Regulatory</SelectItem>
            <SelectItem value="diplomatic">Diplomatic</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <FormActions type="Engagement" isLoading={isLoading} onCancel={onCancel} />
    </form>
  );
}

// ── Note Form ──

function NoteForm({
  context,
  onSuccess,
  onCancel,
}: {
  context?: LucidContext;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [content, setContent] = useState("");
  const { mutate, isLoading } = useCreate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    mutate(
      {
        resource: "notes",
        values: {
          content: content.trim(),
          createdBy: "current-user",
          organizationId: context?.organizationId ?? "",
          engagementId: context?.engagementId ?? "",
        },
      },
      {
        onSuccess: () => {
          toast.success("Note created");
          onSuccess();
        },
        onError: () => toast.error("Failed to create note"),
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {context?.organizationName && (
        <ContextBadge label="Organization" value={context.organizationName} />
      )}
      {context?.engagementName && (
        <ContextBadge label="Engagement" value={context.engagementName} />
      )}
      <div className="space-y-2">
        <Label htmlFor="note-content">Content *</Label>
        <Textarea
          id="note-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note..."
          rows={4}
          required
          autoFocus
        />
      </div>
      <FormActions type="Note" isLoading={isLoading} onCancel={onCancel} />
    </form>
  );
}

// ── Contact Form ──

function ContactForm({
  context,
  onSuccess,
  onCancel,
}: {
  context?: LucidContext;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const { mutate, isLoading } = useCreate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) return;
    mutate(
      {
        resource: "contacts",
        values: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim() || undefined,
          organizationId: context?.organizationId ?? "",
        },
      },
      {
        onSuccess: () => {
          toast.success("Contact created");
          onSuccess();
        },
        onError: () => toast.error("Failed to create contact"),
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {context?.organizationName && (
        <ContextBadge label="Organization" value={context.organizationName} />
      )}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contact-first">First Name *</Label>
          <Input
            id="contact-first"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First name"
            required
            autoFocus
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-last">Last Name *</Label>
          <Input
            id="contact-last"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last name"
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact-email">Email</Label>
        <Input
          id="contact-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@example.com"
        />
      </div>
      <FormActions type="Contact" isLoading={isLoading} onCancel={onCancel} />
    </form>
  );
}

// ── Match Form ──

function MatchForm({
  onSuccess,
  onCancel,
}: {
  context?: LucidContext;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [orgAId, setOrgAId] = useState("");
  const [orgBId, setOrgBId] = useState("");
  const [score, setScore] = useState("50");
  const [reason, setReason] = useState("");
  const { mutate, isLoading } = useCreate();

  const { data: orgsData } = useList({
    resource: "organizations",
    pagination: { pageSize: 100 },
  });
  const orgs = (orgsData?.data ?? []) as { id: string; name: string }[];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgAId || !orgBId || !reason.trim()) return;
    mutate(
      {
        resource: "matches",
        values: {
          organizationAId: orgAId,
          organizationBId: orgBId,
          matchScore: Number(score),
          matchReason: reason.trim(),
          status: "pending",
          category: "partnership",
          suggestedBy: "current-user",
        },
      },
      {
        onSuccess: () => {
          toast.success("Match created");
          onSuccess();
        },
        onError: () => toast.error("Failed to create match"),
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Organization A *</Label>
        <Select value={orgAId} onValueChange={setOrgAId}>
          <SelectTrigger>
            <SelectValue placeholder="Select organization" />
          </SelectTrigger>
          <SelectContent>
            {orgs.map((o) => (
              <SelectItem key={o.id} value={o.id}>
                {o.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Organization B *</Label>
        <Select value={orgBId} onValueChange={setOrgBId}>
          <SelectTrigger>
            <SelectValue placeholder="Select organization" />
          </SelectTrigger>
          <SelectContent>
            {orgs
              .filter((o) => o.id !== orgAId)
              .map((o) => (
                <SelectItem key={o.id} value={o.id}>
                  {o.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="match-score">Score</Label>
        <Input
          id="match-score"
          type="number"
          min="0"
          max="100"
          value={score}
          onChange={(e) => setScore(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="match-reason">Reason *</Label>
        <Textarea
          id="match-reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Why should these organizations be matched?"
          rows={3}
          required
          autoFocus
        />
      </div>
      <FormActions type="Match" isLoading={isLoading} onCancel={onCancel} />
    </form>
  );
}

// ── Form Actions ──

function FormActions({
  type,
  isLoading,
  onCancel,
}: {
  type: string;
  isLoading: boolean;
  onCancel: () => void;
}) {
  return (
    <div className="flex justify-end gap-2 pt-2">
      <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
        Cancel
      </Button>
      <Button type="submit" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Create {type}
      </Button>
    </div>
  );
}

// ── Inline Form Router ──

function LucidInlineForm({
  type,
  context,
  onSuccess,
  onCancel,
}: {
  type: EntityType;
  context?: LucidContext;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const typeLabel = TYPE_OPTIONS.find((t) => t.type === type)!.label;
  const TypeIcon = TYPE_OPTIONS.find((t) => t.type === type)!.icon;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <TypeIcon className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">New {typeLabel}</span>
      </div>
      {type === "task" && <TaskForm context={context} onSuccess={onSuccess} onCancel={onCancel} />}
      {type === "engagement" && <EngagementForm context={context} onSuccess={onSuccess} onCancel={onCancel} />}
      {type === "note" && <NoteForm context={context} onSuccess={onSuccess} onCancel={onCancel} />}
      {type === "contact" && <ContactForm context={context} onSuccess={onSuccess} onCancel={onCancel} />}
      {type === "match" && <MatchForm context={context} onSuccess={onSuccess} onCancel={onCancel} />}
    </div>
  );
}

// ── Main Component ──

export function LucidButton({ context }: { context?: LucidContext }) {
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<EntityType | null>(null);

  const handleClose = () => {
    setOpen(false);
    setSelectedType(null);
  };

  const handleSuccess = () => {
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) setSelectedType(null);
      }}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Plus className="h-4 w-4" />
              <span className="sr-only">Quick Add</span>
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>Quick Add</TooltipContent>
      </Tooltip>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Quick Add</DialogTitle>
        </DialogHeader>
        {selectedType === null ? (
          <LucidTypeSelector onSelect={setSelectedType} />
        ) : (
          <LucidInlineForm
            type={selectedType}
            context={context}
            onSuccess={handleSuccess}
            onCancel={() => setSelectedType(null)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
