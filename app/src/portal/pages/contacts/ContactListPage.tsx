import { useList, useDelete } from "@refinedev/core";
import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { PageShell } from "../../components/PageShell";
import { PageHeader } from "../../components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AnimatedButton } from "../../components/AnimatedButton";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
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
import { Plus, Users, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { EmptyState } from "../../components/EmptyState";
import type { BaseRecord } from "@refinedev/core";

export function ContactListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const { mutate: deleteContact } = useDelete();

  const { result: contactsResult, query: contactsQuery } = useList({
    resource: "contacts",
    pagination: { mode: "off" },
  });
  const contactsData = contactsResult;
  const isLoading = contactsQuery.isLoading;

  const { result: orgsResult } = useList({
    resource: "organizations",
    pagination: { mode: "off" },
  });
  const orgsData = orgsResult;

  const orgMap = useMemo(() => {
    const map = new Map<string, string>();
    orgsData?.data?.forEach((org) => {
      map.set(org.id as string, org.name as string);
    });
    return map;
  }, [orgsData]);

  const filtered = useMemo(() => {
    const contacts = contactsData?.data ?? [];
    if (!search.trim()) return contacts;
    const q = search.toLowerCase();
    return contacts.filter((c) => {
      const name = `${c.firstName} ${c.lastName}`.toLowerCase();
      const email = ((c.email as string) ?? "").toLowerCase();
      return name.includes(q) || email.includes(q);
    });
  }, [contactsData, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages - 1);
  const paged = filtered.slice(safePage * pageSize, (safePage + 1) * pageSize);

  return (
    <PageShell>
      <PageHeader
        title="Contacts"
        actions={
          <AnimatedButton onClick={() => navigate("/portal/contacts/create")}>
            <Plus className="mr-2 h-4 w-4" />
            New Contact
          </AnimatedButton>
        }
      />

      <Input
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(0); }}
        className="max-w-xs"
      />

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-5 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : paged.length > 0 ? (
                <AnimatePresence>
                  {paged.map((c: BaseRecord, index: number) => (
                    <motion.tr
                      key={c.id as string}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                      className="cursor-pointer border-b transition-colors hover:bg-muted/50"
                      onClick={() => navigate(`/portal/contacts/${c.id}`)}
                    >
                      <TableCell className="font-medium">
                        {c.firstName as string} {c.lastName as string}
                      </TableCell>
                      <TableCell>{(c.email as string) || "—"}</TableCell>
                      <TableCell>{(c.phone as string) || "—"}</TableCell>
                      <TableCell>
                        {c.role ? <Badge variant="secondary">{c.role as string}</Badge> : "—"}
                      </TableCell>
                      <TableCell>
                        {c.organizationId ? (
                          <Link
                            to={`/portal/organizations/${c.organizationId}`}
                            className="text-primary hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {orgMap.get(c.organizationId as string) ?? (c.organizationId as string)}
                          </Link>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPendingDeleteId(c.id as string);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              ) : (
                <TableRow>
                  <TableCell colSpan={6}>
                    <EmptyState
                      icon={Users}
                      title="No contacts yet"
                      description="Add your first contact to get started."
                      action={{ label: "New Contact", onClick: () => navigate("/portal/contacts/create") }}
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {filtered.length > pageSize && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {filtered.length} contact(s)
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={safePage === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {safePage + 1} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={safePage >= totalPages - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <AlertDialog open={!!pendingDeleteId} onOpenChange={(open) => { if (!open) setPendingDeleteId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete contact?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{" "}
              {(() => {
                const c = (contactsData?.data ?? []).find((c) => (c.id as string) === pendingDeleteId);
                return c ? `${c.firstName} ${c.lastName}` : "this contact";
              })()}
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingDeleteId) {
                  deleteContact({ resource: "contacts", id: pendingDeleteId });
                }
                setPendingDeleteId(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageShell>
  );
}
