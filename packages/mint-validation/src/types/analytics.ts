import { z } from "zod";
import { analyticsSchema } from "@/schemas/analytics";

export type AnalyticsType = z.infer<typeof analyticsSchema>;
