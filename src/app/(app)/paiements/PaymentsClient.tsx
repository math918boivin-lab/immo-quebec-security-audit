"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, CreditCard, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/Badge";
import { Modal } from "@/components/Modal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Field, inputClass, PrimaryButton, SecondaryButton } from "@/components/form";
import { formatCurrency, formatDate } from "@/lib/format";
import { paymentStatusMeta } from "@/lib/statusMeta";
import { findProperty, findTenant, findUnit, tenantName, unitLabel } from "@/lib/selectors";
import type { Lease, Payment, PaymentMethod, PaymentStatus, Property, Tenant, Unit } from "@/lib/types";
import { createPayment, deletePayment, markPaymentPaid } from "@/lib/actions";

const emptyForm = {
  leaseId: "",
  amount: 1200,
  dueDate: new Date().toISOString().slice(0, 10),
  status: "en_attente" as PaymentStatus,
  method: "virement" as PaymentMethod,
};

export function PaymentsClient({
  payments,
  leases,
  units,
  properties,
  tenants,
}: {
  payments: Payment[];
  leases: Lease[];
  units: Unit[];
  properties: Property[];
  tenants: Tenant[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [filter, setFilter] = useState<"all" | PaymentStatus>("all");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [toDelete, setToDelete] = useState<Payment | null>(null);
  const [error, setError] = useState<string | null>(null);

  const enriched = useMemo(() => {
    return payments.map((payment) => {
      const lease = leases.find((l) => l.id === payment.leaseId);
      const unit = lease ? findUnit(units, lease.unitId) : undefined;
      const property = findProperty(properties, unit?.propertyId);
      const tenant = lease ? findTenant(tenants, lease.tenantId) : undefined;
      return { payment, tenant, unit, property };
    });
  }, [payments, leases, units, properties, tenants]);

  const filtered = filter === "all" ? enriched : enriched.filter((e) => e.payment.status === filter);
  const sorted = [...filtered].sort((a, b) => b.payment.dueDate.localeCompare(a.payment.dueDate));

  const totals = {
    paye: payments.filter((p) => p.status === "paye").reduce((s, p) => s + p.amount, 0),
    en_retard: payments.filter((p) => p.status === "en_retard").reduce((s, p) => s + p.amount, 0),
    en_attente: payments.filter((p) => p.status === "en_attente").reduce((s, p) => s + p.amount, 0),
  };

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.leaseId) return;
    setError(null);
    startTransition(async () => {
      try {
        await createPayment(form);
        setOpen(false);
        router.refresh();
      } catch {
        setError("Impossible d'ajouter le paiement. Verifiez les champs.");
      }
    });
  }

  function markPaid(id: string) {
    startTransition(async () => {
      await markPaymentPaid(id);
      router.refresh();
    });
  }

  function confirmDelete() {
    if (!toDelete) return;
    const id = toDelete.id;
    startTransition(async () => {
      await deletePayment(id);
      setToDelete(null);
      router.refresh();
    });
  }

  return (
    <div>
      <PageHeader
        title="Paiements"
        description="Suivi des loyers dus et recus"
        action={
          <PrimaryButton
            onClick={() => {
              setForm({ ...emptyForm, leaseId: leases[0]?.id ?? "" });
              setError(null);
              setOpen(true);
            }}
          >
            <Plus className="h-4 w-4" /> Ajouter un paiement
          </PrimaryButton>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-slate-500">Total percu</p>
          <p className="mt-1 text-xl font-semibold text-emerald-600">{formatCurrency(totals.paye)}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-slate-500">En attente</p>
          <p className="mt-1 text-xl font-semibold text-blue-600">{formatCurrency(totals.en_attente)}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-slate-500">En retard</p>
          <p className="mt-1 text-xl font-semibold text-red-600">{formatCurrency(totals.en_retard)}</p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {(["all", "paye", "en_attente", "en_retard"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${
              filter === s ? "bg-slate-900 text-white" : "bg-white text-slate-600 ring-1 ring-inset ring-gray-200 hover:bg-slate-50"
            }`}
          >
            {s === "all" ? "Tous" : paymentStatusMeta[s].label}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Locataire</th>
              <th className="px-4 py-3">Unite</th>
              <th className="px-4 py-3">Echeance</th>
              <th className="px-4 py-3">Montant</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sorted.map(({ payment, tenant, unit, property }) => (
              <tr key={payment.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">{tenantName(tenant)}</td>
                <td className="px-4 py-3 text-slate-600">{unitLabel(unit, property)}</td>
                <td className="px-4 py-3 text-slate-600">{formatDate(payment.dueDate)}</td>
                <td className="px-4 py-3 text-slate-600">{formatCurrency(payment.amount)}</td>
                <td className="px-4 py-3">
                  <Badge tone={paymentStatusMeta[payment.status].tone}>
                    {paymentStatusMeta[payment.status].label}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    {payment.status !== "paye" && (
                      <button
                        onClick={() => markPaid(payment.id)}
                        disabled={pending}
                        className="rounded-md p-1.5 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600"
                        aria-label="Marquer comme paye"
                        title="Marquer comme paye"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => setToDelete(payment)}
                      className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                      aria-label="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                  <CreditCard className="mx-auto mb-2 h-6 w-6 text-slate-300" />
                  Aucun paiement pour ce filtre.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Ajouter un paiement">
        <form onSubmit={submit} className="space-y-4">
          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <Field label="Bail">
            <select
              className={inputClass}
              value={form.leaseId}
              onChange={(e) => setForm({ ...form, leaseId: e.target.value })}
              required
            >
              {leases.map((lease) => {
                const unit = findUnit(units, lease.unitId);
                const property = findProperty(properties, unit?.propertyId);
                const tenant = findTenant(tenants, lease.tenantId);
                return (
                  <option key={lease.id} value={lease.id}>
                    {tenantName(tenant)} — {unitLabel(unit, property)}
                  </option>
                );
              })}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Montant ($)">
              <input
                type="number"
                className={inputClass}
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
              />
            </Field>
            <Field label="Date d'echeance">
              <input
                type="date"
                className={inputClass}
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                required
              />
            </Field>
          </div>
          <Field label="Statut">
            <select
              className={inputClass}
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as PaymentStatus })}
            >
              <option value="en_attente">En attente</option>
              <option value="paye">Paye</option>
              <option value="en_retard">En retard</option>
            </select>
          </Field>
          {form.status === "paye" && (
            <Field label="Methode de paiement">
              <select
                className={inputClass}
                value={form.method}
                onChange={(e) => setForm({ ...form, method: e.target.value as PaymentMethod })}
              >
                <option value="virement">Virement Interac</option>
                <option value="prelevement">Prelevement automatique</option>
                <option value="cheque">Cheque</option>
                <option value="carte">Carte</option>
                <option value="especes">Especes</option>
              </select>
            </Field>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <SecondaryButton type="button" onClick={() => setOpen(false)}>
              Annuler
            </SecondaryButton>
            <PrimaryButton type="submit" disabled={pending}>
              Ajouter
            </PrimaryButton>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        title="Supprimer le paiement"
        message="Etes-vous sur de vouloir supprimer ce paiement ?"
        onCancel={() => setToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
