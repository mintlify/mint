import { z } from "zod";
import { isHexadecimal } from "../utils/isHexadecimal";

export const colorsSchema = z
  .object({
    primary: z
      .string({ invalid_type_error: "Primary color must be a string." })
      .min(1, "Color primary is missing.")
      .refine(
        (val) => isHexadecimal(val),
        "Primary color must be a hexadecimal color."
      ),
    light: z
      .string({ invalid_type_error: "Light color must be a string." })
      .refine(
        (val) => isHexadecimal(val),
        "Light color must be a hexadecimal color."
      )
      .optional(),
    dark: z
      .string({ invalid_type_error: "Dark color must be a string." })
      .refine(
        (val) => isHexadecimal(val),
        "Dark color must be a hexadecimal color."
      )
      .optional(),
    ultraLight: z
      .string({ invalid_type_error: "UltraLight color must be a string." })
      .refine(
        (val) => isHexadecimal(val),
        "UltraLight color must be a hexadecimal color."
      )
      .optional(),
    ultraDark: z
      .string({ invalid_type_error: "UltraDark color must be a string." })
      .refine(
        (val) => isHexadecimal(val),
        "UltraDark color must be a hexadecimal color."
      )
      .optional(),
    background: z
      .object({
        light: z
          .string({
            invalid_type_error: "Background light color must be a string.",
          })
          .refine(
            (val) => isHexadecimal(val),
            "Background light color must be a hexadecimal color."
          )
          .optional(),
        dark: z
          .string({
            invalid_type_error: "Background dark color must be a string.",
          })
          .refine(
            (val) => isHexadecimal(val),
            "Background dark color must be a hexadecimal color."
          )
          .optional(),
      })
      .optional(),
  })
  .strict("Some of the colors in mint.json are invalid.");
