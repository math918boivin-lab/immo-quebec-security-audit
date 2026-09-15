import { addDays, addMonths, format, subDays, subMonths } from "date-fns";
import type {
  Lease,
  MaintenanceRequest,
  Payment,
  Property,
  Tenant,
  Unit,
} from "./types";

const iso = (d: Date) => format(d, "yyyy-MM-dd");
const today = new Date();

export const seedProperties: Property[] = [
  {
    id: "p1",
    name: "Le Faubourg",
    address: "1245 Rue Sainte-Catherine E",
    city: "Montreal",
    postalCode: "H2L 2H5",
    type: "Residentiel",
    yearBuilt: 1998,
    notes: "Immeuble de 6 logements pres du metro Beaudry.",
  },
  {
    id: "p2",
    name: "Les Jardins Limoilou",
    address: "870 3e Avenue",
    city: "Quebec",
    postalCode: "G1L 2W1",
    type: "Residentiel",
    yearBuilt: 2005,
    notes: "Complexe residentiel avec stationnement interieur.",
  },
  {
    id: "p3",
    name: "Plaza des Laurentides",
    address: "3300 Boulevard le Carrefour",
    city: "Laval",
    postalCode: "H7T 1C8",
    type: "Commercial",
    yearBuilt: 2012,
    notes: "Local commerciaux en pied d'immeuble.",
  },
  {
    id: "p4",
    name: "Le Manoir Gatineau",
    address: "215 Rue Principale",
    city: "Gatineau",
    postalCode: "J8X 2K3",
    type: "Mixte",
    yearBuilt: 1985,
  },
];

export const seedUnits: Unit[] = [
  { id: "u1", propertyId: "p1", number: "101", type: "3 ½", area: 720, rent: 1250, status: "occupee" },
  { id: "u2", propertyId: "p1", number: "102", type: "4 ½", area: 880, rent: 1500, status: "occupee" },
  { id: "u3", propertyId: "p1", number: "201", type: "3 ½", area: 720, rent: 1275, status: "vacante" },
  { id: "u4", propertyId: "p1", number: "202", type: "4 ½", area: 880, rent: 1525, status: "occupee" },
  { id: "u5", propertyId: "p1", number: "301", type: "5 ½", area: 1050, rent: 1800, status: "maintenance" },
  { id: "u6", propertyId: "p1", number: "302", type: "2 ½", area: 560, rent: 1050, status: "occupee" },

  { id: "u7", propertyId: "p2", number: "A101", type: "4 ½", area: 900, rent: 1650, status: "occupee" },
  { id: "u8", propertyId: "p2", number: "A102", type: "3 ½", area: 750, rent: 1400, status: "occupee" },
  { id: "u9", propertyId: "p2", number: "B201", type: "5 ½", area: 1100, rent: 1950, status: "occupee" },
  { id: "u10", propertyId: "p2", number: "B202", type: "2 ½", area: 600, rent: 1150, status: "vacante" },

  { id: "u11", propertyId: "p3", number: "Local 1", type: "Commercial", area: 1800, rent: 3200, status: "occupee" },
  { id: "u12", propertyId: "p3", number: "Local 2", type: "Commercial", area: 1200, rent: 2400, status: "occupee" },
  { id: "u13", propertyId: "p3", number: "Local 3", type: "Commercial", area: 950, rent: 1900, status: "vacante" },

  { id: "u14", propertyId: "p4", number: "1", type: "4 ½", area: 850, rent: 1350, status: "occupee" },
  { id: "u15", propertyId: "p4", number: "2", type: "3 ½", area: 700, rent: 1150, status: "occupee" },
  { id: "u16", propertyId: "p4", number: "Local commercial", type: "Commercial", area: 1400, rent: 2100, status: "occupee" },
];

export const seedTenants: Tenant[] = [
  { id: "t1", firstName: "Marc", lastName: "Tremblay", email: "marc.tremblay@example.com", phone: "514-555-0142", status: "actif" },
  { id: "t2", firstName: "Sophie", lastName: "Gagnon", email: "sophie.gagnon@example.com", phone: "514-555-0198", status: "actif" },
  { id: "t3", firstName: "Julien", lastName: "Roy", email: "julien.roy@example.com", phone: "514-555-0223", status: "actif" },
  { id: "t4", firstName: "Isabelle", lastName: "Bouchard", email: "isabelle.bouchard@example.com", phone: "418-555-0311", status: "actif" },
  { id: "t5", firstName: "Alexandre", lastName: "Cote", email: "alexandre.cote@example.com", phone: "418-555-0387", status: "actif" },
  { id: "t6", firstName: "Camille", lastName: "Lavoie", email: "camille.lavoie@example.com", phone: "418-555-0456", status: "actif" },
  { id: "t7", firstName: "Boutique Lumiere Inc.", lastName: "", email: "contact@boutiquelumiere.example.com", phone: "450-555-0512", status: "actif" },
  { id: "t8", firstName: "Cafe Central", lastName: "", email: "info@cafecentral.example.com", phone: "450-555-0587", status: "actif" },
  { id: "t9", firstName: "Nathalie", lastName: "Pelletier", email: "nathalie.pelletier@example.com", phone: "819-555-0634", status: "actif" },
  { id: "t10", firstName: "David", lastName: "Simard", email: "david.simard@example.com", phone: "819-555-0678", status: "actif" },
  { id: "t11", firstName: "Techno Bureau", lastName: "", email: "location@technobureau.example.com", phone: "819-555-0721", status: "actif" },
  { id: "t12", firstName: "Francois", lastName: "Belanger", email: "francois.belanger@example.com", phone: "514-555-0812", status: "ancien" },
];

