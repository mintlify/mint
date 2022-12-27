import { z } from "zod";

import { colorsSchema } from "./colors";
import { faviconSchema } from "./favicon";
import { nameSchema } from "./name";
import { versionsSchema } from "./versions";
import { navigationConfigSchema } from "./navigation";
import { anchorsSchema } from "./anchors";
import { analyticsSchema } from "./analytics";

const logoSchema = z
  .union(
    [
      z.string(),
      z.object({
        light: z.string(),
        dark: z.string(),
        href: z.string().optional(),
      }),
    ],
    {
      invalid_type_error:
        "Logo must be a string or an object with light and dark properties.",
    }
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
    isHidden: z
      .boolean({
        invalid_type_error:
          "isHidden must be a boolean. Try writing true or false without the quotes.",
      })
      .optional(),
  })
  .optional();

const CtaButtonSchema = z.object({
  url: z
    .string({
      required_error: "topbarCtaButton.url is missing",
      invalid_type_error: "topbarCtaButton.url must be a string",
    })
    .url("topbarCtaButton.url must be a valid URL"),
  type: z
    .union([z.literal("github"), z.literal("link"), z.string()])
    .optional(),
  name: z.string().optional(),
});

const footerSocialsSchema = z
  .union(
    [
      z.array(
        z.object({
          type: z.string(),
          url: z.string().url("footerSocials url must be a valid url"),
        })
      ),
      z.record(
        z
          .string()
          .trim()
          .min(
            1,
            "footerSocials name (the key in the object) must not be empty"
          ),
        z
          .string()
          .url(
            "footerSocials url (the value in the object) must be a valid url"
          )
      ),
    ],
    {
      invalid_type_error:
        'footerSocials must be an object where the key is the name of the social media and the value is the url to your profile. For example: { "twitter": "https://twitter.com/mintlify" }',
    }
  )
  .optional();

const integrationsSchema = z
  .object({
    intercom: z
      .string({ invalid_type_error: "integrations.intercom must be a string" })
      .min(6, "integrations.intercom must be a valid Intercom app ID")
      .optional(),
  })
  .optional();

const __injectedSchema = z
  .object({ analytics: analyticsSchema.optional() })
  .optional();

export const configSchema = z.object({
  mintlify: z.string().optional(),
  name: nameSchema,
  logo: logoSchema,
  favicon: faviconSchema,
  openApi: z
    .string({
      invalid_type_error:
        "openApi must be a URL pointing to your OpenAPI file. If you are using a local file, you can delete the openApi property in mint.json",
    })
    .url(
      "openApi must be a valid URL. If the openapi file is in your Mintlify folder, we will detect it automatically and you can delete the openApi property in mint.json"
    )
    .optional(),
  api: apiSchema,
  modeToggle: modeToggleSchema,
  versions: versionsSchema,
  metadata: z.any(),
  colors: colorsSchema,
  topbarCtaButton: CtaButtonSchema,
  topbarLinks: z.array(CtaButtonSchema).optional(),
  navigation: navigationConfigSchema,
  topAnchor: z.object({
    name: z.string({
      required_error:
        "topAnchor.name is missing, set it or delete the entire topAnchor property.",
      invalid_type_error: "topAnchor.name must be a string",
    }),
    url: z.string({
      required_error:
        "topAnchor.url is missing, set it or delete the entire topAnchor property.",
      invalid_type_error: "topAnchor.url must be a string",
    }),
  }),
  anchors: anchorsSchema,
  footerSocials: footerSocialsSchema,
  backgroundImage: z.string().optional(),
  analytics: analyticsSchema,
  integrations: integrationsSchema,
  __injected: __injectedSchema,
});
