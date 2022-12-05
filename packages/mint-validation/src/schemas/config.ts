import { z } from "zod";

import { colorsSchema } from "./colors";
import { faviconSchema } from "./favicon";
import { nameSchema } from "./name";
import { versionsSchema } from "./versions";
import { navigationConfigSchema } from "./navigation";
import { anchorsSchema } from "./anchors";
import { analyticsSchema } from "./analytics";

const logoSchema = z
  .string()
  .optional()
  .or(
    z.object({
      light: z.string(),
      dark: z.string(),
      href: z.string().optional(),
    })
  )
  .optional();

const apiSchema = z
  .object({
    baseUrl: z.string().or(z.array(z.string())),
    auth: z
      .object({
        method: z.string(),
        name: z.string().optional(),
        inputPrefix: z.string().optional(),
      })
      .optional(),
  })
  .optional();

const modeToggleSchema = z
  .object({
    default: z.string().optional(),
    isHidden: z.boolean().optional(),
  })
  .optional();

const CtaButtonSchema = z.object({
  url: z.string(),
  type: z
    .union([z.literal("github"), z.literal("link"), z.string()])
    .optional(),
  name: z.string().optional(),
});

const footerSocialsSchema = z
  .union([
    z.array(z.object({ type: z.string(), url: z.string() })),
    z.record(z.string()),
  ])
  .optional();

const classesSchema = z
  .object({
    anchors: z.string().optional(),
    activeAnchors: z.string().optional(),
    topbarCtaButton: z.string().optional(),
    navigationItem: z.string().optional(),
    logo: z.string().optional(),
  })
  .optional();

const integrationsSchema = z
  .object({ intercom: z.string().optional() })
  .optional();

const __injectedSchema = z
  .object({ analytics: analyticsSchema.optional() })
  .optional();

export const configSchema = z.object({
  mintlify: z.string().optional(),
  name: nameSchema,
  logo: logoSchema,
  favicon: faviconSchema,
  openApi: z.string().optional(),
  api: apiSchema,
  modeToggle: modeToggleSchema,
  versions: versionsSchema,
  metadata: z.any(),
  colors: colorsSchema,
  topbarCtaButton: CtaButtonSchema,
  topbarLinks: z.array(CtaButtonSchema).optional(),
  navigation: navigationConfigSchema,
  topAnchor: z.object({ name: z.string() }),
  anchors: anchorsSchema,
  footerSocials: footerSocialsSchema,
  classes: classesSchema,
  backgroundImage: z.string().optional(),
  analytics: analyticsSchema,
  integrations: integrationsSchema,
  __injected: __injectedSchema,
});
