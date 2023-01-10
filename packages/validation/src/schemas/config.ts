import { z } from "zod";

import { colorsSchema } from "./colors";
import { faviconSchema } from "./favicon";
import { nameSchema } from "./name";
import { versionsSchema } from "./versions";
import { navigationConfigSchema } from "./navigation";
import { anchorsSchema } from "./anchors";
import { analyticsSchema } from "./analytics";

const logoSchema = z.union(
  [
    z
      .string()
      .min(
        3,
        "Logo needs to be a path to your logo file including the file extension."
      ),
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
);

const apiSchema = z.object(
  {
    baseUrl: z
      .union([
        z.string().url("api.baseUrl must be a valid URL."),
        z.array(
          z.string().url("api.baseUrl array entries must be valid URLs.")
        ),
      ])
      .optional(),
    auth: z
      .object({
        method: z.string().optional(),
        name: z.string().optional(),
        inputPrefix: z.string().optional(),
      })
      .strict("api.auth can only contain method, name, and inputPrefix.")
      .optional(),
  },
  { invalid_type_error: "api must be an object with a baseUrl property." }
);

const modeToggleSchema = z.object({
  default: z.string().optional(),
  isHidden: z
    .boolean({
      invalid_type_error:
        "isHidden must be a boolean. Try writing true or false without the quotes.",
    })
    .optional(),
});

const createCtaButtonSchema = (ctaButtonName: string) =>
  z.union(
    [
      z
        .object({
          type: z.literal("link").optional(),
          name: z.string({
            required_error: "Name must be defined when using a CTA button",
            invalid_type_error: "Name must be a string",
          }),
          url: z
            .string({
              required_error: ctaButtonName + ".url is missing",
              invalid_type_error: ctaButtonName + ".url must be a string",
            })
            .min(1, ctaButtonName + ".url cannot be empty"),
        })
        .strict(
          ctaButtonName +
            " can only contain name, url, and type properties. Set a different type if you need to set other fields."
        ),
      z
        .object({
          type: z.literal("github"),
          url: z
            .string({
              required_error:
                ctaButtonName +
                ".url is missing. Please set the url to a link to your GitHub repository.",
              invalid_type_error:
                ctaButtonName +
                ".url must be a string. Specifically, set the url to a link to your GitHub repository.",
            })
            .url(
              ctaButtonName +
                ".url must be a valid url pointing to your GitHub repository."
            ),
        })
        .strict(
          ctaButtonName +
            ' can only contain url and type properties when type="github". Please delete any other properties you have set.'
        ),
    ],
    {
      invalid_type_error:
        ctaButtonName +
        ' must be an object. The object can have type="link" (the default) if you define a url and a name. You can also have type="github" if you define a url pointing to your GitHub repo and set the type in the object.',
    }
  );

const footerSocialsSchema = z.union(
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
        .min(1, "footerSocials name (the key in the object) must not be empty"),
      z
        .string()
        .url("footerSocials url (the value in the object) must be a valid url")
    ),
  ],
  {
    invalid_type_error:
      'footerSocials must be an object where the key is the name of the social media and the value is the url to your profile. For example: { "twitter": "https://twitter.com/mintlify" }',
  }
);

const integrationsSchema = z.object(
  {
    intercom: z
      .string({ invalid_type_error: "integrations.intercom must be a string" })
      .min(6, "integrations.intercom must be a valid Intercom app ID")
      .optional(),
  },
  { invalid_type_error: "integrations must be an object" }
);

export const configSchema = z.object({
  mintlify: z.string().optional(),
  name: nameSchema,
  logo: logoSchema.optional(),
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
  api: apiSchema.optional(),
  modeToggle: modeToggleSchema.optional(),
  versions: versionsSchema.optional(),
  metadata: z
    .record(
      z.string({ invalid_type_error: "metadata keys must be strings" }),
      z
        .string({ invalid_type_error: "metadata values must be strings" })
        .min(1, "metadata values must not be empty")
    )
    .optional(),
  colors: colorsSchema,
  topbarCtaButton: createCtaButtonSchema("topbarCtaButton").optional(),
  topbarLinks: z.array(createCtaButtonSchema("topbarLinks")).optional(),
  navigation: navigationConfigSchema,
  topAnchor: z
    .object(
      {
        name: z.string({
          required_error:
            "topAnchor.name is missing, set it or delete the entire topAnchor property.",
          invalid_type_error: "topAnchor.name must be a string",
        }),
        icon: z
          .string({
            invalid_type_error: "topAnchor.icon must be a string",
          })
          .optional(),
      },
      {
        invalid_type_error:
          "topAnchor must be an object with a name property. Delete the topAnchor if you don't want to customize the values.",
      }
    )
    .strict("topAnchor can only have name and icon properties.")
    .optional(),
  anchors: anchorsSchema.optional(),
  footerSocials: footerSocialsSchema.optional(),
  backgroundImage: z.string().optional(),
  analytics: analyticsSchema.optional(),
  integrations: integrationsSchema.optional(),
  __injected: z.undefined({
    invalid_type_error:
      "Do not add __injected to mint.json. Mintlify uses this property internally.",
  }),
});
