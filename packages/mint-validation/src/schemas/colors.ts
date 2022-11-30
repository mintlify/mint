import { z } from "zod";

const hexadecimalPattern = /^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;

function isHexadecimal(color: string): boolean {
  return hexadecimalPattern.test(color);
}

export const colorsSchema = z
  .object({
    primary: z
      .string()
      .min(1, "Color primary is missing")
      .refine(
        (val) => isHexadecimal(val),
        "primary color must be a hexadecimal value"
      ),
    light: z
      .string()
      .refine(
        (val) => isHexadecimal(val),
        "light color must be a hexadecimal value"
      )
      .optional(),
    dark: z
      .string()
      .refine(
        (val) => isHexadecimal(val),
        "dark color must be a hexadecimal value"
      )
      .optional(),
    ultraLight: z
      .string()
      .refine(
        (val) => isHexadecimal(val),
        "ultraLight color must be a hexadecimal value"
      )
      .optional(),
    ultraDark: z
      .string()
      .refine(
        (val) => isHexadecimal(val),
        "ultraDark color must be a hexadecimal value"
      )
      .optional(),
    background: z
      .object({
        light: z
          .string()
          .refine(
            (val) => isHexadecimal(val),
            "background light color must be a hexadecimal value"
          )
          .optional(),
        dark: z
          .string()
          .refine(
            (val) => isHexadecimal(val),
            "background dark color must be a hexadecimal value"
          )
          .optional(),
      })
      .optional(),
  })
  .strict("Some of the keys are not valid");
