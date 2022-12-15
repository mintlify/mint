import { z } from "zod";

const amplitudeConfigInterfaceSchema = z.object({
  apiKey: z.string({ required_error: "Amplitude apiKey is missing" }),
});

const fathomConfigInterfaceSchema = z.object({
  siteId: z.string({ required_error: "Fathom siteId is missing" }),
});

const googleAnalyticsConfigInterfaceSchema = z.object({
  measurementId: z.string({
    required_error: "Google Analytics measurementId is missing",
  }),
});

const googleTagManagerConfigInterfaceSchema = z.object({
  tagId: z.string({
    required_error: "Google Tag Manager tagId is missing",
  }),
});

const hotjarConfigInterfaceSchema = z.object({
  hjid: z.string({ required_error: "Hotjar hjid is missing" }),
  hjsv: z.string({ required_error: "Hotjar hjsv is missing" }),
});

const logrocketConfigInterfaceSchema = z.object({
  appId: z.string({ required_error: "Logrocket appId is missing" }),
});

const mixpanelConfigInterfaceSchema = z.object({
  projectToken: z.string({
    required_error: "Mixpanel projectToken siteId is missing",
  }),
});

const pirschConfigInterfaceSchema = z.object({
  id: z.string({ required_error: "Pirsch id is missing" }),
});

const postHogConfigInterfaceSchema = z.object({
  apiKey: z.string({
    required_error: "Posthog apiKey is missing",
  }),
  apiHost: z
    .string()
    .startsWith("http", "Posthog apiHost must start with http or https")
    .optional(),
});

const plausibleConfigInterfaceSchema = z.object({
  domain: z.string({ required_error: "Plausible domain is missing" }),
});

export const analyticsSchema = z
  .object({
    amplitude: amplitudeConfigInterfaceSchema.optional(),
    fathom: fathomConfigInterfaceSchema.optional(),
    ga4: googleAnalyticsConfigInterfaceSchema.optional(),
    gtm: googleTagManagerConfigInterfaceSchema.optional(),
    logrocket: logrocketConfigInterfaceSchema.optional(),
    hotjar: hotjarConfigInterfaceSchema.optional(),
    mixpanel: mixpanelConfigInterfaceSchema.optional(),
    pirsch: pirschConfigInterfaceSchema.optional(),
    posthog: postHogConfigInterfaceSchema.optional(),
    plausible: plausibleConfigInterfaceSchema.optional(),
  })
  .optional();
