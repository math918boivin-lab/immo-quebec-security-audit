"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Building2, Plus, Trash2, Wrench } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/Badge";
import { Modal } from "@/components/Modal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Field, inputClass, PrimaryButton, SecondaryButton } from "@/components/form";
import { formatDate } from "@/lib/format";
import { maintenancePriorityMeta, maintenanceStatusMeta } from "@/lib/statusMeta";
import { findProperty, findUnit, unitLabel } from "@/lib/selectors";
import type {
  MaintenanceCategory,
  MaintenancePriority,
  MaintenanceRequest,
  MaintenanceStatus,
  Property,
  Unit,
} from "@/lib/types";
import {
  createMaintenanceRequest,
  deleteMaintenanceRequest,
  updateMaintenanceStatus,
} from "@/lib/actions";

const columns: MaintenanceStatus[] = ["ouverte", "en_cours", "resolue"];

const emptyForm = {
  unitId: "",
  title: "",
  description: "",
  category: "autre" as MaintenanceCategory,
  priority: "moyenne" as MaintenancePriority,
};

export function MaintenanceClient({
  requests,
  units,
  properties,
}: {
  requests: MaintenanceRequest[];
  units: Unit[];
  properties: Property[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [toDelete, setToDelete] = useState<MaintenanceRequest | null>(null);
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.unitId || !form.title.trim()) return;
    setError(null);
    startTransition(async () => {
      try {
        await createMaintenanceRequest(form);
        setForm(emptyForm);
        setOpen(false);
        router.refresh();
      } catch {
        setError("Impossible de creer la demande. Verifiez les champs.");
      }
    });
  }

  function changeStatus(request: MaintenanceRequest, status: MaintenanceStatus) {
    startTransition(async () => {
      await updateMaintenanceStatus(request.id, status);
      router.refresh();
    });
  }

  function confirmDelete() {
    if (!toDelete) return;
    const id = toDelete.id;
    startTransition(async () => {
      await deleteMaintenanceRequest(id);
      setToDelete(null);
      router.refresh();
    });
  }

  return (
    <div>
      <PageHeader
        title="Maintenance"
        description="Suivi des demandes d'entretien et de reparation"
        action={
          <PrimaryButton
            onClick={() => {
              setForm({ ...emptyForm, unitId: units[0]?.id ?? "" });
              setError(null);
              setOpen(true);
            }}
          >
            <Plus className="h-4 w-4" /> Nouvelle demande
          </PrimaryButton>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {columns.map((status) => {
          const items = requests
            .filter((r) => r.status === status)
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
          return (
            <div key={status} className="rounded-xl border border-gray-200 bg-slate-50/50 p-3">
              <div className="mb-3 flex items-center justify-between px-1">
                <h2 className="text-sm font-semibold text-slate-700">{maintenanceStatusMeta[status].label}</h2>
                <span className="rounded-full bg-white px-2 py-0.5 text-xs text-slate-500 ring-1 ring-gray-200">
                  {items.length}
                </span>
              </div>
              <div className="space-y-3">
                {items.map((request) => {
                  const unit = findUnit(units, request.unitId);
                  const property = findProperty(properties, unit?.propertyId);
                  return (
                    <div key={request.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-slate-900">{request.title}</p>
                        <button
                          onClick={() => setToDelete(request)}
                          className="shrink-0 rounded-md p-1 text-slate-300 hover:bg-red-50 hover:text-red-600"
                          aria-label="Supprimer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                        <Building2 className="h-3 w-3" /> {unitLabel(unit, property)}
                      </p>
                      <p className="mt-2 text-xs text-slate-500 line-clamp-2">{request.description}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <Badge tone={maintenancePriorityMeta[request.priority].tone}>
                          {maintenancePriorityMeta[request.priority].label}
                        </Badge>
                        <span className="text-xs text-slate-400">{formatDate(request.createdAt)}</span>
                      </div>
                      <select
                        className="mt-3 w-full rounded-md border border-gray-200 px-2 py-1.5 text-xs text-slate-600"
                        value={request.status}
                        disabled={pending}
                        onChange={(e) => changeStatus(request, e.target.value as MaintenanceStatus)}
                      >
                        <option value="ouverte">Ouverte</option>
                        <option value="en_cours">En cours</option>
                        <option value="resolue">Resolue</option>
                      </select>
                    </div>
                  );
                })}
                {items.length === 0 && (
                  <p className="px-1 py-6 text-center text-xs text-slate-400">Aucune demande</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Nouvelle demande de maintenance">
        <form onSubmit={submit} className="space-y-4">
          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <Field label="Unite concernee">
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
          <Field label="Titre">
            <input
              className={inputClass}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Ex. Fuite d'eau sous l'evier"
              required
            />
          </Field>
          <Field label="Description">
            <textarea
              className={inputClass}
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Categorie">
              <select
                className={inputClass}
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as MaintenanceCategory })}
              >
                <option value="plomberie">Plomberie</option>
                <option value="electricite">Electricite</option>
                <option value="chauffage">Chauffage</option>
                <option value="electromenager">Electromenager</option>
                <option value="structure">Structure</option>
                <option value="autre">Autre</option>
              </select>
            </Field>
            <Field label="Priorite">
              <select
                className={inputClass}
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value as MaintenancePriority })}
              >
                <option value="basse">Basse</option>
                <option value="moyenne">Moyenne</option>
                <option value="haute">Haute</option>
                <option value="urgente">Urgente</option>
              </select>
            </Field>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <SecondaryButton type="button" onClick={() => setOpen(false)}>
              Annuler
            </SecondaryButton>
            <PrimaryButton type="submit" disabled={pending}>
              <Wrench className="h-4 w-4" /> Creer
            </PrimaryButton>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        title="Supprimer la demande"
        message="Etes-vous sur de vouloir supprimer cette demande de maintenance ?"
        onCancel={() => setToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
