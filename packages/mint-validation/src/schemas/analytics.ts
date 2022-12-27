import { z } from "zod";

const amplitudeConfigInterfaceSchema = z.object(
  {
    apiKey: z.string({
      required_error: "Amplitude apiKey is missing.",
      invalid_type_error: "Amplitude apiKey must be a string.",
    }),
  },
  {
    invalid_type_error:
      "Amplitude analytics config must be an object with an apiKey property.",
  }
);

const fathomConfigInterfaceSchema = z.object(
  {
    siteId: z.string({
      required_error: "Fathom siteId is missing.",
      invalid_type_error: "Fathom siteId must be a string.",
    }),
  },
  {
    invalid_type_error:
      "Fathom analytics config must be an object with a siteId property.",
  }
);

const googleAnalyticsConfigInterfaceSchema = z.object(
  {
    measurementId: z
      .string({
        required_error: "Google Analytics measurementId is missing.",
        invalid_type_error: "Google Analytics measurementId must be a string.",
      })
      .startsWith("G", "Google Analytics measurementId must start with G."),
  },
  {
    invalid_type_error:
      "Google Analytics config must be an object with a measurementId property.",
  }
);

const googleTagManagerConfigInterfaceSchema = z.object(
  {
    tagId: z
      .string({
        required_error: "Google Tag Manager tagId is missing.",
        invalid_type_error: "Google Tag Manager tagId must be a string.",
      })
      .startsWith("G", "Google Tag Manager tagId must start with G."),
  },
  {
    invalid_type_error:
      "Google Tag Manager config must be an object with a tagId property.",
  }
);

const hotjarConfigInterfaceSchema = z.object(
  {
    hjid: z.string({
      required_error: "Hotjar hjid is missing.",
      invalid_type_error: "Hotjar hjid must be a string.",
    }),
    hjsv: z.string({
      required_error: "Hotjar hjsv is missing.",
      invalid_type_error: "Hotjar hjsv must be a string.",
    }),
  },
  {
    invalid_type_error:
      "Hotjar config must be an object with a hjid and hjsv property.",
  }
);

const logrocketConfigInterfaceSchema = z.object(
  {
    appId: z.string({
      required_error: "Logrocket appId is missing.",
      invalid_type_error: "Logrocket appId must be a string.",
    }),
  },
  {
    invalid_type_error:
      "Logrocket config must be an object with an appId property.",
  }
);

const mixpanelConfigInterfaceSchema = z.object(
  {
    projectToken: z.string({
      required_error: "Mixpanel projectToken is missing.",
      invalid_type_error: "Mixpanel projectToken must be a string.",
    }),
  },
  {
    invalid_type_error:
      "Mixpanel config must be an object with a projectToken property.",
  }
);

const pirschConfigInterfaceSchema = z.object(
  {
    id: z.string({
      required_error: "Pirsch id is missing.",
      invalid_type_error: "Pirsch id must be a string.",
    }),
  },
  { invalid_type_error: "Pirsch config must be an object with an id property." }
);

const postHogConfigInterfaceSchema = z.object(
  {
    apiKey: z
      .string({
        required_error: "Posthog apiKey is missing.",
        invalid_type_error: "Posthog apiKey must be a string.",
      })
      .startsWith("phc_", "Posthog apiKey must start with phc_"),
    apiHost: z
      .string({ invalid_type_error: "Posthog apiHost must be a string." })
      .url("Posthog apiHost must be a valid URL.")
      .optional(),
  },
  {
    invalid_type_error:
      "Posthog config must be an object with an apiKey property.",
  }
);

const plausibleConfigInterfaceSchema = z.object(
  {
    domain: z
      .string({
        required_error: "Plausible domain is missing.",
        invalid_type_error: "Plausible domain must be a string.",
      })
      .refine(
        (domain) =>
          !domain.startsWith("http://") && !domain.startsWith("https://"),
        "Plausible domain must not start with http:// or https://"
      ),
  },
  {
    invalid_type_error:
      "Plausible config must be an object with a domain property. The domain must not start with http:// or https://.",
  }
);

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
  .strict(
    "Mintlify only supports analytics integrations from: amplitude, fathom, ga4, gtm, hotjar, logrocket, mixpanel, pirsch, posthog, and plausible."
  );
