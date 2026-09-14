"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Pencil, FileText } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/Badge";
import { Modal } from "@/components/Modal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Field, inputClass, PrimaryButton, SecondaryButton } from "@/components/form";
import { formatCurrency, formatDate } from "@/lib/format";
import { leaseStatusMeta } from "@/lib/statusMeta";
import { findProperty, findTenant, findUnit, tenantName, unitLabel } from "@/lib/selectors";
import type { Lease, LeaseStatus, Property, Tenant, Unit } from "@/lib/types";
import { createLease, deleteLease, updateLease } from "@/lib/actions";

const emptyForm = {
  unitId: "",
  tenantId: "",
  startDate: new Date().toISOString().slice(0, 10),
  endDate: new Date().toISOString().slice(0, 10),
  monthlyRent: 1200,
  deposit: 1200,
  status: "actif" as LeaseStatus,
};

export function LeasesClient({
  leases,
  units,
  properties,
  tenants,
}: {
  leases: Lease[];
  units: Unit[];
  properties: Property[];
  tenants: Tenant[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Lease | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [toDelete, setToDelete] = useState<Lease | null>(null);
  const [filter, setFilter] = useState<"all" | LeaseStatus>("all");
  const [error, setError] = useState<string | null>(null);

  const filtered = filter === "all" ? leases : leases.filter((l) => l.status === filter);
  const sorted = [...filtered].sort((a, b) => b.startDate.localeCompare(a.startDate));

  function openAdd() {
    setEditing(null);
    setForm({ ...emptyForm, unitId: units[0]?.id ?? "", tenantId: tenants[0]?.id ?? "" });
    setError(null);
    setOpen(true);
  }

  function openEdit(lease: Lease) {
    setEditing(lease);
    setForm({
      unitId: lease.unitId,
      tenantId: lease.tenantId,
      startDate: lease.startDate,
      endDate: lease.endDate,
      monthlyRent: lease.monthlyRent,
      deposit: lease.deposit,
      status: lease.status,
    });
    setError(null);
    setOpen(true);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.unitId || !form.tenantId) return;
    setError(null);
    startTransition(async () => {
      try {
        if (editing) {
          await updateLease(editing.id, form);
        } else {
          await createLease(form);
        }
        setOpen(false);
        router.refresh();
      } catch {
        setError("Impossible d'enregistrer le bail. Verifiez les champs.");
      }
    });
  }

  function confirmDelete() {
    if (!toDelete) return;
    const id = toDelete.id;
    startTransition(async () => {
      await deleteLease(id);
      setToDelete(null);
      router.refresh();
    });
  }

  return (
    <div>
      <PageHeader
        title="Baux"
        description={`${leases.length} ${leases.length > 1 ? "baux" : "bail"} au total`}
        action={
          <PrimaryButton onClick={openAdd}>
            <Plus className="h-4 w-4" /> Ajouter un bail
          </PrimaryButton>
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {(["all", "actif", "a_renouveler", "expire", "resilie"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${
              filter === s ? "bg-slate-900 text-white" : "bg-white text-slate-600 ring-1 ring-inset ring-gray-200 hover:bg-slate-50"
            }`}
          >
            {s === "all" ? "Tous" : leaseStatusMeta[s].label}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Unite</th>
              <th className="px-4 py-3">Locataire</th>
              <th className="px-4 py-3">Debut</th>
              <th className="px-4 py-3">Fin</th>
              <th className="px-4 py-3">Loyer</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sorted.map((lease) => {
              const unit = findUnit(units, lease.unitId);
              const property = findProperty(properties, unit?.propertyId);
              const tenant = findTenant(tenants, lease.tenantId);
              return (
                <tr key={lease.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{unitLabel(unit, property)}</td>
                  <td className="px-4 py-3 text-slate-600">{tenantName(tenant)}</td>
                  <td className="px-4 py-3 text-slate-600">{formatDate(lease.startDate)}</td>
                  <td className="px-4 py-3 text-slate-600">{formatDate(lease.endDate)}</td>
                  <td className="px-4 py-3 text-slate-600">{formatCurrency(lease.monthlyRent)}</td>
                  <td className="px-4 py-3">
                    <Badge tone={leaseStatusMeta[lease.status].tone}>{leaseStatusMeta[lease.status].label}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => openEdit(lease)}
                        className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                        aria-label="Modifier"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setToDelete(lease)}
                        className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                        aria-label="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-slate-400">
                  <FileText className="mx-auto mb-2 h-6 w-6 text-slate-300" />
                  Aucun bail pour ce filtre.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Modifier le bail" : "Ajouter un bail"} wide>
        <form onSubmit={submit} className="space-y-4">
          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Unite">
              <select
                className={inputClass}
                value={form.unitId}
                onChange={(e) => setForm({ ...form, unitId: e.target.value })}
                required
              >
                {units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {unitLabel(u, findProperty(properties, u.propertyId))}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Locataire">
              <select
                className={inputClass}
                value={form.tenantId}
                onChange={(e) => setForm({ ...form, tenantId: e.target.value })}
                required
              >
                {tenants.map((t) => (
                  <option key={t.id} value={t.id}>
                    {tenantName(t)}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Date de debut">
              <input
                type="date"
                className={inputClass}
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                required
              />
            </Field>
            <Field label="Date de fin">
              <input
                type="date"
                className={inputClass}
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                required
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Loyer mensuel ($)">
              <input
                type="number"
                className={inputClass}
                value={form.monthlyRent}
                onChange={(e) => setForm({ ...form, monthlyRent: Number(e.target.value) })}
              />
            </Field>
            <Field label="Depot / garantie ($)">
              <input
                type="number"
                className={inputClass}
                value={form.deposit}
                onChange={(e) => setForm({ ...form, deposit: Number(e.target.value) })}
              />
            </Field>
          </div>
          <Field label="Statut">
            <select
              className={inputClass}
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as LeaseStatus })}
            >
              <option value="actif">Actif</option>
              <option value="a_renouveler">A renouveler</option>
              <option value="expire">Expire</option>
              <option value="resilie">Resilie</option>
            </select>
          </Field>
          <div className="flex justify-end gap-3 pt-2">
            <SecondaryButton type="button" onClick={() => setOpen(false)}>
              Annuler
            </SecondaryButton>
            <PrimaryButton type="submit" disabled={pending}>
              {editing ? "Enregistrer" : "Ajouter"}
            </PrimaryButton>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        title="Supprimer le bail"
        message="Etes-vous sur de vouloir supprimer ce bail ? Tous les paiements associes seront aussi supprimes."
        onCancel={() => setToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
