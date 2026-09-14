"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  seedLeases,
  seedMaintenanceRequests,
  seedPayments,
  seedProperties,
  seedTenants,
  seedUnits,
} from "./seed";
import type {
  Lease,
  MaintenanceRequest,
  Payment,
  Property,
  Tenant,
  Unit,
} from "./types";

function makeId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

interface StoreState {
  properties: Property[];
  units: Unit[];
  tenants: Tenant[];
  leases: Lease[];
  payments: Payment[];
  maintenanceRequests: MaintenanceRequest[];

  addProperty: (p: Omit<Property, "id">) => Property;
  updateProperty: (id: string, patch: Partial<Property>) => void;
  deleteProperty: (id: string) => void;

  addUnit: (u: Omit<Unit, "id">) => Unit;
  updateUnit: (id: string, patch: Partial<Unit>) => void;
  deleteUnit: (id: string) => void;

  addTenant: (t: Omit<Tenant, "id">) => Tenant;
  updateTenant: (id: string, patch: Partial<Tenant>) => void;
  deleteTenant: (id: string) => void;

  addLease: (l: Omit<Lease, "id">) => Lease;
  updateLease: (id: string, patch: Partial<Lease>) => void;
  deleteLease: (id: string) => void;

  addPayment: (p: Omit<Payment, "id">) => Payment;
  updatePayment: (id: string, patch: Partial<Payment>) => void;
  deletePayment: (id: string) => void;
  markPaymentPaid: (id: string) => void;

  addMaintenanceRequest: (m: Omit<MaintenanceRequest, "id">) => MaintenanceRequest;
  updateMaintenanceRequest: (id: string, patch: Partial<MaintenanceRequest>) => void;
  deleteMaintenanceRequest: (id: string) => void;

  resetToSeedData: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      properties: seedProperties,
      units: seedUnits,
      tenants: seedTenants,
      leases: seedLeases,
      payments: seedPayments,
      maintenanceRequests: seedMaintenanceRequests,

      addProperty: (p) => {
        const entity: Property = { ...p, id: makeId("p") };
        set({ properties: [...get().properties, entity] });
        return entity;
      },
      updateProperty: (id, patch) =>
        set({
          properties: get().properties.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        }),
      deleteProperty: (id) => {
        const unitIds = get().units.filter((u) => u.propertyId === id).map((u) => u.id);
        set({
          properties: get().properties.filter((p) => p.id !== id),
          units: get().units.filter((u) => u.propertyId !== id),
          leases: get().leases.filter((l) => !unitIds.includes(l.unitId)),
        });
      },

      addUnit: (u) => {
        const entity: Unit = { ...u, id: makeId("u") };
        set({ units: [...get().units, entity] });
        return entity;
      },
      updateUnit: (id, patch) =>
        set({ units: get().units.map((u) => (u.id === id ? { ...u, ...patch } : u)) }),
      deleteUnit: (id) =>
        set({
          units: get().units.filter((u) => u.id !== id),
          leases: get().leases.filter((l) => l.unitId !== id),
        }),

      addTenant: (t) => {
        const entity: Tenant = { ...t, id: makeId("t") };
        set({ tenants: [...get().tenants, entity] });
        return entity;
      },
      updateTenant: (id, patch) =>
        set({ tenants: get().tenants.map((t) => (t.id === id ? { ...t, ...patch } : t)) }),
      deleteTenant: (id) => set({ tenants: get().tenants.filter((t) => t.id !== id) }),

      addLease: (l) => {
        const entity: Lease = { ...l, id: makeId("l") };
        set({ leases: [...get().leases, entity] });
        return entity;
      },
      updateLease: (id, patch) =>
        set({ leases: get().leases.map((l) => (l.id === id ? { ...l, ...patch } : l)) }),
      deleteLease: (id) =>
        set({
          leases: get().leases.filter((l) => l.id !== id),
          payments: get().payments.filter((p) => p.leaseId !== id),
        }),

      addPayment: (p) => {
        const entity: Payment = { ...p, id: makeId("pay") };
        set({ payments: [...get().payments, entity] });
        return entity;
      },
      updatePayment: (id, patch) =>
        set({ payments: get().payments.map((p) => (p.id === id ? { ...p, ...patch } : p)) }),
      deletePayment: (id) => set({ payments: get().payments.filter((p) => p.id !== id) }),
      markPaymentPaid: (id) =>
        set({
          payments: get().payments.map((p) =>
            p.id === id
              ? { ...p, status: "paye", paidDate: new Date().toISOString().slice(0, 10) }
              : p
          ),
        }),

      addMaintenanceRequest: (m) => {
        const entity: MaintenanceRequest = { ...m, id: makeId("m") };
        set({ maintenanceRequests: [...get().maintenanceRequests, entity] });
        return entity;
      },
      updateMaintenanceRequest: (id, patch) =>
        set({
          maintenanceRequests: get().maintenanceRequests.map((m) =>
            m.id === id ? { ...m, ...patch } : m
          ),
        }),
      deleteMaintenanceRequest: (id) =>
        set({ maintenanceRequests: get().maintenanceRequests.filter((m) => m.id !== id) }),

      resetToSeedData: () =>
        set({
          properties: seedProperties,
          units: seedUnits,
          tenants: seedTenants,
          leases: seedLeases,
          payments: seedPayments,
          maintenanceRequests: seedMaintenanceRequests,
        }),
    }),
    { name: "immo-gestion-store", skipHydration: true }
  )
);
