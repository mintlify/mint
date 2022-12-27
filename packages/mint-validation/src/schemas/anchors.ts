import { z } from "zod";
import { isHexadecimal } from "../utils/isHexadecimal";

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
    icon: z.string().optional(),
    color: z
      .union([
        z
          .string({ invalid_type_error: "Anchor color must be a string." })
          .refine(
            (val) => isHexadecimal(val),
            "Anchor color must be a hexadecimal color."
          ),
        z
          .object({
            from: z
              .string({
                invalid_type_error: "Anchor color.from must be a string.",
              })
              .refine(
                (val) => isHexadecimal(val),
                "Anchor color.from must be a hexadecimal color."
              ),
            via: z
              .string({
                invalid_type_error: "Anchor color.via must be a string.",
              })
              .refine(
                (val) => isHexadecimal(val),
                "Anchor color.via must be undefined or a hexadecimal color."
              )
              .optional(),
            to: z
              .string({
                invalid_type_error: "Anchor color.to must be a string.",
              })
              .refine(
                (val) => isHexadecimal(val),
                "Anchor color.to must be a hexadecimal color."
              ),
          })
          .strict(
            "Anchors with gradient colors can only have properties from, via, and to with valid hexadecimal colors."
          ),
      ])
      .optional(),
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
