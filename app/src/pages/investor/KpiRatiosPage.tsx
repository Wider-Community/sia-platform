import { useMemo } from "react";
import { KpiCard } from "@/components/investor/KpiCard";
import {
  useStore,
  calcMonthlyForecast,
  calcTierSubsAtMonth,
} from "@/stores/financialModel";

const fmt = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const pct = (n: number) => n.toFixed(1) + "%";

export function KpiRatiosPage() {
  const store = useStore();
  const forecast = useMemo(() => calcMonthlyForecast(store), [store]);

  const y1 = forecast.slice(0, 12);
  const y2 = forecast.slice(12, 24);

  const y1Revenue = y1.reduce((a, m) => a + m.totalRevenue, 0);
  const y1Costs = y1.reduce((a, m) => a + m.totalCosts, 0);
  const y1Net = y1.reduce((a, m) => a + m.netProfit, 0);
  const y1Gross = y1.reduce((a, m) => a + m.grossProfit, 0);
  const y2Revenue = y2.reduce((a, m) => a + m.totalRevenue, 0);

  const grossMargin = y1Revenue ? (y1Gross / y1Revenue) * 100 : 0;
  const netMargin = y1Revenue ? (y1Net / y1Revenue) * 100 : 0;

  const totalCapex = store.capex.reduce((a, r) => a + r.cost, 0);
  const roi = totalCapex ? (y1Net / totalCapex) * 100 : 0;

  // Burn rate = average monthly costs in Y1
  const burnRate = y1Costs / 12;

  // Runway = last month's cumCash / burn rate
  const lastCumCash = forecast[forecast.length - 1].cumCash;
  const runway = burnRate > 0 ? lastCumCash / burnRate : 0;

  // CAC estimate: marketing opex / new subscribers per year
  const marketingOpex = store.opex
    .filter((o) => o.category.toLowerCase().includes("marketing"))
    .reduce((a, o) => a + o.monthlyCost * o.quantity * o.months, 0);
  const newSubsPerYear = store.subTiers.reduce((a, t) => a + t.newSubsPerMonth * 12, 0);
  const cac = newSubsPerYear > 0 ? marketingOpex / newSubsPerYear : 0;

  // Monthly Sub MRR at month 12
  const monthlySubMRR = store.subTiers.reduce(
    (a, tier) => a + tier.price * calcTierSubsAtMonth(tier, 12),
    0
  );

  // Sub coverage
  const subCoverage = burnRate > 0 ? (monthlySubMRR / burnRate) * 100 : 0;

  // YoY growth
  const yoyGrowth = y1Revenue ? ((y2Revenue - y1Revenue) / y1Revenue) * 100 : 0;

  const ratios = [
    {
      label: "Gross Margin",
      value: pct(grossMargin),
      trend: grossMargin >= 50 ? "Strong" : "Below 50%",
      trendUp: grossMargin >= 50,
    },
    {
      label: "Net Margin",
      value: pct(netMargin),
      trend: netMargin >= 0 ? "Profitable" : "Loss-making",
      trendUp: netMargin >= 0,
    },
    {
      label: "ROI",
      value: pct(roi),
      trend: roi >= 100 ? "Above 100%" : "Below 100%",
      trendUp: roi >= 100,
    },
    {
      label: "Burn Rate",
      value: fmt(burnRate) + "/mo",
      trend: "Monthly operating cost",
      trendUp: true,
    },
    {
      label: "Runway",
      value: runway > 0 ? `${runway.toFixed(1)} months` : "N/A",
      trend: runway >= 12 ? "12+ months" : "Under 12 months",
      trendUp: runway >= 12,
    },
    {
      label: "CAC",
      value: cac > 0 ? fmt(cac) : "N/A",
      trend: cac > 0 && cac < 5000 ? "Efficient" : "High",
      trendUp: cac > 0 && cac < 5000,
    },
    {
      label: "Subscription MRR",
      value: fmt(monthlySubMRR),
      trend: pct(subCoverage) + " cost coverage",
      trendUp: subCoverage >= 50,
    },
    {
      label: "Sub Coverage %",
      value: pct(subCoverage),
      trend: subCoverage >= 50 ? "Strong" : "Below 50%",
      trendUp: subCoverage >= 50,
    },
    {
      label: "Y1 Revenue",
      value: fmt(y1Revenue),
      trend: y1Revenue > 0 ? "Active" : "No revenue",
      trendUp: y1Revenue > 0,
    },
    {
      label: "Y2 Revenue",
      value: fmt(y2Revenue),
      trend: pct(yoyGrowth) + " YoY growth",
      trendUp: yoyGrowth > 0,
    },
    {
      label: "YoY Growth",
      value: pct(yoyGrowth),
      trend: yoyGrowth >= 20 ? "Strong growth" : "Moderate",
      trendUp: yoyGrowth >= 20,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="section-label">KPI & Ratios</div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {ratios.map((r) => (
          <KpiCard key={r.label} {...r} />
        ))}
      </div>
    </div>
  );
}
