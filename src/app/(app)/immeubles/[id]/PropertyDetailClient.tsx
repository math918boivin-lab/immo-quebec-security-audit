"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Plus, Trash2, Pencil } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/Badge";
import { Modal } from "@/components/Modal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Field, inputClass, PrimaryButton, SecondaryButton } from "@/components/form";
import { formatCurrency } from "@/lib/format";
import { unitStatusMeta } from "@/lib/statusMeta";
import { tenantName } from "@/lib/selectors";
import type { Lease, Property, Tenant, Unit, UnitStatus, UnitType } from "@/lib/types";
import { createUnit, deleteUnit, updateUnit } from "@/lib/actions";

const unitTypes: UnitType[] = ["Studio", "1 ½", "2 ½", "3 ½", "4 ½", "5 ½", "Commercial"];
const unitStatuses: UnitStatus[] = ["occupee", "vacante", "maintenance"];

const emptyUnitForm = {
  number: "",
  type: "3 ½" as UnitType,
  area: 700,
  rent: 1200,
  status: "vacante" as UnitStatus,
};

export function PropertyDetailClient({
  property,
  units,
  leases,
  tenants,
}: {
  property: Property;
  units: Unit[];
  leases: Lease[];
  tenants: Tenant[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Unit | null>(null);
  const [form, setForm] = useState(emptyUnitForm);
  const [toDelete, setToDelete] = useState<Unit | null>(null);
  const [error, setError] = useState<string | null>(null);

  function openAdd() {
    setEditing(null);
    setForm(emptyUnitForm);
    setError(null);
    setOpen(true);
  }

  function openEdit(unit: Unit) {
    setEditing(unit);
    setForm({
      number: unit.number,
      type: unit.type,
      area: unit.area,
      rent: unit.rent,
      status: unit.status,
    });
    setError(null);
    setOpen(true);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        if (editing) {
          await updateUnit(editing.id, form);
        } else {
          await createUnit({ ...form, propertyId: property.id });
        }
        setOpen(false);
        router.refresh();
      } catch {
        setError("Impossible d'enregistrer l'unite. Verifiez les champs.");
      }
    });
  }

  function confirmDelete() {
    if (!toDelete) return;
    const id = toDelete.id;
    startTransition(async () => {
      await deleteUnit(id);
      setToDelete(null);
      router.refresh();
    });
  }

  const activeTenantForUnit = (unitId: string) => {
    const lease = leases.find(
      (l) => l.unitId === unitId && (l.status === "actif" || l.status === "a_renouveler")
    );
    if (!lease) return null;
    return tenants.find((t) => t.id === lease.tenantId) ?? null;
  };

  return (
    <div>
      <Link href="/immeubles" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Retour aux immeubles
      </Link>

      <PageHeader
        title={property.name}
        description={
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> {property.address}, {property.city} {property.postalCode}
          </span>
        }
        action={
          <PrimaryButton onClick={openAdd}>
            <Plus className="h-4 w-4" aria-hidden="true" /> Ajouter une unite
          </PrimaryButton>
        }
      />

      {property.notes && (
        <p className="mb-6 rounded-lg border border-gray-200 bg-white p-4 text-sm text-slate-600">
          {property.notes}
        </p>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Unite</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Superficie</th>
              <th className="px-4 py-3">Loyer</th>
              <th className="px-4 py-3">Locataire</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {units.map((unit) => {
              const tenant = activeTenantForUnit(unit.id);
              return (
                <tr key={unit.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{unit.number}</td>
                  <td className="px-4 py-3 text-slate-600">{unit.type}</td>
                  <td className="px-4 py-3 text-slate-600">{unit.area} pi²</td>
                  <td className="px-4 py-3 text-slate-600">{formatCurrency(unit.rent)}</td>
                  <td className="px-4 py-3 text-slate-600">{tenant ? tenantName(tenant) : "—"}</td>
                  <td className="px-4 py-3">
                    <Badge tone={unitStatusMeta[unit.status].tone}>{unitStatusMeta[unit.status].label}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => openEdit(unit)}
                        className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500"
                        aria-label={`Modifier l'unite ${unit.number}`}
                      >
                        <Pencil className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button
                        onClick={() => setToDelete(unit)}
                        className="rounded-md p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                        aria-label={`Supprimer l'unite ${unit.number}`}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {units.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                  Aucune unite pour cet immeuble.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Modifier l'unite" : "Ajouter une unite"}>
        <form onSubmit={submit} className="space-y-4">
          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <Field label="Numero d'unite">
            <input
              className={inputClass}
              value={form.number}
              onChange={(e) => setForm({ ...form, number: e.target.value })}
              placeholder="101"
              required
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Type">
              <select
                className={inputClass}
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as UnitType })}
              >
                {unitTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Superficie (pi²)">
              <input
                type="number"
                className={inputClass}
                value={form.area}
                onChange={(e) => setForm({ ...form, area: Number(e.target.value) })}
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Loyer mensuel ($)">
              <input
                type="number"
                className={inputClass}
                value={form.rent}
                onChange={(e) => setForm({ ...form, rent: Number(e.target.value) })}
              />
            </Field>
            <Field label="Statut">
              <select
                className={inputClass}
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as UnitStatus })}
              >
                {unitStatuses.map((s) => (
                  <option key={s} value={s}>
                    {unitStatusMeta[s].label}
                  </option>
                ))}
              </select>
            </Field>
          </div>
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
        title="Supprimer l'unite"
        message={`Etes-vous sur de vouloir supprimer l'unite "${toDelete?.number}" ? Les baux associes seront aussi supprimes.`}
        onCancel={() => setToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
