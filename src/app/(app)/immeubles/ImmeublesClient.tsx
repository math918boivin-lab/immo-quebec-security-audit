"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, MapPin, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Modal } from "@/components/Modal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Field, inputClass, PrimaryButton, SecondaryButton } from "@/components/form";
import type { Property, PropertyType, Unit } from "@/lib/types";
import { formatCurrency } from "@/lib/format";
import { createProperty, deleteProperty } from "@/lib/actions";

const emptyForm = {
  name: "",
  address: "",
  city: "",
  postalCode: "",
  type: "Residentiel" as PropertyType,
  yearBuilt: new Date().getFullYear(),
  notes: "",
};

export function ImmeublesClient({ properties, units }: { properties: Property[]; units: Unit[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [toDelete, setToDelete] = useState<Property | null>(null);
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        await createProperty(form);
        setForm(emptyForm);
        setOpen(false);
        router.refresh();
      } catch {
        setError("Impossible d'ajouter l'immeuble. Verifiez les champs.");
      }
    });
  }

  function confirmDelete() {
    if (!toDelete) return;
    const id = toDelete.id;
    startTransition(async () => {
      await deleteProperty(id);
      setToDelete(null);
      router.refresh();
    });
  }

  return (
    <div>
      <PageHeader
        title="Immeubles"
        description={`${properties.length} immeuble${properties.length > 1 ? "s" : ""} dans votre portefeuille`}
        action={
          <PrimaryButton onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" /> Ajouter un immeuble
          </PrimaryButton>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => {
          const propertyUnits = units.filter((u) => u.propertyId === property.id);
          const occupied = propertyUnits.filter((u) => u.status === "occupee").length;
          const totalRent = propertyUnits.reduce((sum, u) => sum + u.rent, 0);
          return (
            <div
              key={property.id}
              className="group relative rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <button
                onClick={() => setToDelete(property)}
                className="absolute right-4 top-4 rounded-md p-1.5 text-slate-400 opacity-0 hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                aria-label={`Supprimer ${property.name}`}
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
              <Link href={`/immeubles/${property.id}`}>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100" aria-hidden="true">
                  <Building2 className="h-5 w-5 text-slate-600" />
                </div>
                <h2 className="mt-3 font-semibold text-slate-900">{property.name}</h2>
                <p className="mt-0.5 flex items-center gap-1 text-sm text-slate-500">
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> {property.address}, {property.city}
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 text-sm">
                  <span className="text-slate-500">
                    {occupied}/{propertyUnits.length} unites occupees
                  </span>
                  <span className="font-medium text-slate-900">{formatCurrency(totalRent)}/mois</span>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Ajouter un immeuble">
        <form onSubmit={submit} className="space-y-4">
          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <Field label="Nom de l'immeuble">
            <input
              className={inputClass}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ex. Le Faubourg"
              required
            />
          </Field>
          <Field label="Adresse">
            <input
              className={inputClass}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="1245 Rue Sainte-Catherine E"
              required
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Ville">
              <input
                className={inputClass}
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="Montreal"
                required
              />
            </Field>
            <Field label="Code postal">
              <input
                className={inputClass}
                value={form.postalCode}
                onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                placeholder="H2L 2H5"
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Type">
              <select
                className={inputClass}
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as PropertyType })}
              >
                <option value="Residentiel">Residentiel</option>
                <option value="Commercial">Commercial</option>
                <option value="Mixte">Mixte</option>
              </select>
            </Field>
            <Field label="Annee de construction">
              <input
                type="number"
                className={inputClass}
                value={form.yearBuilt}
                onChange={(e) => setForm({ ...form, yearBuilt: Number(e.target.value) })}
              />
            </Field>
          </div>
          <Field label="Notes (optionnel)">
            <textarea
              className={inputClass}
              rows={3}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
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
        title="Supprimer l'immeuble"
        message={`Etes-vous sur de vouloir supprimer "${toDelete?.name}" ? Toutes les unites et baux associes seront aussi supprimes.`}
        onCancel={() => setToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
