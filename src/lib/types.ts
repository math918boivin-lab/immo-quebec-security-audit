export type UnitType =
  | "Studio"
  | "1 ½"
  | "2 ½"
  | "3 ½"
  | "4 ½"
  | "5 ½"
  | "Commercial";

export type UnitStatus = "occupee" | "vacante" | "maintenance";

export interface Unit {
  id: string;
  propertyId: string;
  number: string;
  type: UnitType;
  area: number; // pieds carres
  rent: number; // loyer mensuel
  status: UnitStatus;
}

export type PropertyType = "Residentiel" | "Commercial" | "Mixte";

export interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  type: PropertyType;
  yearBuilt: number;
  notes?: string;
}

export type TenantStatus = "actif" | "ancien";

export interface Tenant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: TenantStatus;
  notes?: string;
}

export type LeaseStatus = "actif" | "a_renouveler" | "expire" | "resilie";

export interface Lease {
  id: string;
  unitId: string;
  tenantId: string;
  startDate: string; // ISO date
  endDate: string; // ISO date
  monthlyRent: number;
  deposit: number;
  status: LeaseStatus;
}

export type PaymentStatus = "paye" | "en_attente" | "en_retard";
export type PaymentMethod = "virement" | "cheque" | "carte" | "especes" | "prelevement";

export interface Payment {
  id: string;
  leaseId: string;
  amount: number;
  dueDate: string; // ISO date
  paidDate?: string; // ISO date
  status: PaymentStatus;
  method?: PaymentMethod;
}

export type MaintenancePriority = "basse" | "moyenne" | "haute" | "urgente";
export type MaintenanceStatus = "ouverte" | "en_cours" | "resolue";
export type MaintenanceCategory =
  | "plomberie"
  | "electricite"
  | "chauffage"
  | "electromenager"
  | "structure"
  | "autre";

export interface MaintenanceRequest {
  id: string;
  unitId: string;
  title: string;
  description: string;
  category: MaintenanceCategory;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  createdAt: string; // ISO date
  resolvedAt?: string; // ISO date
}
