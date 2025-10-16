import { z } from "zod";

export const clientUpdateSchema = z.object({
  company_name: z.string()
    .trim()
    .min(1, "Company name is required")
    .max(200, "Company name must be less than 200 characters"),
  
  first_name: z.string()
    .trim()
    .min(1, "First name is required")
    .max(100, "First name must be less than 100 characters"),
  
  last_name: z.string()
    .trim()
    .min(1, "Last name is required")
    .max(100, "Last name must be less than 100 characters"),
  
  phone_number: z.string()
    .trim()
    .min(1, "Phone number is required")
    .max(50, "Phone number must be less than 50 characters")
    .regex(/^[+\d\s\-()]+$/, "Phone number can only contain digits, spaces, and + - ( )"),
  
  estimated_units_per_month: z.number()
    .int("Must be a whole number")
    .min(0, "Cannot be negative")
    .max(10000000, "Value too large")
    .nullable()
    .optional(),
  
  receiving_format: z.enum(["pallets", "cartons", "both"], {
    errorMap: () => ({ message: "Invalid receiving format" })
  }),
  
  extra_prep: z.boolean(),
  
  storage: z.boolean(),
  
  storage_units_per_month: z.number()
    .int("Must be a whole number")
    .min(0, "Cannot be negative")
    .max(100000, "Value too large")
    .nullable()
    .optional(),
  
  storage_method: z.enum(["shelf_storage", "cubic_foot_storage"])
    .nullable()
    .optional(),
  
  admin_notes: z.string()
    .max(5000, "Admin notes must be less than 5000 characters")
    .optional(),
  
  fulfillment_services: z.array(
    z.enum(["fba_prep", "wfs_prep", "tiktok_prep", "self_fulfilled", "shopify", "returns_processing"])
  ).max(10, "Too many fulfillment services selected"),
  
  pricing_document_url: z.string()
    .max(500, "URL too long")
    .nullable()
    .optional(),
});

export type ClientUpdateData = z.infer<typeof clientUpdateSchema>;
