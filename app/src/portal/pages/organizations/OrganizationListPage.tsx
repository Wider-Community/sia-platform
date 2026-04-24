import { useTable } from "@refinedev/react-table";
import { type ColumnDef, flexRender } from "@tanstack/react-table";
import { useMemo } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Organization } from "../../schemas";

const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
  active: "default",
  prospect: "secondary",
  inactive: "outline",
};

export function OrganizationListPage() {
  const navigate = useNavigate();

  const columns = useMemo<ColumnDef<Organization>[]>(
    () => [
      { accessorKey: "name", header: "Name" },
      { accessorKey: "type", header: "Type", cell: ({ getValue }) => (
        <span className="capitalize">{getValue<string>()}</span>
      )},
      { accessorKey: "country", header: "Country" },
      { accessorKey: "status", header: "Status", cell: ({ getValue }) => {
        const status = getValue<string>();
        return <Badge variant={statusVariant[status] ?? "outline"}>{status}</Badge>;
      }},
      { accessorKey: "updatedAt", header: "Updated", cell: ({ getValue }) => (
        new Date(getValue<string>()).toLocaleDateString()
      )},
    ],
    [],
  );

  const { reactTable, refineCore } = useTable<Organization>({
    columns,
    refineCoreProps: {
      resource: "organizations",
      pagination: { mode: "client", pageSize: 10 },
      sorters: { initial: [{ field: "updatedAt", order: "desc" }] },
    },
  });

  const isLoading = refineCore.tableQuery.isLoading;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1
          className="text-3xl font-bold tracking-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Organizations
        </h1>
        <Button onClick={() => navigate("/portal/organizations/create")}>
          <Plus className="mr-2 h-4 w-4" />
          New Organization
        </Button>
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
                <TableRow
                  key={row.id}
                  className="cursor-pointer"
                  onClick={() => navigate(`/portal/organizations/${row.original.id}`)}
                >
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
                  No organizations found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
