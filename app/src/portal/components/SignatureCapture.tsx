import { useState, useRef, useCallback } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "@/components/ui/button";
import { AnimatedButton } from "./AnimatedButton";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Pen, Type, Upload } from "lucide-react";

interface SignatureCaptureProps {
  open: boolean;
  onClose: () => void;
  onCapture: (dataUrl: string) => void;
  signerName?: string;
}

export function SignatureCapture({
  open,
  onClose,
  onCapture,
  signerName = "",
}: SignatureCaptureProps) {
  const [tab, setTab] = useState("draw");
  const [typedName, setTypedName] = useState(signerName);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const sigPadRef = useRef<SignatureCanvas>(null);

  const handleConfirm = useCallback(() => {
    let dataUrl = "";
    if (tab === "draw") {
      if (sigPadRef.current?.isEmpty()) return;
      dataUrl = sigPadRef.current?.toDataURL("image/png") ?? "";
    } else if (tab === "type") {
      if (!typedName.trim()) return;
      const canvas = document.createElement("canvas");
      canvas.width = 400;
      canvas.height = 100;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, 400, 100);
      ctx.fillStyle = "#1C1C1E";
      ctx.font = "italic 36px 'Playfair Display', serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(typedName, 200, 50);
      dataUrl = canvas.toDataURL("image/png");
    } else if (tab === "upload") {
      if (!uploadedImage) return;
      dataUrl = uploadedImage;
    }
    if (dataUrl) {
      onCapture(dataUrl);
      onClose();
    }
  }, [tab, typedName, uploadedImage, onCapture, onClose]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setUploadedImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Your Signature</DialogTitle>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="w-full">
            <TabsTrigger value="draw" className="flex-1">
              <Pen className="mr-1 h-4 w-4" /> Draw
            </TabsTrigger>
            <TabsTrigger value="type" className="flex-1">
              <Type className="mr-1 h-4 w-4" /> Type
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex-1">
              <Upload className="mr-1 h-4 w-4" /> Upload
            </TabsTrigger>
          </TabsList>

          <TabsContent value="draw" className="mt-4">
            <div className="rounded-md border bg-white">
              <SignatureCanvas
                ref={sigPadRef}
                canvasProps={{
                  width: 450,
                  height: 150,
                  className: "w-full",
                }}
                penColor="#1C1C1E"
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2"
              onClick={() => sigPadRef.current?.clear()}
            >
              Clear
            </Button>
          </TabsContent>

          <TabsContent value="type" className="mt-4 space-y-3">
            <Input
              value={typedName}
              onChange={(e) => setTypedName(e.target.value)}
              placeholder="Type your full name"
            />
            {typedName && (
              <div className="flex h-[100px] items-center justify-center rounded-md border bg-white">
                <span
                  className="text-3xl italic"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    color: "#1C1C1E",
                  }}
                >
                  {typedName}
                </span>
              </div>
            )}
          </TabsContent>

          <TabsContent value="upload" className="mt-4 space-y-3">
            <Input type="file" accept="image/*" onChange={handleFileChange} />
            {uploadedImage && (
              <div className="flex h-[100px] items-center justify-center rounded-md border bg-white">
                <img
                  src={uploadedImage}
                  alt="Uploaded signature"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <AnimatedButton onClick={handleConfirm}>Apply Signature</AnimatedButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
