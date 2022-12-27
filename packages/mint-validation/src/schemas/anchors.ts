import { z } from "zod";
import { anchorColorSchema } from "./anchorColors";

export const anchorsSchema = z
  .object({
    name: z
      .string({
        required_error: "Every anchor must have a name.",
        invalid_type_error: "Anchor name must be a string.",
      })
      .trim()
      .min(1, "Anchor name is empty."),
    url: z
      .string({
        required_error: "Every anchor must have a url",
        invalid_type_error: "Anchor url must be a string.",
      })
      .trim()
      .min(1, "Anchor URL is missing."),
    icon: z
      .string({
        invalid_type_error:
          "Anchor icon must be the name of a Font Awesome icon. Visit this link to see all the available icons: https://fontawesome.com/icons",
      })
      .refine(
        (iconStr) => !iconStr.startsWith("fa-"),
        'icon does not need to start with "fa-". Please delete "fa-" and keep the rest of the icon name.'
      )
      .optional(),
    color: anchorColorSchema.optional(),
    isDefaultHidden: z
      .boolean({
        invalid_type_error:
          "Anchor isDefaultHidden must be a boolean. Try writing true or false without quotes around them.",
      })
      .optional(),
    version: z
      .string({
        invalid_type_error: "Version must be a string in the versions array.",
      })
      .optional(),
  })
  .array()
  .optional();
