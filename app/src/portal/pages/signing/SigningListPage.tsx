import { useTable } from "@refinedev/react-table";
import {
  type ColumnDef,
  flexRender,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getCoreRowModel,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AnimatedButton } from "../../components/AnimatedButton";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, ArrowUpDown, ChevronLeft, ChevronRight, FileSignature } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { PageShell } from "../../components/PageShell";
import { PageHeader } from "../../components/PageHeader";
import { EmptyState } from "../../components/EmptyState";
import type { SigningRequest } from "../../schemas";

const statusVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  draft: "outline",
  sent: "secondary",
  partially_signed: "secondary",
  completed: "default",
  cancelled: "destructive",
};

const statusLabel: Record<string, string> = {
  draft: "Draft",
  sent: "Sent",
  partially_signed: "Partially Signed",
  completed: "Completed",
  cancelled: "Cancelled",
};

export function SigningListPage() {
  const navigate = useNavigate();
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = useMemo<ColumnDef<SigningRequest>[]>(
    () => [
      {
        accessorKey: "title",
        header: ({ column }) => (
          <Button variant="ghost" onClick={() => column.toggleSorting()}>
            Title <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
      },
      {
        accessorKey: "pdfFileName",
        header: "File",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => {
          const status = getValue<string>();
          return (
            <Badge variant={statusVariant[status] ?? "outline"}>
              {statusLabel[status] ?? status}
            </Badge>
          );
        },
        filterFn: "equals",
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <Button variant="ghost" onClick={() => column.toggleSorting()}>
            Created <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ getValue }) =>
          new Date(getValue<string>()).toLocaleDateString(),
      },
      {
        accessorKey: "updatedAt",
        header: ({ column }) => (
          <Button variant="ghost" onClick={() => column.toggleSorting()}>
            Updated <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ getValue }) =>
          new Date(getValue<string>()).toLocaleDateString(),
      },
    ],
    [],
  );

  const { reactTable, refineCore } = useTable<SigningRequest>({
    columns,
    refineCoreProps: {
      resource: "signing-requests",
      pagination: { mode: "client", pageSize: 10 },
      sorters: { initial: [{ field: "updatedAt", order: "desc" }] },
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
  });

  const isLoading = refineCore.tableQuery.isLoading;

  return (
    <PageShell>
      <PageHeader
        title="Documents"
        actions={
          <AnimatedButton onClick={() => navigate("/portal/signing/new")}>
            <Plus className="mr-2 h-4 w-4" />
            New Signing Request
          </AnimatedButton>
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Search documents..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-xs"
        />
        <Select
          value={
            (reactTable.getColumn("status")?.getFilterValue() as string) ??
            "all"
          }
          onValueChange={(v) =>
            reactTable
              .getColumn("status")
              ?.setFilterValue(v === "all" ? undefined : v)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="partially_signed">Partially Signed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {reactTable.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : reactTable.getRowModel().rows.length ? (
              <AnimatePresence>
                {reactTable.getRowModel().rows.map((row, index) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                    className="cursor-pointer border-b transition-colors hover:bg-muted/50"
                    onClick={() =>
                      navigate(`/portal/signing/${row.original.id}`)
                    }
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </motion.tr>
                ))}
              </AnimatePresence>
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <EmptyState
                    icon={FileSignature}
                    title="No signing requests yet"
                    description="Create your first signing request to collect signatures."
                    action={{ label: "New Signing Request", onClick: () => navigate("/portal/signing/new") }}
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {reactTable.getFilteredRowModel().rows.length} document(s)
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => reactTable.previousPage()}
            disabled={!reactTable.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {reactTable.getState().pagination.pageIndex + 1} of{" "}
            {reactTable.getPageCount()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => reactTable.nextPage()}
            disabled={!reactTable.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </PageShell>
  );
}
