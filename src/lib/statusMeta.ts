import type {
  LeaseStatus,
  MaintenancePriority,
  MaintenanceStatus,
  PaymentStatus,
  TenantStatus,
  UnitStatus,
} from "./types";

type Tone = "green" | "amber" | "red" | "gray" | "blue" | "purple";

export const unitStatusMeta: Record<UnitStatus, { label: string; tone: Tone }> = {
  occupee: { label: "Occupee", tone: "green" },
  vacante: { label: "Vacante", tone: "gray" },
  maintenance: { label: "En maintenance", tone: "amber" },
};

export const tenantStatusMeta: Record<TenantStatus, { label: string; tone: Tone }> = {
  actif: { label: "Actif", tone: "green" },
  ancien: { label: "Ancien locataire", tone: "gray" },
};

export const leaseStatusMeta: Record<LeaseStatus, { label: string; tone: Tone }> = {
  actif: { label: "Actif", tone: "green" },
  a_renouveler: { label: "A renouveler", tone: "amber" },
  expire: { label: "Expire", tone: "gray" },
  resilie: { label: "Resilie", tone: "red" },
};

export const paymentStatusMeta: Record<PaymentStatus, { label: string; tone: Tone }> = {
  paye: { label: "Paye", tone: "green" },
  en_attente: { label: "En attente", tone: "blue" },
  en_retard: { label: "En retard", tone: "red" },
};

export const maintenanceStatusMeta: Record<MaintenanceStatus, { label: string; tone: Tone }> = {
  ouverte: { label: "Ouverte", tone: "blue" },
  en_cours: { label: "En cours", tone: "amber" },
  resolue: { label: "Resolue", tone: "green" },
};

export const maintenancePriorityMeta: Record<MaintenancePriority, { label: string; tone: Tone }> = {
  basse: { label: "Basse", tone: "gray" },
  moyenne: { label: "Moyenne", tone: "blue" },
  haute: { label: "Haute", tone: "amber" },
  urgente: { label: "Urgente", tone: "red" },
};
