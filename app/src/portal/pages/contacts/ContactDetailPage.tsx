import { useOne } from "@refinedev/core";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Pencil } from "lucide-react";

export function ContactDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { query: contactQuery } = useOne({ resource: "contacts", id: id! });
  const contact = contactQuery.data?.data;

  const { query: orgQuery } = useOne({
    resource: "organizations",
    id: (contact?.organizationId as string) ?? "",
    queryOptions: { enabled: Boolean(contact?.organizationId) },
  });
  const org = orgQuery.data?.data;

  if (contactQuery.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Contact not found</p>
        <Button variant="outline" onClick={() => navigate("/portal/contacts")}>
          Back to list
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/portal/contacts")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1
              className="text-3xl font-bold tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {contact.firstName as string} {contact.lastName as string}
            </h1>
            {contact.role && (
              <div className="mt-1">
                <Badge variant="secondary">{contact.role as string}</Badge>
              </div>
            )}
          </div>
        </div>
        <Button variant="outline" onClick={() => navigate(`/portal/contacts/edit/${id}`)}>
          <Pencil className="mr-2 h-4 w-4" /> Edit
        </Button>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardContent className="pt-6">
              <dl className="grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                  <dd>{(contact.email as string) || "—"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Phone</dt>
                  <dd>{(contact.phone as string) || "—"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Role</dt>
                  <dd>{(contact.role as string) || "—"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Organization</dt>
                  <dd>
                    {contact.organizationId ? (
                      <Link
                        to={`/portal/organizations/${contact.organizationId}`}
                        className="text-primary hover:underline"
                      >
                        {(org?.name as string) ?? "Loading..."}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Activity timeline coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
