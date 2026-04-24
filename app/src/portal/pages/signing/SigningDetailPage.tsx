import { useOne, useList, useUpdate } from "@refinedev/core";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Download,
  Link as LinkIcon,
  RefreshCw,
  Send,
  XCircle,
} from "lucide-react";
import type { BaseRecord } from "@refinedev/core";
import { PdfViewer } from "../../components/PdfViewer";
import {
  SignatureFieldOverlay,
  type FieldRect,
} from "../../components/SignatureFieldOverlay";
import { assemblePdf, type FieldPlacement } from "../../lib/pdf-assembly";
import { useState, useCallback } from "react";

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

const signerStatusIcon: Record<string, React.ReactNode> = {
  pending: <Clock className="h-4 w-4 text-muted-foreground" />,
  signed: <CheckCircle2 className="h-4 w-4 text-green-600" />,
  declined: <XCircle className="h-4 w-4 text-destructive" />,
};

export function SigningDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const { query: reqQuery } = useOne({
    resource: "signing-requests",
    id: id!,
  });
  const req = reqQuery.data?.data;

  const signersResult = useList({
    resource: "signers",
    filters: [
      { field: "signingRequestId", operator: "eq", value: id },
    ],
    pagination: { mode: "off" },
  });

  const fieldsResult = useList({
    resource: "signature-fields",
    filters: [
      { field: "signingRequestId", operator: "eq", value: id },
    ],
    pagination: { mode: "off" },
  });

  const { mutate: updateRequest } = useUpdate();

  const signersList = (signersResult.data?.data ?? []) as BaseRecord[];
  const fieldsList = (fieldsResult.data?.data ?? []) as BaseRecord[];

  const appUrl = import.meta.env.VITE_APP_URL ?? window.location.origin;

  const fieldRects: FieldRect[] = fieldsList.map((f) => {
    const signer = signersList.find((s) => s.id === f.signerId);
    return {
      id: f.id as string,
      signerId: f.signerId as string,
      signerName: (signer?.name as string) ?? "Unknown",
      page: f.page as number,
      xPct: f.xPct as number,
      yPct: f.yPct as number,
      widthPct: f.widthPct as number,
      heightPct: f.heightPct as number,
      color: (signer?.color as string) ?? "#C8A951",
    };
  });

  const signedFieldIds = fieldsList
    .filter((f) => f.signedImageUrl)
    .map((f) => f.id as string);

  const handleCancel = () => {
    updateRequest({
      resource: "signing-requests",
      id: id!,
      values: { status: "cancelled" },
    });
  };

  const handleDownload = useCallback(async () => {
    if (!req?.pdfUrl) return;
    const signedFields: FieldPlacement[] = fieldsList
      .filter((f) => f.signedImageUrl)
      .map((f) => ({
        page: f.page as number,
        xPct: f.xPct as number,
        yPct: f.yPct as number,
        widthPct: f.widthPct as number,
        heightPct: f.heightPct as number,
        signedImageUrl: f.signedImageUrl as string,
      }));

    if (signedFields.length === 0) {
      // Download original
      const a = document.createElement("a");
      a.href = req.pdfUrl as string;
      a.download = req.pdfFileName as string;
      a.click();
      return;
    }

    try {
      const response = await fetch(req.pdfUrl as string);
      const pdfBytes = new Uint8Array(await response.arrayBuffer());
      const signedPdf = await assemblePdf(pdfBytes, signedFields);
      const blob = new Blob([signedPdf], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `signed-${req.pdfFileName as string}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to assemble PDF:", err);
    }
  }, [req, fieldsList]);

  if (reqQuery.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!req) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Signing request not found</p>
        <Button
          variant="outline"
          onClick={() => navigate("/portal/signing")}
        >
          Back to list
        </Button>
      </div>
    );
  }

  const status = req.status as string;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/portal/signing")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1
              className="text-3xl font-bold tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {req.title as string}
            </h1>
            <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
              <span>{req.pdfFileName as string}</span>
              <Badge variant={statusVariant[status] ?? "outline"}>
                {statusLabel[status] ?? status}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          {(status === "sent" || status === "partially_signed") && (
            <Button variant="destructive" onClick={handleCancel}>
              Cancel Request
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="signers">
        <TabsList>
          <TabsTrigger value="signers">Signers</TabsTrigger>
          <TabsTrigger value="document">Document</TabsTrigger>
        </TabsList>

        <TabsContent value="signers">
          <Card>
            <CardHeader>
              <CardTitle>Signer Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {signersResult.isLoading ? (
                <Skeleton className="h-32 w-full" />
              ) : signersList.length > 0 ? (
                signersList.map((signer) => {
                  const signerFieldCount = fieldsList.filter(
                    (f) => f.signerId === signer.id,
                  ).length;
                  const signerSignedCount = fieldsList.filter(
                    (f) =>
                      f.signerId === signer.id && f.signedImageUrl,
                  ).length;
                  return (
                    <div
                      key={signer.id as string}
                      className="flex items-center gap-3 rounded-md border p-4"
                    >
                      <div
                        className="h-4 w-4 shrink-0 rounded-full"
                        style={{
                          backgroundColor:
                            (signer.color as string) ?? "#C8A951",
                        }}
                      />
                      {signerStatusIcon[signer.status as string]}
                      <div className="flex-1">
                        <p className="font-medium">
                          {signer.name as string}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {signer.email as string}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {signerSignedCount}/{signerFieldCount} fields
                      </Badge>
                      <Badge
                        variant={
                          signer.status === "signed"
                            ? "default"
                            : signer.status === "declined"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {signer.status as string}
                      </Badge>
                      {signer.status === "pending" && (
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Copy signing link"
                            onClick={() => {
                              navigator.clipboard.writeText(
                                `${appUrl}/sign/${signer.token as string}`,
                              );
                            }}
                          >
                            <LinkIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Resend"
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      {signer.signedAt && (
                        <span className="text-xs text-muted-foreground">
                          {new Date(
                            signer.signedAt as string,
                          ).toLocaleString()}
                        </span>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground">
                  No signers yet.
                </p>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  reqQuery.refetch();
                  signersResult.refetch();
                  fieldsResult.refetch();
                }}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Status
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="document">
          <Card>
            <CardContent className="pt-6">
              {req.pdfUrl && (
                <PdfViewer
                  fileUrl={req.pdfUrl as string}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                  overlay={
                    <SignatureFieldOverlay
                      fields={fieldRects}
                      currentPage={currentPage}
                      onRemove={() => {}}
                      interactive={false}
                      signedFieldIds={signedFieldIds}
                    />
                  }
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
