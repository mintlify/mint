import { z } from "zod";

export const versionsSchema = z
  .array(z.string())
  .min(1, "Versions is missing")
  .optional();
