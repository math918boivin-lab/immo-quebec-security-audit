import { z } from "zod";

export const propertyTypeSchema = z.enum(["Residentiel", "Commercial", "Mixte"]);
export const unitTypeSchema = z.enum([
  "Studio",
  "1 ½",
  "2 ½",
  "3 ½",
  "4 ½",
  "5 ½",
  "Commercial",
]);
export const unitStatusSchema = z.enum(["occupee", "vacante", "maintenance"]);
export const tenantStatusSchema = z.enum(["actif", "ancien"]);
export const leaseStatusSchema = z.enum(["actif", "a_renouveler", "expire", "resilie"]);
export const paymentStatusSchema = z.enum(["paye", "en_attente", "en_retard"]);
export const paymentMethodSchema = z.enum([
  "virement",
  "cheque",
  "carte",
  "especes",
  "prelevement",
]);
export const maintenanceCategorySchema = z.enum([
  "plomberie",
  "electricite",
  "chauffage",
  "electromenager",
  "structure",
  "autre",
]);
export const maintenancePrioritySchema = z.enum(["basse", "moyenne", "haute", "urgente"]);
export const maintenanceStatusSchema = z.enum(["ouverte", "en_cours", "resolue"]);

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date invalide (AAAA-MM-JJ attendu)");
const money = z.coerce.number().finite().min(0).max(10_000_000);
const shortText = (max: number) => z.string().trim().min(1).max(max);

export const propertySchema = z.object({
  name: shortText(200),
  address: shortText(300),
  city: shortText(150),
  postalCode: z.string().trim().max(20).default(""),
  type: propertyTypeSchema,
  yearBuilt: z.coerce.number().int().min(1800).max(2100),
  notes: z.string().trim().max(2000).optional().default(""),
});

export const unitSchema = z.object({
  propertyId: z.string().min(1),
  number: shortText(50),
  type: unitTypeSchema,
  area: z.coerce.number().int().min(0).max(1_000_000),
  rent: money,
  status: unitStatusSchema,
});

export const tenantSchema = z.object({
  firstName: shortText(150),
  lastName: z.string().trim().max(150).default(""),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(50).default(""),
  status: tenantStatusSchema,
  notes: z.string().trim().max(2000).optional().default(""),
});

export const leaseSchema = z.object({
  unitId: z.string().min(1),
  tenantId: z.string().min(1),
  startDate: isoDate,
  endDate: isoDate,
  monthlyRent: money,
  deposit: money,
  status: leaseStatusSchema,
});

export const paymentSchema = z.object({
  leaseId: z.string().min(1),
  amount: money,
  dueDate: isoDate,
  paidDate: isoDate.optional(),
  status: paymentStatusSchema,
  method: paymentMethodSchema.optional(),
});

export const maintenanceRequestSchema = z.object({
  unitId: z.string().min(1),
  title: shortText(200),
  description: z.string().trim().max(4000).optional().default(""),
  category: maintenanceCategorySchema,
  priority: maintenancePrioritySchema,
  status: maintenanceStatusSchema.optional(),
});

export const idSchema = z.string().min(1).max(200);

export const blogStatusSchema = z.enum(["brouillon", "publie"]);

export const blogPostSchema = z.object({
  title: shortText(200),
  content: z.string().trim().min(1).max(50_000),
  status: blogStatusSchema,
});

export const signupSchema = z
  .object({
    name: shortText(150),
    email: z.string().trim().email().max(200),
    password: z.string().min(12).max(200),
    confirmPassword: z.string().min(1).max(200),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
  });
