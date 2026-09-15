import Link from "next/link";
import {
  AlertTriangle,
  Building2,
  CreditCard,
  Percent,
  Wrench,
} from "lucide-react";
import {
  listLeases,
  listMaintenanceRequests,
  listPayments,
  listProperties,
  listTenants,
  listUnits,
} from "@/lib/data";
import { requireAuth } from "@/lib/auth";
import { StatCard } from "@/components/StatCard";
import { RevenueChart } from "@/components/RevenueChart";
import { Badge } from "@/components/Badge";
import { PageHeader } from "@/components/PageHeader";
import { formatCurrency, formatDate, daysBetween, todayIso } from "@/lib/format";
import { findProperty, findTenant, findUnit, tenantName, unitLabel } from "@/lib/selectors";
import { leaseStatusMeta, maintenancePriorityMeta } from "@/lib/statusMeta";

export default async function DashboardPage() {
  const user = await requireAuth();
  const properties = listProperties(user.id);
  const units = listUnits(user.id);
  const tenants = listTenants(user.id);
  const leases = listLeases(user.id);
  const payments = listPayments(user.id);
  const maintenanceRequests = listMaintenanceRequests(user.id);

  const occupiedUnits = units.filter((u) => u.status === "occupee").length;
  const occupancyRate = units.length ? Math.round((occupiedUnits / units.length) * 100) : 0;

  const activeLeases = leases.filter((l) => l.status === "actif" || l.status === "a_renouveler");
  const monthlyRevenue = activeLeases.reduce((sum, l) => sum + l.monthlyRent, 0);

  const overduePayments = payments
    .filter((p) => p.status === "en_retard")
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  const openMaintenance = maintenanceRequests.filter((m) => m.status !== "resolue");

  const today = todayIso();
  const upcomingRenewals = leases
    .filter((l) => (l.status === "actif" || l.status === "a_renouveler") && daysBetween(today, l.endDate) <= 60 && daysBetween(today, l.endDate) >= 0)
    .sort((a, b) => a.endDate.localeCompare(b.endDate));

  const chartData = buildMonthlyRevenue(payments);

  return (
    <div>
      <PageHeader
        title="Tableau de bord"
        description="Vue d'ensemble de votre portefeuille immobilier"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Revenu mensuel (baux actifs)"
          value={formatCurrency(monthlyRevenue)}
          icon={CreditCard}
          tone="slate"
        />
        <StatCard
          label="Taux d'occupation"
          value={`${occupancyRate}%`}
          hint={`${occupiedUnits} / ${units.length} unites occupees`}
          icon={Percent}
          tone="green"
        />
        <StatCard
          label="Paiements en retard"
          value={String(overduePayments.length)}
          icon={AlertTriangle}
          tone={overduePayments.length > 0 ? "red" : "slate"}
        />
        <StatCard
          label="Demandes de maintenance ouvertes"
          value={String(openMaintenance.length)}
          icon={Wrench}
          tone={openMaintenance.length > 0 ? "amber" : "slate"}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Revenus encaisses (6 derniers mois)</h2>
          </div>
          <RevenueChart data={chartData} />
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 font-semibold text-slate-900">Renouvellements a venir (60 jours)</h2>
          {upcomingRenewals.length === 0 ? (
            <p className="text-sm text-slate-500">Aucun renouvellement dans les 60 prochains jours.</p>
          ) : (
            <ul className="space-y-3">
              {upcomingRenewals.map((lease) => {
                const unit = findUnit(units, lease.unitId);
                const property = findProperty(properties, unit?.propertyId);
                const tenant = findTenant(tenants, lease.tenantId);
                return (
                  <li key={lease.id}>
                    <Link
                      href="/baux"
                      className="flex items-center justify-between rounded-lg border border-gray-100 p-3 hover:bg-slate-50"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-900">{tenantName(tenant)}</p>
                        <p className="text-xs text-slate-500">{unitLabel(unit, property)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500">{formatDate(lease.endDate)}</p>
                        <Badge tone={leaseStatusMeta[lease.status].tone}>
                          {leaseStatusMeta[lease.status].label}
                        </Badge>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Paiements en retard</h2>
            <Link href="/paiements" className="text-sm font-medium text-slate-600 hover:text-slate-900">
              Tout voir
            </Link>
          </div>
          {overduePayments.length === 0 ? (
            <p className="text-sm text-slate-500">Aucun paiement en retard. Bravo !</p>
          ) : (
            <ul className="space-y-3">
              {overduePayments.slice(0, 5).map((payment) => {
                const lease = leases.find((l) => l.id === payment.leaseId);
                const tenant = lease ? findTenant(tenants, lease.tenantId) : undefined;
                const unit = lease ? findUnit(units, lease.unitId) : undefined;
                const property = findProperty(properties, unit?.propertyId);
                return (
                  <li
                    key={payment.id}
                    className="flex items-center justify-between rounded-lg border border-gray-100 p-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900">{tenantName(tenant)}</p>
                      <p className="text-xs text-slate-500">{unitLabel(unit, property)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900">{formatCurrency(payment.amount)}</p>
                      <p className="text-xs text-slate-500">Echu le {formatDate(payment.dueDate)}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Maintenance a traiter</h2>
            <Link href="/maintenance" className="text-sm font-medium text-slate-600 hover:text-slate-900">
              Tout voir
            </Link>
          </div>
          {openMaintenance.length === 0 ? (
            <p className="text-sm text-slate-500">Aucune demande ouverte.</p>
          ) : (
            <ul className="space-y-3">
              {openMaintenance.slice(0, 5).map((request) => {
                const unit = findUnit(units, request.unitId);
                const property = findProperty(properties, unit?.propertyId);
                return (
                  <li
                    key={request.id}
                    className="flex items-center justify-between rounded-lg border border-gray-100 p-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900">{request.title}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Building2 className="h-3 w-3" /> {unitLabel(unit, property)}
                      </p>
                    </div>
                    <Badge tone={maintenancePriorityMeta[request.priority].tone}>
                      {maintenancePriorityMeta[request.priority].label}
                    </Badge>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function buildMonthlyRevenue(payments: { dueDate: string; amount: number; status: string }[]) {
  const months: { key: string; label: string; total: number }[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("fr-CA", { month: "short" });
    months.push({ key, label, total: 0 });
  }
  for (const payment of payments) {
    if (payment.status !== "paye") continue;
    const key = payment.dueDate.slice(0, 7);
    const bucket = months.find((m) => m.key === key);
    if (bucket) bucket.total += payment.amount;
  }
  return months.map((m) => ({ month: m.label, total: m.total }));
}
