import { z } from "zod";
import { anchorColorSchema } from "./anchorColors";
import { hexadecimalPattern } from "../utils/hexadecimalPattern";

export const colorsSchema = z
  .object(
    {
      primary: z
        .string({ invalid_type_error: "Primary color must be a string." })
        .min(1, "Color primary is missing.")
        .regex(
          hexadecimalPattern,
          "Primary color must be a hexadecimal color including the # at the start."
        ),
      light: z
        .string({ invalid_type_error: "Light color must be a string." })
        .regex(
          hexadecimalPattern,
          "Light color must be a hexadecimal color including the # at the start."
        )
        .optional(),
      dark: z
        .string({ invalid_type_error: "Dark color must be a string." })
        .regex(
          hexadecimalPattern,
          "Dark color must be a hexadecimal color including the # at the start."
        )
        .optional(),
      ultraLight: z
        .string({ invalid_type_error: "UltraLight color must be a string." })
        .regex(
          hexadecimalPattern,
          "UltraLight color must be a hexadecimal color including the # at the start."
        )
        .optional(),
      ultraDark: z
        .string({ invalid_type_error: "UltraDark color must be a string." })
        .regex(
          hexadecimalPattern,
          "UltraDark color must be a hexadecimal color including the # at the start."
        )
        .optional(),
      background: z
        .object({
          light: z
            .string({
              invalid_type_error: "Background light color must be a string.",
            })
            .regex(
              hexadecimalPattern,
              "Background light color must be a hexadecimal color including the # at the start."
            )
            .optional(),
          dark: z
            .string({
              invalid_type_error: "Background dark color must be a string.",
            })
            .regex(
              hexadecimalPattern,
              "Background dark color must be a hexadecimal color including the # at the start."
            )
            .optional(),
        })
        .optional(),
      anchors: anchorColorSchema.optional(),
    },
    {
      required_error:
        'Colors are missing. You need to define at least the primary color. For example: { "colors": { "primary": "#ff0000" } }',
      invalid_type_error: "Colors must be an object.",
    }
  )
  .strict(
    "Some of the colors in mint.json are invalid. We only accept primary, light, dark, ultraLight, ultraDark, background, and anchors."
  );
