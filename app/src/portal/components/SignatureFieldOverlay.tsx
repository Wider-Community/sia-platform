import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { X } from "lucide-react";

export interface FieldRect {
  id: string;
  signerId: string;
  signerName: string;
  page: number;
  xPct: number;
  yPct: number;
  widthPct: number;
  heightPct: number;
  color: string;
}

interface DraggableFieldProps {
  field: FieldRect;
  onRemove: (id: string) => void;
  interactive?: boolean;
  onClick?: () => void;
  highlight?: boolean;
  signed?: boolean;
}

export function DraggableField({
  field,
  onRemove,
  interactive = true,
  onClick,
  highlight = false,
  signed = false,
}: DraggableFieldProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: field.id,
    disabled: !interactive,
  });

  const style: React.CSSProperties = {
    position: "absolute",
    left: `${field.xPct}%`,
    top: `${field.yPct}%`,
    width: `${field.widthPct}%`,
    height: `${field.heightPct}%`,
    border: `2px ${signed ? "solid" : "dashed"} ${field.color}`,
    backgroundColor: signed
      ? `${field.color}15`
      : highlight
        ? `${field.color}30`
        : `${field.color}20`,
    borderRadius: 4,
    cursor: interactive ? "grab" : onClick ? "pointer" : "default",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "10px",
    color: field.color,
    fontWeight: 600,
    userSelect: "none",
    transform: transform ? CSS.Translate.toString(transform) : undefined,
    zIndex: 10,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(interactive ? { ...attributes, ...listeners } : {})}
      onClick={onClick}
    >
      <span className="truncate px-1">
        {signed ? "Signed" : field.signerName}
      </span>
      {interactive && (
        <button
          className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-white"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(field.id);
          }}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}

interface FieldOverlayProps {
  fields: FieldRect[];
  currentPage: number;
  onRemove: (id: string) => void;
  interactive?: boolean;
  onFieldClick?: (id: string) => void;
  highlightFieldIds?: string[];
  signedFieldIds?: string[];
}

export function SignatureFieldOverlay({
  fields,
  currentPage,
  onRemove,
  interactive = true,
  onFieldClick,
  highlightFieldIds = [],
  signedFieldIds = [],
}: FieldOverlayProps) {
  const pageFields = fields.filter((f) => f.page === currentPage);

  return (
    <div className="absolute inset-0" style={{ pointerEvents: interactive || onFieldClick ? "auto" : "none" }}>
      {pageFields.map((field) => (
        <DraggableField
          key={field.id}
          field={field}
          onRemove={onRemove}
          interactive={interactive}
          onClick={onFieldClick ? () => onFieldClick(field.id) : undefined}
          highlight={highlightFieldIds.includes(field.id)}
          signed={signedFieldIds.includes(field.id)}
        />
      ))}
    </div>
  );
}
