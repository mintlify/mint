import { z } from "zod";

export const AnalyticsSchema = z.object({
  amplitude: z
    .object({
      apiKey: z.string({ required_error: "Amplitude apiKey is missing" }),
    })
    .optional(),
  fathom: z
    .object({
      siteId: z.string({ required_error: "Fathom siteId is missing" }),
    })
    .optional(),
  ga4: z
    .object({
      measurementId: z.string({
        required_error: "Google Analytics measurementId is missing",
      }),
    })
    .optional(),
  logrocket: z
    .object({
      appId: z.string({ required_error: "Logrocket appId is missing" }),
    })
    .optional(),
  mixpanel: z
    .object({
      projectToken: z.string({
        required_error: "Mixpanel projectToken siteId is missing",
      }),
    })
    .optional(),
  pirsch: z
    .object({
      id: z.string({ required_error: "Pirsch id is missing" }),
    })
    .optional(),
  posthog: z
    .object({
      apiKey: z.string({
        required_error: "Posthog apiKey is missing",
      }),
      apiHost: z.string({
        required_error: "Posthog apiHost is missing",
      }),
    })
    .optional(),
});

export type AnalyticsType = z.infer<typeof AnalyticsSchema>;
