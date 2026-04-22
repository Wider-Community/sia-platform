import { useMemo } from "react";
import { KpiCard } from "@/components/investor/KpiCard";
import { ChartCard } from "@/components/investor/ChartCard";
import {
  useStore,
  calcMonthlyForecast,
  calcBreakevenMonth,
  calcPeakDeficit,
} from "@/stores/financialModel";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Legend,
} from "recharts";

const fmt = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const tooltipStyle = {
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  color: "var(--text)",
};

export function BreakevenPage() {
  const store = useStore();
  const forecast = useMemo(() => calcMonthlyForecast(store), [store]);

  const beMonth = calcBreakevenMonth(forecast);
  const peakDef = calcPeakDeficit(forecast);

  // Months to cash positive (cumCash > 0)
  const cashPosMonth = forecast.find((m) => m.cumCash > 0)?.month ?? null;

  const revCostData = forecast.map((m) => ({
    label: m.label,
    revenue: Math.round(m.totalRevenue),
    costs: Math.round(m.totalCosts),
  }));

  const cumCashData = forecast.map((m) => ({
    label: m.label,
    cumCash: Math.round(m.cumCash),
  }));

  // Find approximate breakeven revenue value for reference line
  const beRevenue = beMonth ? Math.round(forecast[beMonth - 1].totalRevenue) : null;

  return (
    <div className="space-y-8">
      <div className="section-label">Breakeven Analysis</div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard
          label="Breakeven Month"
          value={beMonth ? `Month ${beMonth}` : "N/A"}
          trend={beMonth && beMonth <= 12 ? "Within Year 1" : "Beyond Y1"}
          trendUp={beMonth !== null && beMonth <= 12}
        />
        <KpiCard
          label="Peak Funding Deficit"
          value={fmt(peakDef)}
          trend={peakDef < 0 ? "External funding needed" : "Self-funded"}
          trendUp={peakDef >= 0}
        />
        <KpiCard
          label="Months to Cash Positive"
          value={cashPosMonth ? `Month ${cashPosMonth}` : "N/A"}
          trend={cashPosMonth && cashPosMonth <= 12 ? "Within Year 1" : "Beyond Y1"}
          trendUp={cashPosMonth !== null && cashPosMonth <= 12}
        />
      </div>

      {/* Revenue vs Total Costs */}
      <ChartCard title="Revenue vs Total Costs">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={revCostData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="label" tick={{ fill: "var(--text-tertiary)", fontSize: 12 }} />
            <YAxis tick={{ fill: "var(--text-tertiary)", fontSize: 12 }} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => fmt(v)} />
            <Legend />
            <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#c8a951" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="costs" name="Total Costs" stroke="#E24B4A" strokeWidth={2} dot={{ r: 3 }} />
            {beMonth && beRevenue && (
              <ReferenceLine
                x={`M${beMonth}`}
                stroke="var(--text-tertiary)"
                strokeDasharray="5 5"
                label={{ value: `Breakeven (M${beMonth})`, fill: "var(--text-tertiary)", fontSize: 11 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Cumulative Cash */}
      <ChartCard title="Cumulative Cash Position">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={cumCashData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="label" tick={{ fill: "var(--text-tertiary)", fontSize: 12 }} />
            <YAxis tick={{ fill: "var(--text-tertiary)", fontSize: 12 }} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => fmt(v)} />
            <ReferenceLine y={0} stroke="var(--text-tertiary)" strokeDasharray="3 3" />
            <Line type="monotone" dataKey="cumCash" name="Cumulative Cash" stroke="#c8a951" strokeWidth={2} dot={{ fill: "#c8a951", r: 3 }} activeDot={{ r: 5, fill: "#c8a951", stroke: "var(--surface)", strokeWidth: 2 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
