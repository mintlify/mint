import { z } from "zod";

export const anchorsSchema = z
  .object({
    name: z.string().trim().min(1, "Anchor name is missing"),
    url: z.string().trim().min(1, "Anchor URL is missing"),
    icon: z.string().optional(),
    color: z.string().optional(),
    isDefaultHidden: z.boolean().optional(),
    version: z.string().optional(),
  })
  .array()
  .optional();
