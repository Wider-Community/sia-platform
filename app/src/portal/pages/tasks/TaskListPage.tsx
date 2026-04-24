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
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUpdate } from "@refinedev/core";
import type { Task } from "../../schemas";

const priorityColor: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  high: "destructive",
  medium: "default",
  low: "secondary",
};

export function TaskListPage() {
  const navigate = useNavigate();
  const [globalFilter, setGlobalFilter] = useState("");
  const { mutate: updateTask } = useUpdate();

  const columns = useMemo<ColumnDef<Task>[]>(
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
        accessorKey: "organizationName",
        header: "Organization",
        cell: ({ getValue }) => getValue<string>() || "—",
      },
      {
        accessorKey: "dueDate",
        header: ({ column }) => (
          <Button variant="ghost" onClick={() => column.toggleSorting()}>
            Due Date <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString(),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => {
          const s = getValue<string>();
          return <Badge variant={s === "done" ? "secondary" : "default"}>{s}</Badge>;
        },
        filterFn: "equals",
      },
      {
        accessorKey: "priority",
        header: "Priority",
        cell: ({ getValue }) => {
          const p = getValue<string>();
          return <Badge variant={priorityColor[p] ?? "outline"}>{p}</Badge>;
        },
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const task = row.original;
          if (task.status === "done") return null;
          return (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                updateTask({
                  resource: "tasks",
                  id: task.id,
                  values: { status: "done" },
                });
              }}
            >
              Mark Done
            </Button>
          );
        },
      },
    ],
    [updateTask],
  );

  const { reactTable, refineCore } = useTable<Task>({
    columns,
    refineCoreProps: {
      resource: "tasks",
      pagination: { mode: "client", pageSize: 10 },
      sorters: { initial: [{ field: "dueDate", order: "asc" }] },
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1
          className="text-3xl font-bold tracking-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Tasks
        </h1>
        <Button onClick={() => navigate("/portal/tasks/create")}>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Search tasks..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-xs"
        />
        <Select
          value={(reactTable.getColumn("status")?.getFilterValue() as string) ?? "all"}
          onValueChange={(v) =>
            reactTable.getColumn("status")?.setFilterValue(v === "all" ? undefined : v)
          }
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="done">Done</SelectItem>
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
                      : flexRender(header.column.columnDef.header, header.getContext())}
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
              reactTable.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No tasks found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {reactTable.getFilteredRowModel().rows.length} task(s)
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
    </div>
  );
}
