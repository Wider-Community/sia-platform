import { useState, useMemo } from "react";
import { useList } from "@refinedev/core";
import { useNavigate } from "react-router-dom";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { Organization } from "../../schemas";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const STAGE_COLORS: Record<string, string> = {
  prospect: "#94a3b8",
  engaged: "#3b82f6",
  due_diligence: "#f59e0b",
  negotiation: "#8b5cf6",
  active_partner: "#22c55e",
  inactive: "#6b7280",
};

const STAGE_LABELS: Record<string, string> = {
  prospect: "Prospect",
  engaged: "Engaged",
  due_diligence: "Due Diligence",
  negotiation: "Negotiation",
  active_partner: "Active Partner",
  inactive: "Inactive",
};

const COUNTRY_COORDS: Record<string, [number, number]> = {
  "UAE": [54.3, 24.5],
  "United Arab Emirates": [54.3, 24.5],
  "Saudi Arabia": [45.1, 23.9],
  "United States": [-95.7, 37.1],
  "USA": [-95.7, 37.1],
  "United Kingdom": [-1.2, 52.2],
  "UK": [-1.2, 52.2],
  "Germany": [10.4, 51.2],
  "France": [2.2, 46.6],
  "India": [78.9, 20.6],
  "China": [104.2, 35.9],
  "Japan": [138.3, 36.2],
  "South Korea": [127.8, 35.9],
  "Singapore": [103.8, 1.4],
  "Australia": [133.8, -25.3],
  "Canada": [-106.3, 56.1],
  "Brazil": [-51.9, -14.2],
  "Mexico": [-102.6, 23.6],
  "Egypt": [30.8, 26.8],
  "South Africa": [22.9, -30.6],
  "Nigeria": [8.7, 9.1],
  "Kenya": [37.9, -0.02],
  "Turkey": [35.2, 38.9],
  "Italy": [12.6, 41.9],
  "Spain": [-3.7, 40.5],
  "Netherlands": [5.3, 52.1],
  "Switzerland": [8.2, 46.8],
  "Sweden": [18.6, 60.1],
  "Norway": [8.5, 60.5],
  "Poland": [19.1, 51.9],
  "Qatar": [51.2, 25.3],
  "Bahrain": [50.6, 26.0],
  "Kuwait": [47.5, 29.3],
  "Oman": [55.9, 21.5],
  "Jordan": [36.2, 30.6],
  "Lebanon": [35.9, 33.9],
  "Iraq": [43.7, 33.2],
  "Iran": [53.7, 32.4],
  "Pakistan": [69.3, 30.4],
  "Bangladesh": [90.4, 23.7],
  "Indonesia": [113.9, -0.8],
  "Malaysia": [101.9, 4.2],
  "Thailand": [100.5, 15.9],
  "Vietnam": [108.3, 14.1],
  "Philippines": [121.8, 12.9],
  "New Zealand": [174.9, -40.9],
  "Argentina": [-63.6, -38.4],
  "Colombia": [-74.3, 4.6],
  "Chile": [-71.5, -35.7],
  "Peru": [-75.0, -9.2],
  "Morocco": [-7.1, 31.8],
  "Tunisia": [9.5, 33.9],
  "Russia": [105.3, 61.5],
  "Ukraine": [31.2, 48.4],
};

function getOrgStage(org: Organization & Record<string, unknown>): string {
  return (
    (org.stage as string) ??
    (org.nodeDetails as Record<string, unknown>)?.stage as string ??
    org.status ??
    "prospect"
  );
}

export function MapPage() {
  const navigate = useNavigate();
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [tooltip, setTooltip] = useState<{
    name: string;
    stage: string;
    type: string;
    x: number;
    y: number;
  } | null>(null);

  const { data, isLoading } = useList<Organization>({
    resource: "organizations",
    pagination: { pageSize: 500 },
  });

  const markers = useMemo(() => {
    if (!data?.data) return [];
    return data.data
      .map((org: Organization & Record<string, unknown>) => {
        const country = org.country as string | undefined;
        if (!country || !COUNTRY_COORDS[country]) return null;
        const stage = getOrgStage(org);
        return {
          id: org.id,
          name: org.name,
          country,
          type: org.type,
          stage,
          coordinates: COUNTRY_COORDS[country],
        };
      })
      .filter(Boolean) as Array<{
        id: string;
        name: string;
        country: string;
        type: string;
        stage: string;
        coordinates: [number, number];
      }>;
  }, [data]);

  const filtered = useMemo(() => {
    return markers.filter((m) => {
      if (stageFilter !== "all" && m.stage !== stageFilter) return false;
      if (typeFilter !== "all" && m.type !== typeFilter) return false;
      return true;
    });
  }, [markers, stageFilter, typeFilter]);

  return (
    <div className="space-y-6 p-6">
      <h1
        className="text-2xl font-bold"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Organization Map
      </h1>

      <div className="flex flex-wrap gap-4">
        <Select value={stageFilter} onValueChange={setStageFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            {Object.entries(STAGE_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="partner">Partner</SelectItem>
            <SelectItem value="investor">Investor</SelectItem>
            <SelectItem value="vendor">Vendor</SelectItem>
            <SelectItem value="client">Client</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex flex-wrap gap-2 items-center ml-4">
          {Object.entries(STAGE_LABELS).map(([key, label]) => (
            <Badge
              key={key}
              variant="outline"
              className="gap-1.5"
            >
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: STAGE_COLORS[key] }}
              />
              {label}
            </Badge>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="p-0 relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
              <span className="text-muted-foreground">Loading...</span>
            </div>
          )}
          <ComposableMap
            projectionConfig={{ scale: 147 }}
            style={{ width: "100%", height: "auto" }}
          >
            <ZoomableGroup>
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="#1e293b"
                      stroke="#334155"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none" },
                        hover: { outline: "none", fill: "#334155" },
                        pressed: { outline: "none" },
                      }}
                    />
                  ))
                }
              </Geographies>
              {filtered.map((m) => (
                <Marker
                  key={m.id}
                  coordinates={m.coordinates}
                  onClick={() => navigate(`/portal/organizations/${m.id}`)}
                  onMouseEnter={(e) => {
                    const target = e.target as SVGElement;
                    const ctm = target.getScreenCTM();
                    setTooltip({
                      name: m.name,
                      stage: STAGE_LABELS[m.stage] ?? m.stage,
                      type: m.type,
                      x: ctm ? ctm.e : 0,
                      y: ctm ? ctm.f - 40 : 0,
                    });
                  }}
                  onMouseLeave={() => setTooltip(null)}
                  style={{ cursor: "pointer" }}
                >
                  <circle
                    r={5}
                    fill={STAGE_COLORS[m.stage] ?? "#94a3b8"}
                    stroke="#fff"
                    strokeWidth={1.5}
                  />
                </Marker>
              ))}
            </ZoomableGroup>
          </ComposableMap>

          {tooltip && (
            <div
              className="fixed z-50 rounded-md bg-popover px-3 py-2 text-sm text-popover-foreground shadow-md border pointer-events-none"
              style={{ left: tooltip.x, top: tooltip.y, transform: "translate(-50%, -100%)" }}
            >
              <div className="font-semibold">{tooltip.name}</div>
              <div className="text-muted-foreground">
                {tooltip.stage} &middot; {tooltip.type}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
