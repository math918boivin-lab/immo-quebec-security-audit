"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Plus, Trash2, Pencil } from "lucide-react";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/Badge";
import { Modal } from "@/components/Modal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Field, inputClass, PrimaryButton, SecondaryButton } from "@/components/form";
import { formatCurrency } from "@/lib/format";
import { unitStatusMeta } from "@/lib/statusMeta";
import { tenantName } from "@/lib/selectors";
import type { Unit, UnitStatus, UnitType } from "@/lib/types";

const unitTypes: UnitType[] = ["Studio", "1 ½", "2 ½", "3 ½", "4 ½", "5 ½", "Commercial"];
const unitStatuses: UnitStatus[] = ["occupee", "vacante", "maintenance"];

const emptyUnitForm = {
  number: "",
  type: "3 ½" as UnitType,
  area: 700,
  rent: 1200,
  status: "vacante" as UnitStatus,
};

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const properties = useStore((s) => s.properties);
  const units = useStore((s) => s.units);
  const leases = useStore((s) => s.leases);
  const tenants = useStore((s) => s.tenants);
  const addUnit = useStore((s) => s.addUnit);
  const updateUnit = useStore((s) => s.updateUnit);
  const deleteUnit = useStore((s) => s.deleteUnit);

  const property = properties.find((p) => p.id === id);
  const propertyUnits = units.filter((u) => u.propertyId === id);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Unit | null>(null);
  const [form, setForm] = useState(emptyUnitForm);
  const [toDelete, setToDelete] = useState<Unit | null>(null);

  if (!property) {
    return (
      <div>
        <Link href="/immeubles" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" /> Retour aux immeubles
        </Link>
        <p className="mt-6 text-slate-500">Cet immeuble est introuvable.</p>
      </div>
    );
  }

  function openAdd() {
    setEditing(null);
    setForm(emptyUnitForm);
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
    setOpen(true);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.number.trim()) return;
    if (editing) {
      updateUnit(editing.id, form);
    } else {
      addUnit({ ...form, propertyId: id });
    }
    setOpen(false);
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
      <Link href="/immeubles" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900">
        <ArrowLeft className="h-4 w-4" /> Retour aux immeubles
      </Link>

      <PageHeader
        title={property.name}
        description={
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" /> {property.address}, {property.city} {property.postalCode}
          </span>
        }
        action={
          <PrimaryButton onClick={openAdd}>
            <Plus className="h-4 w-4" /> Ajouter une unite
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
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {propertyUnits.map((unit) => {
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
                        className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                        aria-label="Modifier"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setToDelete(unit)}
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
            {propertyUnits.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                  Aucune unite pour cet immeuble.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Modifier l'unite" : "Ajouter une unite"}>
        <form onSubmit={submit} className="space-y-4">
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
            <PrimaryButton type="submit">{editing ? "Enregistrer" : "Ajouter"}</PrimaryButton>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        title="Supprimer l'unite"
        message={`Etes-vous sur de vouloir supprimer l'unite "${toDelete?.number}" ? Les baux associes seront aussi supprimes.`}
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          if (toDelete) deleteUnit(toDelete.id);
          setToDelete(null);
        }}
      />
    </div>
  );
}
