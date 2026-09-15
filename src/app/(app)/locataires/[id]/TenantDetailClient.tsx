"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, Phone, Pencil } from "lucide-react";
import { Badge } from "@/components/Badge";
import { Modal } from "@/components/Modal";
import { Field, inputClass, PrimaryButton, SecondaryButton } from "@/components/form";
import { formatCurrency, formatDate, initials } from "@/lib/format";
import { leaseStatusMeta, paymentStatusMeta, tenantStatusMeta } from "@/lib/statusMeta";
import { findProperty, findUnit, unitLabel } from "@/lib/selectors";
import type { Lease, Payment, Property, Tenant, TenantStatus, Unit } from "@/lib/types";
import { updateTenant } from "@/lib/actions";

export function TenantDetailClient({
  tenant,
  leases,
  units,
  properties,
  payments,
}: {
  tenant: Tenant;
  leases: Lease[];
  units: Unit[];
  properties: Property[];
  payments: Payment[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    firstName: tenant.firstName,
    lastName: tenant.lastName,
    email: tenant.email,
    phone: tenant.phone,
    status: tenant.status as TenantStatus,
  });

  function openEdit() {
    setForm({
      firstName: tenant.firstName,
      lastName: tenant.lastName,
      email: tenant.email,
      phone: tenant.phone,
      status: tenant.status,
    });
    setError(null);
    setOpen(true);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        await updateTenant(tenant.id, form);
        setOpen(false);
        router.refresh();
      } catch {
        setError("Impossible d'enregistrer. Verifiez les champs.");
      }
    });
  }

  return (
    <div>
      <Link href="/locataires" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900">
        <ArrowLeft className="h-4 w-4" /> Retour aux locataires
      </Link>

      <div className="mt-4 mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-lg font-medium text-white">
            {initials(tenant.firstName, tenant.lastName || tenant.firstName)}
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              {tenant.firstName} {tenant.lastName}
            </h1>
            <div className="mt-1 flex items-center gap-2">
              <Badge tone={tenantStatusMeta[tenant.status].tone}>{tenantStatusMeta[tenant.status].label}</Badge>
            </div>
          </div>
        </div>
        <SecondaryButton onClick={openEdit}>
          <Pencil className="h-4 w-4" /> Modifier
        </SecondaryButton>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 font-semibold text-slate-900">Coordonnees</h2>
          <p className="flex items-center gap-2 text-sm text-slate-600">
            <Mail className="h-4 w-4 text-slate-400" aria-hidden="true" /> {tenant.email}
          </p>
          <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
            <Phone className="h-4 w-4 text-slate-400" aria-hidden="true" /> {tenant.phone}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="mb-3 font-semibold text-slate-900">Historique des baux</h2>
          {leases.length === 0 ? (
            <p className="text-sm text-slate-500">Aucun bail associe.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {leases.map((lease) => {
                const unit = findUnit(units, lease.unitId);
                const property = findProperty(properties, unit?.propertyId);
                return (
                  <li key={lease.id} className="flex items-center justify-between py-3 text-sm">
                    <div>
                      <p className="font-medium text-slate-900">{unitLabel(unit, property)}</p>
                      <p className="text-slate-500">
                        {formatDate(lease.startDate)} — {formatDate(lease.endDate)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-slate-900">{formatCurrency(lease.monthlyRent)}/mois</p>
                      <Badge tone={leaseStatusMeta[lease.status].tone}>{leaseStatusMeta[lease.status].label}</Badge>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 font-semibold text-slate-900">Historique des paiements</h2>
        {payments.length === 0 ? (
          <p className="text-sm text-slate-500">Aucun paiement enregistre.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-slate-500">
              <tr>
                <th className="py-2 pr-4">Echeance</th>
                <th className="py-2 pr-4">Montant</th>
                <th className="py-2 pr-4">Statut</th>
                <th className="py-2 pr-4">Paye le</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td className="py-2 pr-4 text-slate-600">{formatDate(payment.dueDate)}</td>
                  <td className="py-2 pr-4 font-medium text-slate-900">{formatCurrency(payment.amount)}</td>
                  <td className="py-2 pr-4">
                    <Badge tone={paymentStatusMeta[payment.status].tone}>
                      {paymentStatusMeta[payment.status].label}
                    </Badge>
                  </td>
                  <td className="py-2 pr-4 text-slate-600">
                    {payment.paidDate ? formatDate(payment.paidDate) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Modifier le locataire">
        <form onSubmit={submit} className="space-y-4">
          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Prenom / Nom de l'entreprise">
              <input
                className={inputClass}
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                required
              />
            </Field>
            <Field label="Nom de famille">
              <input
                className={inputClass}
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              />
            </Field>
          </div>
          <Field label="Courriel">
            <input
              type="email"
              className={inputClass}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </Field>
          <Field label="Telephone">
            <input
              className={inputClass}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </Field>
          <Field label="Statut">
            <select
              className={inputClass}
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as TenantStatus })}
            >
              <option value="actif">Actif</option>
              <option value="ancien">Ancien locataire</option>
            </select>
          </Field>
          <div className="flex justify-end gap-3 pt-2">
            <SecondaryButton type="button" onClick={() => setOpen(false)}>
              Annuler
            </SecondaryButton>
            <PrimaryButton type="submit" disabled={pending}>
              Enregistrer
            </PrimaryButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}
