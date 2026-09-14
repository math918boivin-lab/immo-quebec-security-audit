"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Phone, Plus, Search, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/Badge";
import { Modal } from "@/components/Modal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Field, inputClass, PrimaryButton, SecondaryButton } from "@/components/form";
import { initials } from "@/lib/format";
import { tenantStatusMeta } from "@/lib/statusMeta";
import { findProperty, findUnit, unitLabel } from "@/lib/selectors";
import type { Lease, Property, Tenant, TenantStatus, Unit } from "@/lib/types";
import { createTenant, deleteTenant } from "@/lib/actions";

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  status: "actif" as TenantStatus,
  notes: "",
};

export function TenantsClient({
  tenants,
  leases,
  units,
  properties,
}: {
  tenants: Tenant[];
  leases: Lease[];
  units: Unit[];
  properties: Property[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [toDelete, setToDelete] = useState<Tenant | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tenants;
    return tenants.filter((t) =>
      `${t.firstName} ${t.lastName} ${t.email}`.toLowerCase().includes(q)
    );
  }, [tenants, query]);

  function currentUnit(tenantId: string) {
    const lease = leases.find(
      (l) => l.tenantId === tenantId && (l.status === "actif" || l.status === "a_renouveler")
    );
    if (!lease) return null;
    const unit = findUnit(units, lease.unitId);
    const property = findProperty(properties, unit?.propertyId);
    return unit ? unitLabel(unit, property) : null;
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        await createTenant(form);
        setForm(emptyForm);
        setOpen(false);
        router.refresh();
      } catch {
        setError("Impossible d'ajouter le locataire. Verifiez les champs.");
      }
    });
  }

  function confirmDelete() {
    if (!toDelete) return;
    const id = toDelete.id;
    startTransition(async () => {
      await deleteTenant(id);
      setToDelete(null);
      router.refresh();
    });
  }

  return (
    <div>
      <PageHeader
        title="Locataires"
        description={`${tenants.length} locataire${tenants.length > 1 ? "s" : ""} enregistre${tenants.length > 1 ? "s" : ""}`}
        action={
          <PrimaryButton onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" /> Ajouter un locataire
          </PrimaryButton>
        }
      />

      <div className="mb-4 relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          className={`${inputClass} pl-9`}
          placeholder="Rechercher un locataire..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((tenant) => {
          const unit = currentUnit(tenant.id);
          return (
            <div
              key={tenant.id}
              className="group relative rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <button
                onClick={() => setToDelete(tenant)}
                className="absolute right-4 top-4 rounded-md p-1.5 text-slate-300 opacity-0 hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
                aria-label="Supprimer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <Link href={`/locataires/${tenant.id}`} className="block">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-medium text-white">
                    {initials(tenant.firstName, tenant.lastName || tenant.firstName)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">
                      {tenant.firstName} {tenant.lastName}
                    </p>
                    <Badge tone={tenantStatusMeta[tenant.status].tone}>
                      {tenantStatusMeta[tenant.status].label}
                    </Badge>
                  </div>
                </div>
                <div className="mt-4 space-y-1.5 text-sm text-slate-500">
                  <p className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5" /> {tenant.email}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5" /> {tenant.phone}
                  </p>
                </div>
                {unit && (
                  <p className="mt-3 border-t border-gray-100 pt-3 text-sm text-slate-600">{unit}</p>
                )}
              </Link>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="col-span-full py-8 text-center text-slate-400">Aucun locataire trouve.</p>
        )}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Ajouter un locataire">
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
            <Field label="Nom de famille (optionnel)">
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
              placeholder="514-555-0100"
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
              Ajouter
            </PrimaryButton>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        title="Supprimer le locataire"
        message={`Etes-vous sur de vouloir supprimer "${toDelete?.firstName} ${toDelete?.lastName}" ?`}
        onCancel={() => setToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