export const seedLeases: Lease[] = [
  { id: "l1", unitId: "u1", tenantId: "t1", startDate: iso(subMonths(today, 14)), endDate: iso(addMonths(today, 4)), monthlyRent: 1250, deposit: 1250, status: "actif" },
  { id: "l2", unitId: "u2", tenantId: "t2", startDate: iso(subMonths(today, 20)), endDate: iso(addDays(today, 25)), monthlyRent: 1500, deposit: 1500, status: "a_renouveler" },
  { id: "l3", unitId: "u4", tenantId: "t3", startDate: iso(subMonths(today, 8)), endDate: iso(addMonths(today, 10)), monthlyRent: 1525, deposit: 1525, status: "actif" },
  { id: "l4", unitId: "u6", tenantId: "t4", startDate: iso(subMonths(today, 5)), endDate: iso(addMonths(today, 7)), monthlyRent: 1050, deposit: 1050, status: "actif" },
  { id: "l5", unitId: "u7", tenantId: "t5", startDate: iso(subMonths(today, 26)), endDate: iso(addMonths(today, 2)), monthlyRent: 1650, deposit: 1650, status: "actif" },
  { id: "l6", unitId: "u8", tenantId: "t6", startDate: iso(subMonths(today, 3)), endDate: iso(addMonths(today, 9)), monthlyRent: 1400, deposit: 1400, status: "actif" },
  { id: "l7", unitId: "u9", tenantId: "t9", startDate: iso(subMonths(today, 18)), endDate: iso(addDays(today, 45)), monthlyRent: 1950, deposit: 1950, status: "a_renouveler" },
  { id: "l8", unitId: "u11", tenantId: "t7", startDate: iso(subMonths(today, 30)), endDate: iso(addMonths(today, 18)), monthlyRent: 3200, deposit: 6400, status: "actif" },
  { id: "l9", unitId: "u12", tenantId: "t8", startDate: iso(subMonths(today, 12)), endDate: iso(addMonths(today, 12)), monthlyRent: 2400, deposit: 4800, status: "actif" },
  { id: "l10", unitId: "u14", tenantId: "t10", startDate: iso(subMonths(today, 9)), endDate: iso(addMonths(today, 3)), monthlyRent: 1350, deposit: 1350, status: "actif" },
  { id: "l11", unitId: "u15", tenantId: "t12", startDate: iso(subMonths(today, 40)), endDate: iso(subDays(today, 10)), monthlyRent: 1150, deposit: 1150, status: "expire" },
  { id: "l12", unitId: "u16", tenantId: "t11", startDate: iso(subMonths(today, 15)), endDate: iso(addMonths(today, 21)), monthlyRent: 2100, deposit: 4200, status: "actif" },
];

function paymentsForLease(lease: Lease, months: number): Payment[] {
  const payments: Payment[] = [];
  for (let i = months; i >= 0; i--) {
    const due = addMonths(today, -i);
    due.setDate(1);
    const dueIso = iso(due);
    let status: Payment["status"] = "paye";
    let paidDate: string | undefined = iso(addDays(due, Math.random() > 0.8 ? 3 : 0));

    if (i === 0) {
      // mois courant : quelques loyers en attente ou en retard
      const roll = Math.random();
      if (roll < 0.25) {
        status = "en_retard";
        paidDate = undefined;
      } else if (roll < 0.45) {
        status = "en_attente";
        paidDate = undefined;
      }
    }

    payments.push({
      id: `pay-${lease.id}-${dueIso}`,
      leaseId: lease.id,
      amount: lease.monthlyRent,
      dueDate: dueIso,
      paidDate: status === "paye" ? paidDate : undefined,
      status,
      method: status === "paye" ? (Math.random() > 0.5 ? "virement" : "prelevement") : undefined,
    });
  }
  return payments;
}

export const seedPayments: Payment[] = seedLeases
  .filter((l) => l.status !== "expire")
  .flatMap((l) => paymentsForLease(l, 5));

export const seedMaintenanceRequests: MaintenanceRequest[] = [
  {
    id: "m1",
    unitId: "u5",
    title: "Fuite d'eau sous l'evier",
    description: "Le locataire signale une fuite active sous l'evier de la cuisine.",
    category: "plomberie",
    priority: "urgente",
    status: "en_cours",
    createdAt: iso(subDays(today, 2)),
  },
  {
    id: "m2",
    unitId: "u3",
    title: "Peinture a refaire avant relocation",
    description: "Unite vacante, peinture a rafraichir dans le salon et la chambre.",
    category: "autre",
    priority: "basse",
    status: "ouverte",
    createdAt: iso(subDays(today, 6)),
  },
  {
    id: "m3",
    unitId: "u9",
    title: "Thermostat defectueux",
    description: "Le chauffage ne repond plus correctement au thermostat.",
    category: "chauffage",
    priority: "haute",
    status: "ouverte",
    createdAt: iso(subDays(today, 1)),
  },
  {
    id: "m4",
    unitId: "u1",
    title: "Lave-vaisselle bruyant",
    description: "Bruit anormal pendant le cycle de lavage.",
    category: "electromenager",
    priority: "moyenne",
    status: "resolue",
    createdAt: iso(subDays(today, 20)),
    resolvedAt: iso(subDays(today, 15)),
  },
  {
    id: "m5",
    unitId: "u12",
    title: "Prise electrique hors service",
    description: "Prise pres de la caisse ne fonctionne plus.",
    category: "electricite",
    priority: "moyenne",
    status: "en_cours",
    createdAt: iso(subDays(today, 4)),
  },
  {
    id: "m6",
    unitId: "u14",
    title: "Fissure dans le mur du sous-sol",
    description: "A inspecter avant l'hiver.",
    category: "structure",
    priority: "moyenne",
    status: "ouverte",
    createdAt: iso(subDays(today, 9)),
  },
];
