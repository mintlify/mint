import { z } from "zod";
import { NavigationType } from "@/types/navigation";

const navigationSchema: z.ZodType<NavigationType> = z.lazy(() =>
  z.object({
    group: z.string().min(1, "Group cannot be an empty string"),
    pages: z
      .array(navigationSchema)
      .min(1, "Pages array can't be empty")
      .or(z.array(z.string()).min(1, "Warning: Pages array can't be empty")),
    version: z.string().optional(),
  })
);

export const navigationConfigSchema = z
  .array(navigationSchema)
  .min(1, "Navigation is missing");
