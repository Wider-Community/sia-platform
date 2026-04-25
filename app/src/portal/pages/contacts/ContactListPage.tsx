import { useList } from "@refinedev/core";
import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import type { BaseRecord } from "@refinedev/core";

export function ContactListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const { data: contactsData, isLoading } = useList({
    resource: "contacts",
    pagination: { mode: "off" },
  });

  const { data: orgsData } = useList({
    resource: "organizations",
    pagination: { mode: "off" },
  });

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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1
          className="text-3xl font-bold tracking-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Contacts
        </h1>
        <Button onClick={() => navigate("/portal/contacts/create")}>
          <Plus className="mr-2 h-4 w-4" />
          New Contact
        </Button>
      </div>

      <Input
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filtered.length > 0 ? (
                filtered.map((c: BaseRecord) => (
                  <TableRow
                    key={c.id as string}
                    className="cursor-pointer"
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
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No contacts found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
